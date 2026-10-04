// Lays sentences out on a timeline and derives everything the page needs from
// it: per-segment read-along cues, chapters, caption cues. Because the audio is
// assembled sentence by sentence from known sample counts, every time here is
// exact: no forced alignment, no guessing.

export const GAPS = {
  lead: 0.15, // silence before the first word
  sentence: 0.28, // between sentences of one paragraph
  segment: 0.6, // between paragraphs / title / dek
  beforeCue: 1.2, // before a section-label cue (the audible "chapter break")
  tail: 0.5, // silence after the last word
};

const r2 = (n) => Math.round(n * 100) / 100;
const r1 = (n) => Math.round(n * 10) / 10;

/**
 * @param {{id:string, kind:string, raw:string, sentences:{raw:string, n:number}[]}[]} segments  n = trimmed sample count
 * @param {number} sr sample rate
 * @returns {{ segments: object[], placements: {offset:number, segIndex:number, sentIndex:number}[], totalSamples:number }}
 */
export function layout(segments, sr, gaps = GAPS) {
  const g = (s) => Math.round(s * sr);
  let cursor = g(gaps.lead);
  const placements = [];
  const out = [];
  segments.forEach((seg, si) => {
    if (si > 0) cursor += g(seg.kind === 'cue' ? gaps.beforeCue : gaps.segment);
    const start = cursor;
    const sents = [];
    seg.sentences.forEach((s, ti) => {
      if (ti > 0) cursor += g(gaps.sentence);
      placements.push({ offset: cursor, segIndex: si, sentIndex: ti });
      sents.push({ raw: s.raw, start: cursor / sr, end: (cursor + s.n) / sr });
      cursor += s.n;
    });
    out.push({ id: seg.id, kind: seg.kind, raw: seg.raw, start: start / sr, end: cursor / sr, sentences: sents });
  });
  return { segments: out, placements, totalSamples: cursor + g(gaps.tail) };
}

/** Player cue tuples: [data-narr id, start, end] (the AudioPlayer's `cues`). */
export const toCues = (segments) => segments.map((s) => [s.id, r2(s.start), r2(s.end)]);

/**
 * Chapters from the section-label cues. `sN-cue` -> { id: 'sN', title, start }.
 * `titles` can shorten a chip's text without touching the page heading.
 */
export function toChapters(segments, titles = {}) {
  return segments
    .filter((s) => s.kind === 'cue')
    .map((s) => {
      const id = s.id.replace(/-cue$/, '');
      return { id, title: titles[id] ?? s.raw, start: r1(s.start) };
    });
}

/** Caption cues, one per sentence, text = the page's own words (not the spoken form). */
export function toCaptionCues(segments) {
  return segments.flatMap((seg) => seg.sentences.map((s) => ({ start: s.start, end: s.end, text: s.raw })));
}
