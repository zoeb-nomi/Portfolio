// Process client logo marks into a clean monochrome ink treatment on
// transparent background for the Work page margin column.
//
// Technique: for each 2-colour source (flat bg + flat fg), "unblend" the
// anti-aliased edge pixels by projecting each pixel onto the bg->fg colour
// line. That recovers a smooth alpha channel (0 at bg, 1 at fg) without any
// hard fuzz cutoff / colour fringing, then the fg is recoloured to ink
// (#191713) at that alpha. Hurix's wordmark is multicolour on white, so it
// uses a simpler "distance from white" alpha instead of a two-colour line.
//
// Usage: node scripts/process-logos.mjs

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../../assets/logos');
const OUT = path.resolve(__dirname, '../public/img/logos');

const INK = [0x19, 0x17, 0x13]; // #191713
const EXPORT_HEIGHT_2X = 48; // 2x export for ~24px CSS display height

async function unblendToInk(inputBuffer, bg, fg) {
  const img = sharp(inputBuffer).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  const dbg = [fg[0] - bg[0], fg[1] - bg[1], fg[2] - bg[2]];
  const denom = dbg[0] * dbg[0] + dbg[1] * dbg[1] + dbg[2] * dbg[2];

  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    const srcAlpha = channels === 4 ? data[i + 3] / 255 : 1;
    const dp = [data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]];
    let alpha = (dp[0] * dbg[0] + dp[1] * dbg[1] + dp[2] * dbg[2]) / denom;
    alpha = Math.max(0, Math.min(1, alpha)) * srcAlpha;

    const o = p * 4;
    out[o] = INK[0];
    out[o + 1] = INK[1];
    out[o + 2] = INK[2];
    out[o + 3] = Math.round(alpha * 255);
  }

  return sharp(out, { raw: { width, height, channels: 4 } }).png();
}

async function whiteBgToInk(inputBuffer, { thresholdLo = 30, thresholdHi = 140 } = {}) {
  const img = sharp(inputBuffer).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  const bg = [255, 255, 255];

  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    const srcAlpha = channels === 4 ? data[i + 3] / 255 : 1;
    const dist = Math.sqrt(
      (data[i] - bg[0]) ** 2 + (data[i + 1] - bg[1]) ** 2 + (data[i + 2] - bg[2]) ** 2
    );
    let alpha = (dist - thresholdLo) / (thresholdHi - thresholdLo);
    alpha = Math.max(0, Math.min(1, alpha)) * srcAlpha;

    const o = p * 4;
    out[o] = INK[0];
    out[o + 1] = INK[1];
    out[o + 2] = INK[2];
    out[o + 3] = Math.round(alpha * 255);
  }

  return sharp(out, { raw: { width, height, channels: 4 } }).png();
}

async function finalize(img, outPath) {
  const trimmed = await img.trim({ threshold: 10 }).toBuffer();
  await sharp(trimmed)
    .resize({ height: EXPORT_HEIGHT_2X, fit: 'inside' })
    .png({ compressionLevel: 9, palette: true })
    .toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`  -> ${path.basename(outPath)} (${meta.width}x${meta.height})`);
}

async function main() {
  console.log('multiplier');
  {
    const buf = await sharp(path.join(SRC, 'multiplier-src.png')).toBuffer();
    const img = await unblendToInk(buf, [247, 104, 25], [251, 247, 238]);
    await finalize(img, path.join(OUT, 'multiplier.png'));
  }

  console.log('keka');
  {
    const buf = await sharp(path.join(SRC, 'keka-src.png')).toBuffer();
    const img = await unblendToInk(buf, [85, 18, 177], [255, 255, 255]);
    await finalize(img, path.join(OUT, 'keka.png'));
  }

  console.log('instead');
  {
    const buf = await sharp(path.join(SRC, 'instead-src.png')).toBuffer();
    const img = await unblendToInk(buf, [194, 238, 115], [35, 51, 32]);
    await finalize(img, path.join(OUT, 'instead.png'));
  }

  console.log('hurix');
  {
    // Crop to just the "hurixdigital" wordmark row — excludes the "25
    // YEARS" anniversary mark above and the "VISION TO INNOVATION" tagline
    // (+ sparkle glyph) below. Bounds derived from a per-row pixel scan of
    // the 200x200 source.
    const cropped = await sharp(path.join(SRC, 'hurix-src.png'))
      .extract({ left: 19, top: 150, width: 144, height: 27 })
      .toBuffer();
    const img = await whiteBgToInk(cropped);
    await finalize(img, path.join(OUT, 'hurix.png'));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
