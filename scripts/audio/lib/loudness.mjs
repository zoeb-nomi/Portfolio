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
 * Look-ahead brick-wall peak limiter. Speech from a TTS model is evenly leveled
 * but has rare spikes; limiting only those lets the whole file reach its
 * loudness target instead of being turned down to fit the loudest sample.
 *
 * Gain is the minimum required over a +-lookahead window, smoothed with a box
 * filter of the same width (so the gain at every sample is <= what that sample
 * needs, and moves without steps), then allowed to recover only at the release rate.
 */
export function limit(samples, sampleRate, ceilingDbfs = -1.5, lookaheadMs = 3, releaseMs = 60) {
  const n = samples.length;
  const c = Math.pow(10, ceilingDbfs / 20);
  const L = Math.max(1, Math.round((lookaheadMs / 1000) * sampleRate));
  const req = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = Math.abs(samples[i]); req[i] = a > c ? c / a : 1; }

  // Sliding minimum over [i-L, i+L] (monotonic deque, O(n)).
  const gmin = new Float32Array(n);
  const dq = new Int32Array(n);
  let head = 0, tail = 0;
  for (let i = 0, j = 0; i < n; i++) {
    const hi = Math.min(n - 1, i + L);
    while (j <= hi) { while (tail > head && req[dq[tail - 1]] >= req[j]) tail--; dq[tail++] = j++; }
    while (dq[head] < i - L) head++;
    gmin[i] = req[dq[head]];
  }

  // Box filter of width 2L+1 via a running sum; indices outside the signal count as "no reduction" (1).
  const w = 2 * L + 1;
  const val = (k) => (k < 0 || k >= n ? 1 : gmin[k]);
  const sm = new Float32Array(n);
  let run = 0;
  for (let k = -L; k <= L; k++) run += val(k);
  sm[0] = run / w;
  for (let i = 1; i < n; i++) {
    run += val(i + L) - val(i - L - 1);
    sm[i] = run / w;
  }

  // Release: gain may fall instantly (the smoothing already ramps it) but rises slowly.
  const a = 1 - Math.exp(-1 / ((releaseMs / 1000) * sampleRate));
  const out = new Float32Array(n);
  let env = 1;
  for (let i = 0; i < n; i++) {
    const target = sm[i];
    env = target < env ? target : env + (target - env) * a;
    // The recovery lag can never leave a sample above the ceiling: take the lower of env and its own need.
    const g = Math.min(env, req[i]);
    out[i] = samples[i] * g;
  }
  return out;
}

/**
 * Bring `samples` to `targetLufs` integrated loudness with the peaks held at
 * `ceilingDbfs`: find the input gain whose limited result lands on target.
 * @returns {{ samples: Float32Array, gainDb: number, lufs: number, peakDbfs: number, iterations: number }}
 */
export function normalize(samples, sampleRate, targetLufs = -19, ceilingDbfs = -1.5) {
  const measured = integratedLoudness(samples, sampleRate);
  let gainDb = targetLufs - measured;
  let best = null;
  for (let it = 1; it <= 8; it++) {
    const g = Math.pow(10, gainDb / 20);
    const scaled = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) scaled[i] = samples[i] * g;
    const out = limit(scaled, sampleRate, ceilingDbfs);
    const lufs = integratedLoudness(out, sampleRate);
    best = { samples: out, gainDb, lufs, peakDbfs: dbfs(samplePeak(out)), iterations: it };
    if (Math.abs(lufs - targetLufs) < 0.05) break;
    gainDb += targetLufs - lufs; // limiting costs a little loudness; push the input up to compensate
  }
  return best;
}
