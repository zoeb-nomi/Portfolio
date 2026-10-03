#!/usr/bin/env node
// Does the narration actually say what the script says, when the cues say it?
// Transcribes the final mix with a local Whisper model (word timestamps) and
// compares it with the script, overall and per cue window. This is the check
// that stands in for listening to every sentence, and it catches mispronounced
// acronyms (add them to lexicon.json), dropped words, and cue drift.
//
//   npm run audio:verify -- <slug> [--model Xenova/whisper-base.en]
//
// Needs: npm run audio:build -- <slug> first (it leaves .audio-cache/<slug>/final.f32).
// Exit 1 if overall word error rate > 20% or any cue window < 50% matched.

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { CACHE, pageFor, outPaths } from './lib/config.mjs';
import { prepare } from './lib/prepare.mjs';
import { normalizeForCompare } from './lib/spoken.mjs';

const { values, positionals } = parseArgs({ allowPositionals: true, options: { model: { type: 'string', default: 'Xenova/whisper-base.en' } } });
const slug = positionals[0];
if (!slug) { console.error('usage: npm run audio:verify -- <slug> [--model id]'); process.exit(2); }
const page = pageFor(slug);
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
let words;
try {
  const r = await asr(audio, { return_timestamps: 'word', chunk_length_s: 30, stride_length_s: 5 });
  words = r.chunks.map((c) => ({ w: normalizeForCompare(c.text)[0] ?? '', t0: c.timestamp[0], t1: c.timestamp[1] ?? c.timestamp[0] })).filter((x) => x.w);
} catch (e) {
  console.error('word timestamps unavailable for this model:', e.message);
  process.exit(2);
}

// Word error rate (Levenshtein over word arrays).
function wer(ref, hyp) {
  if (!ref.length) return hyp.length ? 1 : 0;
  let prev = Array.from({ length: hyp.length + 1 }, (_, j) => j);
  for (let i = 1; i <= ref.length; i++) {
    const cur = [i];
    for (let j = 1; j <= hyp.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[hyp.length] / ref.length;
}
// Spoken letters ("K Y B") may be transcribed as one token ("KYB"): collapse runs of single letters.
const squash = (a) => a.join(' ').replace(/\b(?:[a-z] ){1,}[a-z]\b/g, (m) => m.replace(/ /g, '')).split(' ').filter(Boolean);

const segments = await prepare(page);
const expectedAll = segments.flatMap((s) => squash(normalizeForCompare(s.sentences.map((t) => t.spoken).join(' '))));
const overall = wer(expectedAll, squash(words.map((x) => x.w)));

const SLACK = 0.4;
let worst = 1;
const rows = [];
for (const [id, start, end] of manifest.cues) {
  const seg = segments.find((s) => s.id === id);
  const ref = squash(normalizeForCompare(seg.sentences.map((t) => t.spoken).join(' ')));
  const win = words.filter((x) => (x.t0 + x.t1) / 2 >= start - SLACK && (x.t0 + x.t1) / 2 <= end + SLACK);
  const hyp = squash(win.map((x) => x.w));
  const e = wer(ref, hyp);
  worst = Math.min(worst, 1 - e);
  const drift = win.length ? win[0].t0 - start : NaN;
  rows.push({ id, wer: e, drift });
}

console.log(`\nwords expected ${expectedAll.length}, heard ${words.length}`);
console.log(`overall word error rate: ${(overall * 100).toFixed(1)}%  (<= 10% good, <= 20% acceptable)`);
console.log('\nper cue window (cue times from the manifest; "drift" = first heard word minus cue start):');
for (const r of rows.sort((a, b) => b.wer - a.wer).slice(0, 8)) console.log(`  ${r.id.padEnd(10)} WER ${(r.wer * 100).toFixed(0).padStart(3)}%   drift ${Number.isNaN(r.drift) ? 'n/a' : r.drift.toFixed(2) + 's'}`);
const drifts = rows.map((r) => Math.abs(r.drift)).filter((d) => !Number.isNaN(d));
console.log(`max |drift| ${Math.max(...drifts).toFixed(2)}s over ${rows.length} cues`);

const bad = overall > 0.2 || worst < 0.5;
console.log(bad ? '\nVERIFY: FAIL (see worst cue windows; fix pronunciations in lexicon.json and rebuild)' : '\nVERIFY: PASS');
process.exit(bad ? 1 : 0);
