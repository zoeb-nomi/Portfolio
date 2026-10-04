#!/usr/bin/env node
// Does the narration actually say what the script says, when the cues say it?
// Transcribes every sentence of the final mix with a local Whisper model and
// compares it with the script, per sentence and overall. This is the check
// that stands in for listening to every sentence, and it catches mispronounced
// acronyms (add them to lexicon.json), dropped words, and cue drift.
//
//   npm run audio:verify -- <slug> [--model Xenova/whisper-base.en]
//
// Needs: npm run audio:build -- <slug> first (it leaves .audio-cache/<slug>/final.f32).
// Exit 1 if overall word error rate > 20% or any single sentence is more than 50% wrong.

import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { CACHE, pageFor, outPaths } from './lib/config.mjs';
import { prepare } from './lib/prepare.mjs';
import { normalizeForCompare } from './lib/spoken.mjs';

const { values, positionals } = parseArgs({ allowPositionals: true, options: { model: { type: 'string', default: 'Xenova/whisper-base.en' } } });
const slug = positionals[0];
if (!slug) { console.error('usage: npm run audio:verify -- <slug> [--model id]'); process.exit(2); }
const page = pageFor(slug);

// onnxruntime-node can abort during native teardown AFTER the work is done (exit 134,
// "mutex lock failed"). So the real work runs in a child process that writes a result
// file; this parent trusts that file, not the child's exit code.
const RESULT = path.join(CACHE, slug, 'verify.json');
if (process.env.AUDIO_VERIFY_WORKER !== '1') {
  rmSync(RESULT, { force: true });
  const child = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: ['inherit', 'inherit', 'pipe'],
    env: { ...process.env, AUDIO_VERIFY_WORKER: '1' },
  });
  // Show the child's stderr except the one known, harmless teardown message.
  const noise = /libc\+\+abi: terminating due to uncaught exception of type std::__1::system_error: mutex lock failed/;
  for (const line of String(child.stderr ?? '').split('\n')) if (line && !noise.test(line)) console.error(line);
  if (!existsSync(RESULT)) process.exit(child.status || 1);
  process.exit(JSON.parse(readFileSync(RESULT, 'utf8')).pass ? 0 : 1);
}

const manifest = JSON.parse(readFileSync(outPaths(page).manifest, 'utf8'));
const finalPcm = path.join(CACHE, slug, 'final.f32');
if (!existsSync(finalPcm)) { console.error(`${finalPcm} not found; run "npm run audio:build -- ${slug}" first`); process.exit(2); }

const buf = readFileSync(finalPcm);
const pcm24 = new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

// 24 kHz -> 16 kHz (Whisper's rate): 3-tap box pre-filter, then linear interpolation.
function to16k(x) {
  const f = new Float32Array(x.length);
  for (let i = 1; i < x.length - 1; i++) f[i] = (x[i - 1] + x[i] + x[i + 1]) / 3;
  const ratio = 24000 / 16000;
  const out = new Float32Array(Math.floor(x.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const p = i * ratio, j = Math.floor(p), t = p - j;
    out[i] = f[j] * (1 - t) + (f[j + 1] ?? f[j]) * t;
  }
  return out;
}

const { pipeline, env } = await import('@huggingface/transformers').catch(() => {
  console.error('@huggingface/transformers is not installed. Run: npm run audio:install');
  process.exit(2);
});
env.cacheDir = path.join(CACHE, 'models');
console.log(`transcribing ${Math.round(pcm24.length / 24000)}s of audio with ${values.model} (first run downloads the model) ...`);
const asr = await pipeline('automatic-speech-recognition', values.model, { dtype: 'q8' });
const audio = to16k(pcm24);

// Word error rate (Levenshtein over word arrays).
function wer(ref, hyp) {
  if (!ref.length) return hyp.length ? 1 : 0;
  let prev = Array.from({ length: hyp.length + 1 }, (_, j) => j);
  for (let i = 1; i <= ref.length; i++) {
    const cur = [i];
    for (let j = 1; j <= hyp.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1));
    prev = cur;
  }
  return { rate: prev[hyp.length] / ref.length, edits: prev[hyp.length] };
}
// Spoken letters ("K Y B") may be transcribed as one token ("KYB"); a spoken number as digits.
// Collapse runs of single letters so those do not count as errors.
const squash = (a) => a.join(' ').replace(/\b(?:[a-z] ){1,}[a-z]\b/g, (m) => m.replace(/ /g, '')).split(' ').filter(Boolean);

// Every sentence is transcribed on its own (they are all well under Whisper's 30 s window,
// so no chunking artefacts), using the sentence times from the captions file. If a cue
// or caption pointed at the wrong audio, or the voice dropped or garbled words, that
// sentence's text would not match its script. No dependence on word-level timestamps.
const SLACK = 0.15;
const segments = await prepare(page);
const sentences = segments.flatMap((s) => s.sentences.map((t) => ({ id: s.id, spoken: t.spoken, raw: t.raw })));
const vtt = readFileSync(outPaths(page).vtt, 'utf8');
const times = [...vtt.matchAll(/(\d+):(\d+):(\d+)\.(\d+) --> (\d+):(\d+):(\d+)\.(\d+)/g)].map((m) => ({
  start: +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000,
  end: +m[5] * 3600 + +m[6] * 60 + +m[7] + +m[8] / 1000,
}));
if (times.length !== sentences.length) { console.error(`captions have ${times.length} cues but the script has ${sentences.length} sentences; rebuild the audio`); process.exit(2); }

const rows = [];
let totalRef = 0, totalEdits = 0;
for (const [i, s] of sentences.entries()) {
  const ref = squash(normalizeForCompare(s.spoken));
  const refRaw = squash(normalizeForCompare(s.raw));
  const from = Math.max(0, Math.floor((times[i].start - SLACK) * 16000));
  const to = Math.min(audio.length, Math.ceil((times[i].end + SLACK) * 16000));
  const r = await asr(audio.slice(from, to));
  const hyp = squash(normalizeForCompare(r.text));
  // Whisper writes "100%" and "15/15" as symbols even when the voice said "100 percent" and
  // "15 out of 15", which is a match to the PAGE. Score against the spoken and the page form
  // and keep the better one.
  const a = wer(ref, hyp);
  const b = wer(refRaw, hyp);
  const best = b.rate < a.rate ? { ...b, ref: refRaw } : { ...a, ref };
  totalRef += best.ref.length; totalEdits += best.edits;
  rows.push({ id: s.id, rate: best.rate, edits: best.edits, words: best.ref.length, ref: best.ref.join(' '), hyp: hyp.join(' ') });
  process.stdout.write(`\rtranscribed ${rows.length}/${sentences.length} sentences   `);
}
console.log('');
await asr.dispose?.();
const overall = totalEdits / totalRef;

console.log(`\nwords expected ${totalRef}, edits ${totalEdits}`);
console.log(`overall word error rate: ${(overall * 100).toFixed(1)}%  (<= 10% good, <= 20% acceptable; Whisper base itself errs on names and numbers)`);
console.log('\nworst sentences:');
for (const r of [...rows].sort((a, b) => b.rate - a.rate).slice(0, 6)) {
  console.log(`  ${r.id.padEnd(9)} WER ${(r.rate * 100).toFixed(0).padStart(3)}%`);
  if (r.rate > 0.2) { console.log(`     script: ${r.ref.slice(0, 150)}`); console.log(`     heard : ${r.hyp.slice(0, 150)}`); }
}
// One wrong word in a 3-word label is 33% (or 67%); only judge a sentence on its own when it
// has enough words to mean something. Short ones still count toward the overall rate.
const worst = Math.max(0, ...rows.filter((r) => r.words >= 6).map((r) => r.rate));
const bad = overall > 0.2 || worst > 0.5;
writeFileSync(RESULT, JSON.stringify({ pass: !bad, overall, rows }, null, 2));
console.log(bad ? '\nVERIFY: FAIL (a sentence is mostly wrong, or overall error is above 20%; fix pronunciations in lexicon.json and rebuild)' : '\nVERIFY: PASS');
process.exit(bad ? 1 : 0);
