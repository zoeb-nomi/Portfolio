import test from 'node:test';
import assert from 'node:assert/strict';
import { integratedLoudness, limit, normalize, samplePeak, dbfs } from '../lib/loudness.mjs';

const sine = (hz, sr, sec, amp) => Float32Array.from({ length: Math.round(sr * sec) }, (_, i) => amp * Math.sin((2 * Math.PI * hz * i) / sr));

test('full-scale 1 kHz sine is about -3.01 LUFS (BS.1770 reference)', () => {
  const l = integratedLoudness(sine(1000, 48000, 5, 1), 48000);
  assert.ok(Math.abs(l - -3.01) < 0.1, `got ${l}`);
});

test('24 kHz input is handled (upsampled for the measurement)', () => {
  const l = integratedLoudness(sine(1000, 24000, 5, 1), 24000);
  assert.ok(Math.abs(l - -3.01) < 0.3, `got ${l}`);
});

test('halving amplitude lowers loudness by 6 dB', () => {
  const a = integratedLoudness(sine(1000, 48000, 5, 0.5), 48000);
  const b = integratedLoudness(sine(1000, 48000, 5, 0.25), 48000);
  assert.ok(Math.abs(a - b - 6.02) < 0.05);
});

test('silence is -Infinity', () => {
  assert.equal(integratedLoudness(new Float32Array(48000 * 2), 48000), -Infinity);
});

test('limit: holds a spike at the ceiling and leaves a quiet signal untouched', () => {
  const x = sine(1000, 24000, 4, 0.1);
  const quiet = limit(x, 24000, -1.5);
  assert.deepEqual(Array.from(quiet.subarray(0, 50)), Array.from(x.subarray(0, 50)));
  x[48000] = 0.95; // a spike
  const out = limit(x, 24000, -1.5);
  assert.ok(dbfs(samplePeak(out)) <= -1.5 + 0.001, `peak ${dbfs(samplePeak(out))}`);
});

test('limit: samples well away from a spike are not reduced', () => {
  const x = sine(1000, 24000, 4, 0.1);
  x[24000] = 0.95;
  const out = limit(x, 24000, -1.5);
  // 1.5 s later the 60 ms release has long finished.
  const i = 24000 + 36000;
  assert.ok(Math.abs(out[i] - x[i]) < 1e-4, `${out[i]} vs ${x[i]}`);
});

test('normalize: reaches the target on a clean signal', () => {
  const x = sine(1000, 24000, 6, 0.1);
  const r = normalize(x, 24000, -19, -1.5);
  assert.ok(Math.abs(r.lufs - -19) < 0.1, `lufs ${r.lufs}`);
  assert.ok(r.peakDbfs <= -1.5 + 0.001);
});

test('normalize: rare spikes no longer pull the whole file quiet', () => {
  const x = sine(1000, 24000, 8, 0.05); // about -26 LUFS
  for (let i = 12000; i < x.length; i += 24000) x[i] = 0.9; // a spike every second
  const r = normalize(x, 24000, -19, -1.5);
  assert.ok(Math.abs(r.lufs - -19) < 0.5, `lufs ${r.lufs} (spikes must not force it quiet)`);
  assert.ok(r.peakDbfs <= -1.5 + 0.001, `peak ${r.peakDbfs}`);
});
