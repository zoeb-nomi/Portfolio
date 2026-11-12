// Fig. 0, the audit sheet: the cells behind the home hero and the ledger strip under the H1.
//
// Every square is one real model output that one of the three public harnesses put through a check.
// Nothing here is typed in twice: each count is read out of the case-study copy (src/data/copy.ts), the
// same sentences and tables the case-study pages render. If a sentence changes so a count can no longer
// be read, the build fails here and says which one, rather than drawing a stale sheet.
//
// Only aggregates exist in the repo (counts with denominators, no per-item files), so within each group the
// squares are grouped by outcome: the failed squares come last in reading order, and a square's position is
// not an item id. The caption says so, as Fig. 1 on /mirror-eval/ does.
import { crosssource as cs, mirrorEval as me, screenerEval as se } from './copy';

export interface CellGroup {
  id: string;
  /** Which harness, as the case study names it. */
  harness: string;
  /** The harness family, for the band tag on the sheet: the three public harnesses. */
  family: 'CrossSource' | 'mirror-eval' | 'screener-eval';
  /** One short line: what one square is. */
  what: string;
  /** The check that read it. */
  check: string;
  /** How many outputs the check read. */
  n: number;
  /** How many failed it. */
  failed: number;
  /** Readout line for a square that passed / failed. */
  pass: string;
  fail: string;
  href: string;
}

const fail: (what: string) => never = (what) => {
  throw new Error(`fig0-cells: could not read ${what}. Fig. 0 and its source copy have drifted.`);
};
const re = (s: string, r: RegExp, what: string): RegExpExecArray => r.exec(s) ?? fail(what);

// CrossSource v0.1 blind check: "100% agreement (15/15)".
const csJudge = re(cs.s4.statQuote, /\((\d+)\/(\d+)\)/, 'the CrossSource v0.1 blind-check count');
// CrossSource v0.3 adjudication: "... 30 items in all ... 27 of 30 matched the recommended label."
const csAdjRow = cs.s2.rows.find((r) => r.term === 'Adjudication') ?? fail('the CrossSource "Adjudication" method row');
const csAdj = re(('body' in csAdjRow ? csAdjRow.body : undefined) ?? '', /(\d+) of (\d+) matched the recommended label/, 'the CrossSource adjudication count');
// mirror-eval judges: "Against 40 blind human labels, the Claude judge matched the exact tag set on 3 (8%) and the Gemini judge on 12 (30%)".
const meJudge = re(
  me.s4.para1,
  /Against (\d+) blind human labels, the Claude judge matched the exact tag set on (\d+) \(\d+%\) and the Gemini judge on (\d+) \(\d+%\)/,
  'the mirror-eval judge-versus-human counts',
);
// screener-eval Table 2: "Postings where the screener flipped its own verdict across reps": 6 of 21 · 12 of 21.
const seFlip = se.s3.table2.rows.find((r) => r.measure.toLowerCase().includes('flipped')) ?? fail('the screener-eval "flipped" row');
const seReps = Number(((se.specBlock.find((b) => b.label === 'Reps') ?? fail('the screener-eval Reps value')).value));
const ofM = (s: string, what: string) => {
  const m = re(s, /(\d+) of (\d+)/, what);
  return { k: Number(m[1]), of: Number(m[2]) };
};
const seH = ofM(seFlip.haiku, 'the claude-haiku-4-5 flip count');
const seG = ofM(seFlip.gpt, 'the gpt-5-mini flip count');

const n = (s: string) => Number(s);

export const groups: CellGroup[] = [
  {
    id: 'cs-judge',
    harness: 'CrossSource v0.1',
    family: 'CrossSource',
    what: 'one judge verdict on a citation',
    check: 'hand-graded blind',
    n: n(csJudge[2]),
    failed: n(csJudge[2]) - n(csJudge[1]),
    pass: 'matched the human grade',
    fail: 'did not match the human grade',
    href: '/crosssource/',
  },
  {
    id: 'cs-adjudication',
    harness: 'CrossSource v0.3',
    family: 'CrossSource',
    what: "a model rater's label on one item",
    check: 'adjudicated by hand',
    n: n(csAdj[2]),
    failed: n(csAdj[2]) - n(csAdj[1]),
    pass: 'matched the adjudicated label',
    fail: 'did not match; settled before release',
    href: '/crosssource/',
  },
  {
    id: 'me-claude',
    harness: 'mirror-eval',
    family: 'mirror-eval',
    what: "the Claude judge's tag set for one answer",
    check: 'checked against blind human labels',
    n: n(meJudge[1]),
    failed: n(meJudge[1]) - n(meJudge[2]),
    pass: 'matched the human label',
    fail: 'failed; its numbers are reported as bands',
    href: '/mirror-eval/',
  },
  {
    id: 'me-gemini',
    harness: 'mirror-eval',
    family: 'mirror-eval',
    what: "the Gemini judge's tag set for one answer",
    check: 'checked against blind human labels',
    n: n(meJudge[1]),
    failed: n(meJudge[1]) - n(meJudge[3]),
    pass: 'matched the human label',
    fail: 'failed; its numbers are reported as bands',
    href: '/mirror-eval/',
  },
  {
    id: 'se-haiku',
    harness: 'screener-eval',
    family: 'screener-eval',
    what: `claude-haiku-4-5's verdict on one posting, run ${seReps} times`,
    check: 'repeated',
    n: seH.of,
    failed: seH.k,
    pass: 'the same verdict every run',
    fail: 'flipped its own verdict between runs',
    href: '/screener-eval/',
  },
  {
    id: 'se-gpt',
    harness: 'screener-eval',
    family: 'screener-eval',
    what: `gpt-5-mini's verdict on one posting, run ${seReps} times`,
    check: 'repeated',
    n: seG.of,
    failed: seG.k,
    pass: 'the same verdict every run',
    fail: 'flipped its own verdict between runs',
    href: '/screener-eval/',
  },
];

for (const g of groups) if (!(g.n > 0) || g.failed < 0 || g.failed > g.n) fail(`a sane count for ${g.id} (${g.failed} of ${g.n})`);

export const total = groups.reduce((a, g) => a + g.n, 0);
export const failed = groups.reduce((a, g) => a + g.failed, 0);

/** Columns on the sheet: ten, so every group reads as a tally in tens (15 is a row and a half, 30 three rows,
 *  40 four, 21 two and one) and a square is at least 24px wide on a 390px phone (350px of column, ten across). */
export const cols = 10;

/** The ledger strip under the H1, and the one-sentence summary for screen readers. True numbers only. */
export const strip = {
  mark: 'Fig. 0',
  kicker: 'The count',
  value: String(failed),
  unit: `of ${total} outputs`,
  label: 'failed a check.',
  caught: `All ${failed} caught before anything was published.`,
  source: 'CrossSource v0.1 and v0.3 · mirror-eval · screener-eval',
};

/** Bands on the sheet, one per family, each holding that family's groups in order (the tag spans the band). */
export const families = [...new Set(groups.map((g) => g.family))].map((family) => ({
  family,
  groups: groups.map((g, i) => ({ g, i })).filter((x) => x.g.family === family),
  n: groups.filter((g) => g.family === family).reduce((a, g) => a + g.n, 0),
  failed: groups.filter((g) => g.family === family).reduce((a, g) => a + g.failed, 0),
}));

const harnessCount = families.length;

export const summary = `${total} model outputs from ${harnessCount} eval harnesses, one square each; ${failed} failed a check and are marked red. Arrow keys read one square at a time.`;

export const caption =
  'Each square is one model output a check read, from the three case studies on this site. Squares are grouped by outcome, so a square\'s position is not an item id. Hover or arrow through a square to see which harness, what it was, and which check read it.';

export const legend = { fail: 'failed a check', pass: 'passed' };
