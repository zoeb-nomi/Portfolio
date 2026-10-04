#!/usr/bin/env node
// Narration build: built page -> script -> Kokoro voice -> mixed, loudness-
// normalised mp3 + WebVTT captions + a data file the AudioPlayer consumes.
//
//   npm run audio:build -- <slug> [--dry-run] [--force] [--voice af_heart] [--speed 1]
//
//   --dry-run   print the spoken script and a duration estimate; loads no model
//   --force     ignore the per-sentence cache and re-synthesise everything
//
// Output:  public/audio/<slug>.mp3   public/audio/<slug>.vtt   src/data/audio/<slug>.json
// Cache:   .audio-cache/ (git-ignored): model files, per-sentence audio, final mix

import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { CACHE, ROOT, pageFor, outPaths } from './lib/config.mjs';
import { prepare } from './lib/prepare.mjs';
import { sha, hashSegments } from './lib/hash.mjs';
import { layout, toCues, toChapters, toCaptionCues, GAPS } from './lib/timeline.mjs';
import { normalize } from './lib/loudness.mjs';
import { toVtt } from './lib/vtt.mjs';
import { id3v23 } from './lib/id3.mjs';

const SR = 24000; // Kokoro's native rate; nothing is resampled
const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const ENGINE = 'kokoro-82m-v1.0';
const MAX_CHUNK = 300; // characters per synthesis call (model limit is ~510 phonemes)

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { 'dry-run': { type: 'boolean' }, force: { type: 'boolean' }, voice: { type: 'string' }, speed: { type: 'string' } },
});
const slug = positionals[0];
if (!slug) { console.error('usage: npm run audio:build -- <slug> [--dry-run] [--force] [--voice v] [--speed n]'); process.exit(2); }

const page = pageFor(slug);
const voice = values.voice ?? page.voice;
const speed = values.speed ? Number(values.speed) : page.speed;

// ---------- 1. the script ----------------------------------------------------
const segments = await prepare(page);
const sentenceCount = segments.reduce((n, s) => n + s.sentences.length, 0);
const chars = segments.reduce((n, s) => n + s.sentences.reduce((m, t) => m + t.spoken.length, 0), 0);
const estSeconds = Math.round(chars / 15 / speed); // ~15 spoken characters per second at 1.0x
console.log(`${slug}: ${segments.length} segments, ${sentenceCount} sentences, ${chars} spoken characters (~${Math.floor(estSeconds / 60)}m${String(estSeconds % 60).padStart(2, '0')}s)`);

const scriptFile = path.join(CACHE, slug, 'narration.txt');
mkdirSync(path.dirname(scriptFile), { recursive: true });
const scriptText = segments
  .map((s) => `[${s.id}]\n` + s.sentences.map((t) => (t.spoken === t.raw ? `  ${t.spoken}` : `  ${t.spoken}\n    (page: ${t.raw})`)).join('\n'))
  .join('\n\n');
writeFileSync(scriptFile, scriptText + '\n');
console.log(`spoken script written to ${path.relative(ROOT, scriptFile)} (lines marked "page:" were rewritten for the voice)`);
if (values['dry-run']) { console.log('\n' + scriptText); process.exit(0); }

// ---------- 2. the voice -----------------------------------------------------
const { KokoroTTS } = await import('kokoro-js').catch(() => {
  console.error('kokoro-js is not installed. Run: npm run audio:install');
  process.exit(2);
});
const { env } = await import('@huggingface/transformers');
env.cacheDir = path.join(CACHE, 'models');
console.log(`loading ${MODEL_ID} (fp32; first run downloads ~330 MB into .audio-cache/models) ...`);
const tts = await KokoroTTS.from_pretrained(MODEL_ID, { dtype: 'fp32', device: 'cpu' });

const f32 = (buf) => new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const silence = (sec) => new Float32Array(Math.round(sec * SR));

/** Split an over-long sentence at clause boundaries so each call stays inside the model's limit. */
function chunk(text) {
  if (text.length <= MAX_CHUNK) return [text];
  const parts = text.split(/(?<=[,;:])\s+/);
  const out = [];
  let cur = '';
  for (const p of parts) {
    if (cur && (cur + ' ' + p).length > MAX_CHUNK) { out.push(cur); cur = p; } else cur = cur ? cur + ' ' + p : p;
  }
  if (cur) out.push(cur);
  return out;
}

function trim(a, thr = 0.003, pad = Math.round(0.03 * SR)) {
  let s = 0, e = a.length - 1;
  while (s < e && Math.abs(a[s]) < thr) s++;
  while (e > s && Math.abs(a[e]) < thr) e--;
  const out = a.slice(Math.max(0, s - pad), Math.min(a.length, e + pad + 1));
  const fade = Math.round(0.005 * SR); // 5 ms: removes joint clicks
  for (let i = 0; i < fade && i < out.length; i++) { out[i] *= i / fade; out[out.length - 1 - i] *= i / fade; }
  return out;
}

let hits = 0, misses = 0;
async function say(spoken) {
  const key = sha([ENGINE, voice, speed, spoken].join('\u0000')).slice(0, 24);
  const file = path.join(CACHE, 'sentences', voice, `${key}.f32`);
  if (!values.force && existsSync(file)) { hits++; return f32(readFileSync(file)); }
  misses++;
  const pieces = [];
  for (const [i, c] of chunk(spoken).entries()) {
    if (i) pieces.push(silence(0.12));
    const r = await tts.generate(c, { voice, speed });
    pieces.push(Float32Array.from(r.audio));
    if (r.sampling_rate !== SR) throw new Error(`unexpected sample rate ${r.sampling_rate}`);
  }
  const all = new Float32Array(pieces.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of pieces) { all.set(p, o); o += p.length; }
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(all.buffer, all.byteOffset, all.byteLength));
  return all;
}

const t0 = Date.now();
let done = 0;
for (const seg of segments) {
  for (const s of seg.sentences) {
    s.audio = trim(await say(s.spoken));
    s.n = s.audio.length;
    process.stdout.write(`\rsynthesising ${++done}/${sentenceCount}  (cache ${hits} hit / ${misses} new)   `);
  }
}
console.log(`\nvoice done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

// ---------- 3. mix, normalise, encode -----------------------------------------
const { segments: timed, placements, totalSamples } = layout(segments, SR);
const mix = new Float32Array(totalSamples);
for (const p of placements) mix.set(segments[p.segIndex].sentences[p.sentIndex].audio, p.offset);

const norm = normalize(mix, SR, page.targetLufs, -1.5);
const final = norm.samples;
const fadeOut = Math.round(0.08 * SR);
for (let i = 0; i < fadeOut; i++) final[final.length - 1 - i] *= i / fadeOut;
console.log(`loudness ${norm.lufs.toFixed(1)} LUFS (target ${page.targetLufs}; mono, so ${page.targetLufs + 3} when played through two speakers), peak ${norm.peakDbfs.toFixed(1)} dBFS, input gain ${norm.gainDb.toFixed(1)} dB, ${norm.iterations} pass(es)`);
writeFileSync(path.join(CACHE, slug, 'final.f32'), Buffer.from(final.buffer, final.byteOffset, final.byteLength)); // read by audio:verify

const lame = await import('@breezystack/lamejs');
const Mp3Encoder = lame.Mp3Encoder ?? lame.default?.Mp3Encoder;
const enc = new Mp3Encoder(1, SR, page.bitrateKbps);
const pcm = new Int16Array(final.length);
for (let i = 0; i < final.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(final[i] * 32767)));
const frames = [];
for (let i = 0; i < pcm.length; i += 1152) {
  const b = enc.encodeBuffer(pcm.subarray(i, i + 1152));
  if (b.length) frames.push(Buffer.from(b));
}
frames.push(Buffer.from(enc.flush()));
const tag = id3v23({ title: page.title, artist: 'Zoeb Nomi', album: 'zoebnomi.com/writing', encoder: `scripts/audio (${ENGINE})` });
const mp3 = Buffer.concat([tag, ...frames]);

// ---------- 4. outputs --------------------------------------------------------
const out = outPaths(page);
for (const f of Object.values(out)) mkdirSync(path.dirname(f), { recursive: true });
writeFileSync(out.mp3, mp3);
writeFileSync(out.vtt, toVtt(toCaptionCues(timed), { title: page.title }));

const duration = totalSamples / SR;
const modelFile = path.join(CACHE, 'models', MODEL_ID, 'onnx', 'model.onnx');
const manifest = {
  src: `/audio/${slug}.mp3`,
  captions: `/audio/${slug}.vtt`,
  duration: Math.round(duration),
  label: page.label,
  note: page.note,
  chapters: toChapters(timed, page.chapterTitles),
  cues: toCues(timed),
  meta: {
    engine: ENGINE,
    voice,
    speed,
    sampleRate: SR,
    bitrateKbps: page.bitrateKbps,
    lufs: Math.round(norm.lufs * 10) / 10,
    gaps: GAPS,
    modelSha256: existsSync(modelFile) ? sha(readFileSync(modelFile)) : null,
    ...hashSegments(segments),
  },
};
// Keep number arrays on one line so the file diffs readably.
const json = JSON.stringify(manifest, null, 2).replace(/\[\s+([^[\]{}]*?)\s+\]/g, (_, inner) => `[${inner.replace(/\s*\n\s*/g, ' ')}]`);
writeFileSync(out.manifest, json + '\n');

const mb = (statSync(out.mp3).size / 1048576).toFixed(2);
console.log(`\nwrote ${path.relative(ROOT, out.mp3)} (${mb} MB, ${Math.floor(duration / 60)}:${String(Math.round(duration % 60)).padStart(2, '0')}), ${path.relative(ROOT, out.vtt)}, ${path.relative(ROOT, out.manifest)}`);
console.log('next: npm run audio:verify -- ' + slug + '   (optional ASR round-trip check)');
