// ITU-R BS.1770-4 integrated loudness (LUFS) for mono Float32 audio, plus the
// gain/peak helpers the build uses. Unit-tested against a full-scale 1 kHz sine
// (= -3.01 LUFS) in ../test/loudness.test.mjs.

// K-weighting at 48 kHz: stage 1 high shelf, stage 2 high-pass (BS.1770-4 table).
const SHELF = { b: [1.53512485958697, -2.69169618940638, 1.19839281085285], a: [1, -1.69065929318241, 0.73248077421585] };
const HPF = { b: [1, -2, 1], a: [1, -1.99004745483398, 0.99007225036621] };

function biquad(x, { b, a }) {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b[0] * x[i] + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
    y[i] = v;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v;
  }
  return y;
}

/** 2x linear upsample (24 kHz -> 48 kHz). Good enough for a loudness measurement. */
function upsample2(x) {
  const y = new Float32Array(x.length * 2);
  for (let i = 0; i < x.length; i++) {
    const next = i + 1 < x.length ? x[i + 1] : x[i];
    y[2 * i] = x[i];
    y[2 * i + 1] = (x[i] + next) / 2;
  }
  return y;
}

/** @param {Float32Array} samples @param {number} sampleRate 24000 or 48000 @returns {number} LUFS (-Infinity if silent) */
export function integratedLoudness(samples, sampleRate) {
  let x = samples;
  let sr = sampleRate;
  if (sr === 24000) { x = upsample2(x); sr = 48000; }
  if (sr !== 48000) throw new Error(`integratedLoudness: unsupported sample rate ${sampleRate}`);
  const k = biquad(biquad(x, SHELF), HPF);

  const block = Math.round(0.4 * sr);
  const step = Math.round(0.1 * sr);
  const energies = [];
  for (let start = 0; start + block <= k.length; start += step) {
    let sum = 0;
    for (let i = start; i < start + block; i++) sum += k[i] * k[i];
    energies.push(sum / block);
  }
  if (!energies.length) return -Infinity;
  const lufs = (e) => -0.691 + 10 * Math.log10(e);
  const abs = energies.filter((e) => lufs(e) > -70);
  if (!abs.length) return -Infinity;
  const meanAbs = abs.reduce((s, e) => s + e, 0) / abs.length;
  const rel = abs.filter((e) => lufs(e) > lufs(meanAbs) - 10);
  if (!rel.length) return -Infinity;
  return lufs(rel.reduce((s, e) => s + e, 0) / rel.length);
}

export function samplePeak(samples) {
  let p = 0;
  for (let i = 0; i < samples.length; i++) { const a = Math.abs(samples[i]); if (a > p) p = a; }
  return p;
}

export const dbfs = (lin) => (lin > 0 ? 20 * Math.log10(lin) : -Infinity);

/**
 * Gain (linear) that brings `samples` to `targetLufs`, reduced if needed so the
 * sample peak stays under `ceilingDbfs`. Returns the gain and what it achieved.
 */
export function gainFor(samples, sampleRate, targetLufs = -16, ceilingDbfs = -1) {
  const measured = integratedLoudness(samples, sampleRate);
  const peak = samplePeak(samples);
  let gain = Math.pow(10, (targetLufs - measured) / 20);
  const ceiling = Math.pow(10, ceilingDbfs / 20);
  const limited = peak * gain > ceiling;
  if (limited) gain = ceiling / peak;
  return {
    gain,
    limited,
    measuredLufs: measured,
    resultLufs: measured + 20 * Math.log10(gain),
    resultPeakDbfs: dbfs(peak * gain),
  };
}
