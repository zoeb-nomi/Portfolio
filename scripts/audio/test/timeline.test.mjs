import test from 'node:test';
import assert from 'node:assert/strict';
import { layout, toCues, toChapters, toCaptionCues } from '../lib/timeline.mjs';

const G = { lead: 0.5, sentence: 0.25, segment: 1, beforeCue: 2, tail: 0.5 };
const segs = [
  { id: 's0-title', kind: 'title', raw: 'Title', sentences: [{ raw: 'Title', n: 1000 }] },
  { id: 's1-cue', kind: 'cue', raw: 'First section', sentences: [{ raw: 'First section', n: 2000 }] },
  { id: 's1-p0', kind: 'para', raw: 'A. B.', sentences: [{ raw: 'A.', n: 3000 }, { raw: 'B.', n: 1000 }] },
];

test('layout: exact times from sample counts', () => {
  const { segments, placements, totalSamples } = layout(segs, 1000, G);
  assert.deepEqual(segments.map((s) => [s.id, s.start, s.end]), [['s0-title', 0.5, 1.5], ['s1-cue', 3.5, 5.5], ['s1-p0', 6.5, 10.75]]);
  assert.deepEqual(segments[2].sentences.map((s) => [s.start, s.end]), [[6.5, 9.5], [9.75, 10.75]]);
  assert.equal(placements.length, 4);
  assert.equal(totalSamples, 10750 + 500);
});

test('layout: a paragraph ends where its last sentence ends', () => {
  const { segments } = layout(segs, 1000, G);
  assert.equal(segments[2].end, segments[2].sentences.at(-1).end);
});

test('cues: [id, start, end] rounded to 2 dp, in order, non-overlapping', () => {
  const { segments } = layout(segs, 1000, G);
  const cues = toCues(segments);
  assert.deepEqual(cues[0], ['s0-title', 0.5, 1.5]);
  for (let i = 1; i < cues.length; i++) assert.ok(cues[i][1] >= cues[i - 1][2]);
});

test('chapters come from cue segments; titles can be shortened', () => {
  const { segments } = layout(segs, 1000, G);
  assert.deepEqual(toChapters(segments), [{ id: 's1', title: 'First section', start: 3.5 }]);
  assert.deepEqual(toChapters(segments, { s1: 'First' }), [{ id: 's1', title: 'First', start: 3.5 }]);
});

test('caption cues: one per sentence, page words', () => {
  const { segments } = layout(segs, 1000, G);
  const caps = toCaptionCues(segments);
  assert.equal(caps.length, 4);
  assert.deepEqual(caps.map((c) => c.text), ['Title', 'First section', 'A.', 'B.']);
});
