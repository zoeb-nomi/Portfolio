// Generate the 4:5 headshot set used by the About masthead plate.
//
// The crop reproduces exactly what the CSS produced before: a 1:1 source in a
// 4:5 box under `object-fit: cover` overflows horizontally, never vertically,
// so `object-position: center 12%` resolves to "centre horizontally, full
// height" — the 12% vertical offset is a no-op at this ratio. So: keep the
// whole height, take 4/5 of the width from the centre.
//
// The source is 960x960, which yields a native 768x960 crop. The 480w variant
// is a true downscale; the 960w variant is upscaled 1.25x for parity with the
// square set (the plate renders at 224 CSS px, so 480w already covers 2x DPR).
//
// Run: node scripts/process-headshot-4x5.mjs

import sharp from 'sharp';
import { statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public/zoeb-nomi.jpg');
const OUT = path.join(ROOT, 'public/img');

const RATIO_W = 4;
const RATIO_H = 5;
const WIDTHS = [480, 960];

const QUALITY = { jpeg: 82, webp: 80, avif: 50 };

const meta = await sharp(SRC).metadata();
const cropW = Math.round(Math.min(meta.width, (meta.height * RATIO_W) / RATIO_H));
const cropH = Math.round(Math.min(meta.height, (meta.width * RATIO_H) / RATIO_W));
const left = Math.round((meta.width - cropW) / 2);
const top = Math.round((meta.height - cropH) / 2);

console.log(`source ${meta.width}x${meta.height} -> crop ${cropW}x${cropH} at (${left},${top})`);

const base = await sharp(SRC)
  .extract({ left, top, width: cropW, height: cropH })
  .toBuffer();

const rows = [];
for (const w of WIDTHS) {
  const h = Math.round((w * RATIO_H) / RATIO_W);
  const resized = sharp(base).resize(w, h, { kernel: 'lanczos3', fit: 'fill' });
  for (const [ext, fn] of [
    ['jpg', (p) => p.jpeg({ quality: QUALITY.jpeg, mozjpeg: true })],
    ['webp', (p) => p.webp({ quality: QUALITY.webp })],
    ['avif', (p) => p.avif({ quality: QUALITY.avif })],
  ]) {
    const file = path.join(OUT, `headshot-4x5-${w}.${ext}`);
    await fn(resized.clone()).toFile(file);
    const bytes = statSync(file).size;
    let square = null;
    try {
      square = statSync(path.join(OUT, `headshot-${w}.${ext}`)).size;
    } catch {}
    rows.push({ file: path.basename(file), dims: `${w}x${h}`, bytes, squareBytes: square });
  }
}

console.table(rows);
const tot = rows.reduce((a, r) => a + r.bytes, 0);
const sq = rows.reduce((a, r) => a + (r.squareBytes ?? 0), 0);
console.log(`4:5 set ${tot} B vs square set ${sq} B — delta ${tot - sq} B (${(((tot - sq) / sq) * 100).toFixed(1)}%)`);
