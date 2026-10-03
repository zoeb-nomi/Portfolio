// Page text -> text a TTS engine can say. Pure functions, no I/O (unit-tested in
// ../test/spoken.test.mjs). The page text itself is never changed; only the
// string handed to the voice is.

const MAG = { K: 'thousand', M: 'million', B: 'billion' };
const CUR = { $: 'dollars', '₹': 'rupees', '£': 'pounds', '€': 'euros' };

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** @param {string} text @param {Record<string,string>} words lexicon.words */
export function toSpoken(text, words = {}) {
  let t = text.replace(/[​-‍﻿]/g, '').replace(/\s+/g, ' ').trim();

  // Lexicon first (longest keys first so "LLM-as-judge" wins over "LLM").
  const keys = Object.keys(words).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const re = new RegExp(`(?<![\\w-])${escapeRe(k)}(?![\\w-])`, 'g');
    t = t.replace(re, () => words[k]);
  }

  // Currency: $2.7M, ₹50,000, $121K -> "2.7 million dollars", "50,000 rupees"
  t = t.replace(/([$₹£€])\s?(\d[\d,]*(?:\.\d+)?)\s?([KMB])\b/g, (_, c, n, m) => `${n} ${MAG[m]} ${CUR[c]}`);
  t = t.replace(/([$₹£€])\s?(\d[\d,]*(?:\.\d+)?)/g, (_, c, n) => `${n} ${CUR[c]}`);

  // 270K+ / 100+ / 160+ -> "270 thousand plus"
  t = t.replace(/\b(\d[\d,]*(?:\.\d+)?)([KMB])\+/g, (_, n, m) => `${n} ${MAG[m]} plus`);
  t = t.replace(/\b(\d[\d,]*(?:\.\d+)?)([KMB])\b/g, (_, n, m) => `${n} ${MAG[m]}`);
  t = t.replace(/\b(\d[\d,]*)\+/g, '$1 plus');

  // Percent, approx, comparison, arrows, times
  t = t.replace(/(\d)\s?%/g, '$1 percent');
  t = t.replace(/~\s?/g, 'about ');
  t = t.replace(/≈\s?/g, 'about ');
  t = t.replace(/≥/g, ' at least ').replace(/≤/g, ' at most ').replace(/±/g, ' plus or minus ');
  t = t.replace(/\s?→\s?/g, ' to ').replace(/\s?←\s?/g, ' from ');
  t = t.replace(/(\d)\s?×\s?(\d)/g, '$1 times $2').replace(/×/g, ' times ');

  // Ranges and ratios between digits (not dates): 5–10 / 5-10 -> "5 to 10"; 15/15 -> "15 out of 15"
  t = t.replace(/(?<![\d-])(\d+(?:\.\d+)?)\s?[–]\s?(\d+(?:\.\d+)?)(?![\d-])/g, '$1 to $2');
  t = t.replace(/(?<![\d/-])(\d{1,4})\s?\/\s?(\d{1,4})(?![\d/-])/g, '$1 out of $2');
  t = t.replace(/\bn\s?=\s?(\d+)/g, 'n equals $1');
  // Any other en dash: "2025–present" -> "2025 to present"; a spaced one is a pause.
  t = t.replace(/(\w)–(\w)/g, '$1 to $2').replace(/\s–\s/g, ', ');

  // Common abbreviations
  t = t.replace(/\be\.g\./gi, 'for example').replace(/\bi\.e\./gi, 'that is');
  t = t.replace(/\bvs\.?(?=\s)/gi, 'versus').replace(/\betc\./gi, 'et cetera');

  // Punctuation the voices handle badly: em dash -> comma pause, section sign, markdown
  t = t.replace(/\s?—\s?/g, ', ').replace(/§\s?\d*/g, '');
  t = t.replace(/[*_`#]/g, '');
  t = t.replace(/\s+([,.;:!?])/g, '$1').replace(/,\s*,/g, ',').replace(/\s+/g, ' ');
  return t.trim();
}

/** Split spoken text into sentences for synthesis (better prosody, exact sentence timings). */
export function splitSentences(text) {
  const seg = new Intl.Segmenter('en', { granularity: 'sentence' });
  const out = [];
  for (const { segment } of seg.segment(text)) {
    const s = segment.trim();
    if (!s) continue;
    // Merge a trailing fragment with no letters (e.g. a lone quote) into the previous sentence.
    if (out.length && !/[A-Za-z0-9]/.test(s)) out[out.length - 1] += ' ' + s;
    else out.push(s);
  }
  return out;
}

/** Lower-case words only, for transcript comparison in the verify step. */
export function normalizeForCompare(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}
