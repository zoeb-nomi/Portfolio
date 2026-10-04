// The numbers behind every figure, read out of the case-study tables and paragraphs already on the site.
// Nothing is typed in twice: a figure and its table cannot disagree, and if the source wording changes so a
// number can no longer be read, the build fails here and says which one, instead of drawing a stale chart.
import { mirrorEval as me, screenerEval as se, crosssource as cs } from '../data/copy';
import { formatDate } from './formatDate';

// Typed as a function that never returns, so TypeScript narrows after a failed check.
const fail: (what: string) => never = (what) => {
  throw new Error(`figureData: could not read ${what}. The figure and its source copy have drifted.`);
};
const num = (s: string): number => Number(s.replace('−', '-').replace('+', '').trim());
const pair = (s: string): [number, number] => {
  const m = /^(\d+)\s*→\s*(\d+)$/.exec(s.trim());
  return m ? [Number(m[1]), Number(m[2])] : fail(`"${s}" as a before → after pair`);
};
const find = <T>(rows: T[], test: (r: T) => boolean, what: string): T => rows.find(test) ?? fail(what);
const niceMax = (v: number): number => Math.ceil(v / 20) * 20;
const quarters = (max: number): number[] => [0, 1, 2, 3, 4].map((i) => (max / 4) * i);

// ---- screener-eval Table 1 and the between-screeners paragraph (two-levers essay, /screener-eval/) ----------

export function forestData() {
  const rows = se.s3.table1.rows;
  const lever = (i: number, word: string) => {
    const r = rows[i];
    if (!r || !r.lever.toLowerCase().includes(word)) fail(`screenerEval.s3.table1 row ${i} ("${word}")`);
    const [lo, hi] = r.ci.split(' to ').map(num);
    return { label: r.screener, mean: num(r.delta), lo, hi };
  };
  const between = se.s3.betweenScreeners;
  const gapM = /mean gap ([\d.]+) points, largest ([\d.]+)/.exec(between) ?? fail('the mean and largest screener gap');
  const higher = /scored higher on (\d+) of (\d+) postings/.exec(between) ?? fail('the "scored higher on N of M postings" count');
  const gap = {
    label: 'Gap between the two',
    sub: 'mean · largest',
    mean: Number(gapM[1]),
    max: Number(gapM[2]),
    note: `Same résumé, same posting. gpt-5-mini scored higher on ${higher[1]} of ${higher[2]} postings.`,
  };
  if (gap.max > 53) fail('a screener gap that fits the axis');
  return {
    groups: [
      { title: 'Lever 1: every employer swapped for a company that does not exist', rows: [lever(0, 'employer'), lever(1, 'employer')] },
      { title: 'Lever 2: every link deleted', rows: [lever(2, 'link'), lever(3, 'link')] },
    ],
    gap,
    min: -6,
    max: 54,
    ticks: [0, 10, 20, 30, 40, 50],
    axisLabel: 'Change in fit score, in points on a 0 to 100 scale',
  };
}

/** How many postings the two screeners flipped their own verdict on, and agreed on. */
export function flipData() {
  const t = se.s3.table2.rows;
  const row = find(t, (r) => r.measure.toLowerCase().includes('flipped'), 'screenerEval.s3.table2 "flipped" row');
  const of = (s: string) => {
    const m = /(\d+) of (\d+)/.exec(s) ?? fail(`"${s}" as "N of M"`);
    return { filled: Number(m[1]), of: Number(m[2]) };
  };
  const agree = /agreed on the majority verdict for (\d+) of (\d+)/.exec(se.s3.betweenScreeners) ?? fail('the majority-verdict agreement count');
  const h = of(row.haiku);
  const g = of(row.gpt);
  const a = { filled: Number(agree[1]), of: Number(agree[2]) };
  return {
    cols: h.of,
    rows: [
      { label: 'claude-haiku-4-5 flipped its own verdict', filled: h.filled, of: h.of, text: `${h.filled} of ${h.of}` },
      { label: 'gpt-5-mini flipped its own verdict', filled: g.filled, of: g.of, text: `${g.filled} of ${g.of}` },
      { label: 'The two agreed on the majority verdict', filled: a.filled, of: a.of, text: `${a.filled} of ${a.of}` },
    ],
  };
}

/** Table 3: fields extracted from the résumé, v4.1 and v4.2, per parser. */
export function parserData() {
  const parse = (s: string) => {
    const n = s.split('/').map((x) => Number(x.trim()));
    return n.length === 4 && n.every((x) => Number.isFinite(x)) ? (n as [number, number, number, number]) : fail(`"${s}" as ok / missing / wrong / garbled`);
  };
  const rows = se.s5.table.rows.map((r) => ({ name: r.parser, v1: parse(r.v41), v2: parse(r.v42) }));
  const plain = rows.slice(0, 3);
  const same = plain.every((r) => r.v1.join() === plain[0].v1.join() && r.v2.join() === plain[0].v2.join());
  if (!same) fail('the three plain extractors having identical results');
  const total = plain[0].v1.reduce((a, b) => a + b, 0);
  if (rows.some((r) => r.v1.reduce((a, b) => a + b, 0) !== total || r.v2.reduce((a, b) => a + b, 0) !== total)) fail('every parser row summing to the same field count');
  return {
    total,
    rows: [
      { label: plain.map((r) => r.name).join(', '), sub: 'three plain extractors', v1: plain[0].v1, v2: plain[0].v2 },
      ...rows.slice(3).map((r) => ({ label: r.name, sub: 'résumé-specific parser', v1: r.v1, v2: r.v2 })),
    ],
  };
}

// ---- mirror-eval Tables 1 and 2 and section 4 (reflection essay, /mirror-eval/) -------------------------------

export function waveData() {
  const rows = me.s3.table1.rows.map((r) => {
    const [from, to] = pair(r.owned);
    return { label: r.engine, from, to };
  });
  const of = Number((/of (\d+) search-mode probes/.exec(me.s3.intro) ?? fail('the search-mode probe count'))[1]);
  const waves = find(me.s2.rows, (r) => r.term === 'Two waves', 'mirrorEval.s2 "Two waves" row');
  const wavesText = 'body' in waves ? (waves.body ?? '') : '';
  const d = /Baseline (\d{4}-\d{2}-\d{2}), lift (\d{4}-\d{2}-\d{2})/.exec(wavesText) ?? fail('the two wave dates');
  const short = (iso: string) => formatDate(iso).split(' ').slice(0, 2).join(' ');
  // The one-line reasons are the essay's own sentences about the two engines that moved or did not.
  const notes: Record<string, string> = {
    Claude: 'No equivalent door into the index Claude reads: a true null at four weeks.',
    Perplexity: 'A Bing Webmaster submission reached the index Perplexity reads.',
  };
  return {
    of,
    max: of,
    ticks: [0, Math.round(of / 3), Math.round((of * 2) / 3), of],
    fromLabel: `Wave 1 · ${short(d[1])}`,
    toLabel: `Wave 2 · ${short(d[2])}`,
    rows: rows.map((r) => ({ ...r, note: notes[r.label] })),
  };
}

/** Table 2: what filled the gap, as two groups with their own scale (Claude, Perplexity). */
export function vacuumData() {
  const t = me.s3.table2.rows;
  const one = (engine: string, start: string, label: string, sub: string) => {
    const r = find(t, (x) => x.engine === engine && x.surface.startsWith(start), `mirrorEval.s3.table2 row "${start}"`);
    const [from, to] = pair(r.count);
    return { label, sub, from, to };
  };
  const claude = [
    one('Claude', 'Four poisoned', 'Four poisoned pages', 'name-etymology, job-board'),
    one('Claude', 'zoominfo', 'zoominfo.com', 'a data broker'),
  ];
  const perplexity = [one('Perplexity', 'Wrong-person', 'Wrong-person pages', 'imdb, nomi.ai, youtube')];
  const group = (rows: typeof claude, heading: string) => {
    const max = niceMax(Math.max(...rows.flatMap((r) => [r.from, r.to])));
    return { heading, rows, max, ticks: quarters(max) };
  };
  return {
    fromLabel: 'Wave 1',
    toLabel: 'Wave 2',
    groups: [group(claude, 'Claude, citations by surface'), group(perplexity, 'Perplexity, citations by surface')],
  };
}

/** Judge versus a blind human: mirror-eval section 4 and the CrossSource blind check. */
export function judgeData() {
  const m = /Against (\d+) blind human labels, the Claude judge matched the exact tag set on (\d+) \((\d+)%\) and the Gemini judge on (\d+) \((\d+)%\)/.exec(me.s4.para1)
    ?? fail('mirrorEval.s4.para1 judge-versus-human counts');
  const n = Number(m[1]);
  const c = /\((\d+)\/(\d+)\)/.exec(cs.s4.statQuote) ?? fail('the CrossSource blind-check count');
  return {
    cols: 20,
    rows: [
      { label: 'Claude judge', filled: Number(m[2]), of: n, text: `${m[2]} of ${n} · ${m[3]}%` },
      { label: 'Gemini judge', filled: Number(m[4]), of: n, text: `${m[4]} of ${n} · ${m[5]}%` },
      { label: 'CrossSource judge', filled: Number(c[1]), of: Number(c[2]), text: `${c[1]} of ${c[2]} · 100%` },
    ],
    agree: { claude: Number(m[2]), gemini: Number(m[4]), n },
  };
}

// ---- CrossSource tables 1 and 2 ---------------------------------------------------------------------------------

export function failureData() {
  const t = cs.s3.table2.rows;
  const wrong = find(t, (r) => r.type.toLowerCase().includes('wrong passage'), 'crosssource.s3.table2 "wrong passage" row');
  const miss = find(t, (r) => r.type.toLowerCase().includes('missing authority'), 'crosssource.s3.table2 "missing authority" row');
  const metric = (name: string) => find(cs.s3.table1.rows, (r) => r.dimension.toLowerCase().includes(name), `crosssource.s3.table1 "${name}" row`);
  const prec = metric('precision');
  const rec = metric('recall');
  return {
    baseline: { prompt: Number(wrong.baseline), retrieval: Number(miss.baseline) },
    strict: { prompt: Number(wrong.strict), retrieval: Number(miss.strict) },
    precision: { from: prec.baseline, to: prec.strict },
    recall: { from: rec.baseline, to: rec.strict },
  };
}

// ---- spec blocks (home and /evals/ proof strip) ----------------------------------------------------------------

export function proofData() {
  const spec = (block: { label: string; value: string }[], label: string) => find(block, (b) => b.label === label, `a "${label}" spec value`).value;
  const calls = Number(spec(se.specBlock, 'Calls'));
  const probes = Number((/(\d+)/.exec(spec(me.specBlock, 'Probes')) ?? fail('the probes-per-wave value'))[1]);
  const csJudge = /(\d+)\/(\d+)/.exec(spec(cs.specBlock, 'Judge validated')) ?? fail('the CrossSource judge value');
  const meJudge = /(\d+)\/(\d+)/.exec(spec(me.specBlock, 'Judge failed')) ?? fail('the mirror-eval judge value');
  return [
    { value: calls, suffix: '', label: 'scored calls in screener-eval', href: '/screener-eval/' },
    { value: probes, suffix: '', label: 'probes per wave in mirror-eval, over two waves', href: '/mirror-eval/' },
    { value: Number(csJudge[1]), suffix: ` of ${csJudge[2]}`, label: 'judge verdicts matched a blind human in CrossSource', href: '/crosssource/' },
    { value: Number(meJudge[1]), suffix: ` of ${meJudge[2]}`, label: 'the Claude judge matched a blind human in mirror-eval', href: '/mirror-eval/' },
  ];
}
