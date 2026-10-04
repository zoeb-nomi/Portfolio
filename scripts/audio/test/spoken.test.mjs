import test from 'node:test';
import assert from 'node:assert/strict';
import { toSpoken, splitSentences, normalizeForCompare } from '../lib/spoken.mjs';

const W = { KYB: 'K Y B', LLM: 'L L M', 'LLM-as-judge': 'L L M as judge', CrossSource: 'Cross Source', 'n=25': 'n equals 25' };

test('currency and magnitudes', () => {
  assert.equal(toSpoken('$2.7M MRR', W), '2.7 million dollars MRR');
  assert.equal(toSpoken('$121K upsell', W), '121 thousand dollars upsell');
  assert.equal(toSpoken('a ₹50,000 experiment', W), 'a 50,000 rupees experiment');
  assert.equal(toSpoken('270K+ records', W), '270 thousand plus records');
  assert.equal(toSpoken('100+ source types', W), '100 plus source types');
});

test('percent, approximation, ratios, ranges, arrows', () => {
  assert.equal(toSpoken('~95% accuracy', W), 'about 95 percent accuracy');
  assert.equal(toSpoken('8% for one judge', W), '8 percent for one judge');
  assert.equal(toSpoken('agreement was 15/15', W), 'agreement was 15 out of 15');
  assert.equal(toSpoken('3/40 and 12/40', W), '3 out of 40 and 12 out of 40');
  assert.equal(toSpoken('and/or both', W), 'and/or both');
  assert.equal(toSpoken('13 → 63 probes', W), '13 to 63 probes');
  assert.equal(toSpoken('5–10 lines', W), '5 to 10 lines');
  assert.equal(toSpoken('Sep 2025–present', W), 'Sep 2025 to present');
  assert.equal(toSpoken('n=25', {}), 'n equals 25');
});

test('lexicon is whole-word, longest-first, case-sensitive', () => {
  assert.equal(toSpoken('KYB checks', W), 'K Y B checks');
  assert.equal(toSpoken('an LLM-as-judge eval', W), 'an L L M as judge eval');
  assert.equal(toSpoken("CrossSource's harness", W), "Cross Source's harness");
  assert.equal(toSpoken('SKYBLUE', W), 'SKYBLUE');
  assert.equal(toSpoken('kyb', W), 'kyb');
});

test('punctuation the voice mishandles', () => {
  assert.equal(toSpoken('Plain — dash', W), 'Plain, dash');
  assert.equal(toSpoken('§3 Measured', W), 'Measured');
  assert.equal(toSpoken('e.g. this, i.e. that', W), 'for example this, that is that');
  assert.equal(toSpoken('"High accuracy" is not.', W), '"High accuracy" is not.');
});

test('plain sentences pass through unchanged', () => {
  const s = "When an AI system gives a wrong answer, someone usually notices.";
  assert.equal(toSpoken(s, {}), s);
});

test('splitSentences', () => {
  assert.deepEqual(splitSentences('One thing. Two things? Three!'), ['One thing.', 'Two things?', 'Three!']);
  assert.deepEqual(splitSentences('Compliance and KYB: the missed beneficial owner'), ['Compliance and KYB: the missed beneficial owner']);
});

test('splitSentences does not break after abbreviations', () => {
  assert.deepEqual(splitSentences('In Mata v. Avianca, lawyers were sanctioned. They lost.'), ['In Mata v. Avianca, lawyers were sanctioned.', 'They lost.']);
  assert.deepEqual(splitSentences('Ask Dr. Smith. She knows.'), ['Ask Dr. Smith.', 'She knows.']);
});

test('normalizeForCompare', () => {
  assert.deepEqual(normalizeForCompare("It wasn't; the 8% held."), ['it', 'wasnt', 'the', '8', 'held']);
});
