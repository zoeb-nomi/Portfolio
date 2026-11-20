// Shared helpers and figure data for the three case-study pages (The Pipeline).
// Text is never typed here: everything is read out of src/data/copy.ts. If the wording a regex
// depends on changes, the build fails and says which number could not be read.
import { crosssource as cs, mirrorEval as me, screenerEval as se, pipelineCaseStudies as P } from '../data/copy';
import { waveData, vacuumData, judgeData, flipData, parserData } from './figureData';

/** One run of inline text: plain, bold, code or emphasis. */
export type Part = { text?: string; b?: string; code?: string };

const fail = (what: string): never => {
  throw new Error(`caseStudy: could not read ${what}. The page and its source copy have drifted.`);
};

/** Split `text` so the first occurrence of each mark is bold. A missing mark fails the build. */
export function rich(text: string, marks: string[] = []): Part[] {
  const hits = marks
    .map((m) => ({ m, i: text.indexOf(m) }))
    .map((h) => (h.i < 0 ? fail(`the phrase "${h.m}" in "${text.slice(0, 60)}"`) : h))
    .sort((a, b) => a.i - b.i);
  const out: Part[] = [];
  let at = 0;
  for (const h of hits) {
    if (h.i < at) continue;
    if (h.i > at) out.push({ text: text.slice(at, h.i) });
    out.push({ b: h.m });
    at = h.i + h.m.length;
  }
  if (at < text.length) out.push({ text: text.slice(at) });
  return out;
}

/** Sentences of a paragraph, split where a full stop is followed by a capital. */
export function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-Z"“(])/);
}

export type MethodRow =
  | { term: string; kind: 'plain'; body: string }
  | { term: string; kind: 'code'; bodyPre: string; code: string; bodyPost: string }
  | { term: string; kind: 'configs'; italic1: string; mid: string; italic2: string; bodyPost: string };

/** A CrossSource or mirror-eval method row as inline parts. */
export function rowParts(row: MethodRow): Part[] {
  if (row.kind === 'plain') return [{ text: row.body }];
  if (row.kind === 'code') return [{ text: row.bodyPre }, { code: row.code }, { text: row.bodyPost }];
  return [{ b: row.italic1 }, { text: row.mid }, { b: row.italic2 }, { text: row.bodyPost }];
}

/** A screener-eval method row (text, code and strong parts) as inline parts. */
export function screenerParts(parts: ({ text: string } | { code: string } | { strong: string })[]): Part[] {
  return parts.map((p) => ('code' in p ? { code: p.code } : 'strong' in p ? { b: p.strong } : { text: p.text }));
}

/** "0.981 → 0.994" into [before, after]; a value with no arrow comes back as [value, null]. */
export function arrowSplit(v: string): [string, string | null] {
  const i = v.indexOf(' → ');
  return i < 0 ? [v, null] : [v.slice(0, i), v.slice(i + 3)];
}

const num = (s: string): number => Number(s.replace('−', '-').replace('+', '').trim());

// ---- CrossSource Fig. 1 -------------------------------------------------------------------------------------

const GAUGE = { cx: 170, cy: 170, r: 140 };

export function crosssourceFig() {
  const f = P.crosssource.findings.fig;
  const lo = Number(f.axisLo);
  const hi = Number(f.axisHi);
  const metric = (name: string) => cs.s3.table1.rows.find((r) => r.dimension.toLowerCase().includes(name)) ?? fail(`crosssource.s3.table1 "${name}"`);
  const tax = (name: string) => cs.s3.table2.rows.find((r) => r.type.toLowerCase().includes(name)) ?? fail(`crosssource.s3.table2 "${name}"`);
  const prec = metric('precision');
  const rec = metric('recall');
  const faith = metric('faithfulness');
  const rel = metric('relevance');
  const wp = tax('wrong passage');
  const ma = tax('missing authority');
  const cfg = (k: 'baseline' | 'strict') => ({
    prec: prec[k],
    p: Number(prec[k]),
    rel: rel[k],
    wp: Number(wp[k]),
    ma: Number(ma[k]),
    fails: cs.s3.table2.rows.reduce((a, r) => a + Number(r[k]), 0),
  });
  const ang = (v: number) => -90 + (180 * (v - lo)) / (hi - lo);
  const ticks = Array.from({ length: 16 }, (_, k) => {
    const a = (ang(lo + k * 0.002) * Math.PI) / 180;
    const major = k % 5 === 0;
    const r1 = GAUGE.r + 9;
    const r2 = GAUGE.r + (major ? 20 : 14);
    return {
      major,
      x1: (GAUGE.cx + r1 * Math.sin(a)).toFixed(2),
      y1: (GAUGE.cy - r1 * Math.cos(a)).toFixed(2),
      x2: (GAUGE.cx + r2 * Math.sin(a)).toFixed(2),
      y2: (GAUGE.cy - r2 * Math.cos(a)).toFixed(2),
    };
  });
  const base = cfg('baseline');
  const strict = cfg('strict');
  return {
    gauge: GAUGE,
    lo,
    hi,
    ticks,
    base,
    strict,
    angBase: ang(base.p).toFixed(2),
    angStrict: ang(strict.p).toFixed(2),
    offStrict: (1 - (strict.p - lo) / (hi - lo)).toFixed(4),
    rec: rec.strict,
    faith: faith.strict,
    wpPair: `${wp.baseline} → ${wp.strict}`,
    maMax: Math.max(Number(ma.baseline), Number(ma.strict)),
    data: {
      lo,
      hi,
      base: { ...base, cfg: f.totals.base },
      strict: { ...strict, cfg: f.totals.strict },
    },
  };
}

// ---- mirror-eval ---------------------------------------------------------------------------------------------

export function mirrorFig() {
  const w = waveData();
  const gaps = vacuumData();
  const j = judgeData();
  const pair = /agreed with each other on (\d+) of (\d+) answers \((\d+)%\)/.exec(me.s4.para1) ?? fail('the judge-vs-judge agreement');
  const r = P.mirrorEval.judge.fig;
  const words = r.results;
  const counts = [
    { filled: j.rows[0].filled, of: j.rows[0].of, word: words.matched },
    { filled: j.rows[1].filled, of: j.rows[1].of, word: words.matched },
    { filled: j.rows[2].filled, of: j.rows[2].of, word: words.matched },
    { filled: Number(pair[1]), of: Number(pair[2]), word: words.agreed },
  ];
  const pct = [j.rows[0].text, j.rows[1].text, j.rows[2].text].map((t) => /(\d+)%/.exec(t)?.[1] ?? fail('a judge percentage'));
  const judges = r.rows.map((row, i) => {
    const c = counts[i];
    const p = i === 3 ? pair[3] : pct[i];
    return { ...row, filled: c.filled, of: c.of, pct: p, result: `${c.filled} of ${c.of} ${c.word} · ${p}%` };
  });
  const lim = sentences(me.s6.body);
  if (lim.length !== P.mirrorEval.limits.marks.length) fail('mirrorEval.s6 sentence count');
  return {
    engines: w.rows.map((e) => ({ label: e.label, from: e.from, to: e.to })),
    of: w.of,
    gaps: gaps.groups,
    judges,
    limits: lim,
  };
}

// ---- screener-eval -------------------------------------------------------------------------------------------

export function screenerFig() {
  const t1 = se.s3.table1.rows;
  const t2 = se.s3.table2.rows;
  const between = se.s3.betweenScreeners;
  const gap = /mean gap ([\d.]+) points, largest ([\d.]+)/.exec(between) ?? fail('the screener gap');
  const higher = /scored higher on (\d+) of (\d+) postings/.exec(between) ?? fail('the higher count');
  const agreed = /agreed on the majority verdict for (\d+) of (\d+) postings/.exec(between) ?? fail('the agreement count');
  const corr = /correlation[^0-9]*(\d+\.\d+)/.exec(between) ?? fail('the correlation');
  const flippedAll = /flipped the verdict on (\d+) of (\d+) postings/.exec(se.s3.findingBody) ?? fail('the flipped-verdict count');
  const biggest = (word: string) => Math.max(...t1.filter((r) => r.lever.toLowerCase().includes(word)).map((r) => Math.abs(num(r.delta))));
  const swap = biggest('employer');
  const links = biggest('link');
  const max = P.screenerEval.shock.scaleMax;
  const row = (word: string) => t2.find((r) => r.measure.toLowerCase().includes(word)) ?? fail(`screenerEval.s3.table2 "${word}"`);
  const across = P.screenerEval.variable.fig.acrossCalls;
  const verdict = (s: string) => s.replace(' (', ' · ').replace(')', '');
  const stat = (k: 'haiku' | 'gpt') => ({
    name: k === 'haiku' ? 'claude-haiku-4-5' : 'gpt-5-mini',
    mean: row('mean fit')[k],
    sd: row('run-to-run')[k],
    readout: [
      row('mean fit')[k],
      verdict(row('most common')[k]),
      `${row('distinct')[k]} · ${across}`,
      row('identical')[k],
      row('run-to-run')[k],
    ],
  });
  const flips = flipData();
  const forestRows = t1.map((r) => ({
    lever: r.lever,
    screener: r.screener,
    delta: r.delta,
    ci: r.ci,
    m: ((num(r.delta) + 4) / 8) * 100,
    a: ((num(r.ci.split(' to ')[0]) + 4) / 8) * 100,
    b: ((num(r.ci.split(' to ')[1]) + 4) / 8) * 100,
  }));
  const parsers = parserData();
  const lim = sentences(se.s7.body);
  if (lim.length !== P.screenerEval.limits.marks.length) fail('screenerEval.s7 sentence count');
  const nul = sentences(se.s4.body);
  const close = sentences(se.s5.close);
  if (close.length !== 4) fail('screenerEval.s5.close sentence count');
  return {
    shock: [
      { v: swap, text: `≤${swap.toFixed(2)}`, red: false },
      { v: links, text: `≤${links.toFixed(2)}`, red: false },
      { v: Number(gap[1]), text: gap[1], red: true },
    ].map((s) => ({ ...s, k: (s.v / max).toFixed(4) })),
    forest: [forestRows.slice(0, 2), forestRows.slice(2, 4)],
    haiku: stat('haiku'),
    gpt: stat('gpt'),
    gap: { mean: gap[1], largest: gap[2], higher: `${higher[1]} of ${higher[2]}`, agreed: `${agreed[1]} of ${agreed[2]}`, corr: corr[1], flipped: `${flippedAll[1]} of ${flippedAll[2]}` },
    bothReadout: [`${gap[1]} · largest ${gap[2]}`, `gpt-5-mini, ${higher[1]} of ${higher[2]}`, `${agreed[1]} of ${agreed[2]}`, `${flippedAll[1]} of ${flippedAll[2]}`, corr[1]],
    flips,
    parsers,
    limits: lim,
    nullSentences: nul,
    close,
    gapPct: { a: Number(row('mean fit').haiku), b: Number(row('mean fit').gpt) },
  };
}
