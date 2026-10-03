import test from 'node:test';
import assert from 'node:assert/strict';
import { integratedLoudness, gainFor, samplePeak, dbfs } from '../lib/loudness.mjs';

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

test('gainFor reaches the target when there is headroom', () => {
  const x = sine(1000, 24000, 6, 0.1);
  const g = gainFor(x, 24000, -16, -1);
  assert.equal(g.limited, false);
  assert.ok(Math.abs(g.resultLufs - -16) < 0.01);
});

test('gainFor stops at the peak ceiling instead of clipping', () => {
  const x = sine(1000, 24000, 6, 0.1);
  x[100] = 0.9; // a spike
  const g = gainFor(x, 24000, -10, -1);
  assert.equal(g.limited, true);
  assert.ok(g.resultPeakDbfs <= -0.99 && g.resultPeakDbfs >= -1.01, `peak ${g.resultPeakDbfs}`);
  assert.ok(dbfs(samplePeak(x) * g.gain) <= -0.99);
});
