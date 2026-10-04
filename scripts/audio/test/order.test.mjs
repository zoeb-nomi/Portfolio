import test from 'node:test';
import assert from 'node:assert/strict';
import { applyOrder } from '../lib/prepare.mjs';

const segs = ['s0-stats', 's0-title', 's0-dek', 's1-cue'].map((id) => ({ id }));

test('moveAfter speaks an anchor later than it appears in the markup', () => {
  assert.deepEqual(applyOrder(segs, { 's0-stats': 's0-dek' }).map((s) => s.id), ['s0-title', 's0-dek', 's0-stats', 's1-cue']);
});

test('no option leaves the order alone', () => {
  assert.deepEqual(applyOrder(segs).map((s) => s.id), segs.map((s) => s.id));
});

test('an unknown anchor is an error (catches typos)', () => {
  assert.throws(() => applyOrder(segs, { 's9-nope': 's0-dek' }), /s9-nope/);
  assert.throws(() => applyOrder(segs, { 's0-stats': 's9-nope' }), /s9-nope/);
});
