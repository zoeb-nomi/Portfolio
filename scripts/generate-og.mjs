// Generates one static 1200×630 OG image per page (bone paper, red top rule,
// display-serif title, ≥28px mono subtitle, optional large proof numeral) via
// Playwright screenshotting an inline HTML template. Fonts are embedded from
// public/fonts, so re-run scripts/subset-fonts.mjs first if glyphs change.
// Run: node scripts/generate-og.mjs
//
// Titles/subtitles are trimmed from src/data/copy.ts `meta.*` (key noted per page).
// Numerals are the single proof number for the page, where one exists.

import { chromium } from 'playwright';
import { readFileSync, mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const STANDING_LINE = 'AI Product Manager · Bengaluru (IST)';

// id → output file (public/og/<id>.png). `num` = { value, caption }.
const pages = [
  { id: 'home', // meta.home
    title: 'Zoeb Nomi', sub: 'AI Product Manager · LLM Evaluation & RAG Quality',
    num: { value: '0.994', caption: 'citation precision · n=25' } },
  { id: 'about', // meta.about
    title: 'About', sub: 'Mechanical engineer turned AI product manager. Open to US relocation.' },
  { id: 'work', // meta.work
    title: 'Work', sub: 'Zero-to-one BGV at Keka, LLM output quality at Instead.',
    num: { value: '4', caption: 'companies · 2 promotions' } },
  { id: 'evals', // meta.evals
    title: 'Evals', sub: 'One method: CrossSource, mirror-eval, screener-eval.',
    num: { value: '3', caption: 'harnesses' } },
  { id: 'crosssource', // meta.crosssource
    title: 'CrossSource', sub: 'Open harness for legal-RAG citation accuracy.',
    num: { value: '0.994', caption: 'citation precision, up from 0.981' } },
  { id: 'mirror-eval', // meta.mirrorEval
    title: 'mirror-eval', sub: 'What AI search says about a person, measured twice.',
    num: { value: '13 → 63', caption: 'Perplexity · Claude 0 → 0' } },
  { id: 'screener-eval', // meta.screenerEval
    title: 'screener-eval', sub: 'What LLM résumé screeners reward, counted 885 times.',
    num: { value: '885', caption: 'screener calls' } },
  { id: 'writing', // meta.writingIndex
    title: 'Writing', sub: 'Notes on LLM evaluation, judge reliability and RAG quality.' },
  { id: 'notes', // meta.notesIndex
    title: 'Notes', sub: 'One counted finding per note.' },
  { id: 'eval-harness', // meta.writingReflection
    title: 'I pointed an eval harness at my own reflection',
    sub: 'Engines fill rather than abstain. The LLM judge failed blind validation.' },
  { id: 'judge', // meta.writingJudgeBug
    title: 'The judge caught a bug I didn’t',
    sub: 'A blind human check found a harness bug the LLM judge could not see.',
    num: { value: '15/15', caption: 'blind judge agreement' } },
  { id: 'two-levers', // meta.writingTwoLevers
    title: '885 screenings, two levers that did not move',
    sub: 'Employer names and evidence links did nothing to an LLM screener’s score.' },
  { id: 'bus-stop', // meta.writingBusStop
    title: 'The bus stop nobody notices',
    sub: 'Vijayanand Travels’ fifty-year moat in Indian intercity buses.' },
  { id: 'misses', // meta.writingMisses
    title: 'Nobody Reports the Misses: Counting False Passes in AI',
    sub: 'Wrong AI answers get caught. Missed items don’t.' },
  { id: 'decisions-api-legal-quiz', // meta.writingDecisions
    title: "I gave OpenAI's Decisions API a quiz written by lawyers",
    sub: '544 legal questions\none probability each · no safe threshold' },
  { id: '404', // notFound.message
    title: '404', sub: 'No source found for that claim.' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Arrows are absent from Instrument Serif; render them in the mono face.
const withArrows = (s) => esc(s).replace(/→/g, '<span class="arr">→</span>');

function b64(file) {
  return readFileSync(path.join(ROOT, 'public/fonts', file)).toString('base64');
}

const instrumentSerif = b64('instrument-serif-latin-400-normal.woff2');
const plexMono = b64('ibm-plex-mono-latin-400-normal.woff2');
const plexMonoMedium = b64('ibm-plex-mono-latin-500-normal.woff2');

function templateHTML({ title, sub, num }) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: 'Instrument Serif';
    src: url(data:font/woff2;base64,${instrumentSerif}) format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'IBM Plex Mono';
    src: url(data:font/woff2;base64,${plexMono}) format('woff2');
    font-weight: 400;
  }
  @font-face {
    font-family: 'IBM Plex Mono';
    src: url(data:font/woff2;base64,${plexMonoMedium}) format('woff2');
    font-weight: 500;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 1200px;
    height: 630px;
    background: #f4f1ea;
    overflow: hidden;
  }
  .frame {
    position: relative;
    width: 1200px;
    height: 630px;
    border-top: 10px solid #be241f;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 64px 88px 56px;
  }
  .top {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 15px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #6d675e;
  }
  .main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
  }
  .text { flex: 1 1 auto; min-width: 0; }
  .title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 116px;
    line-height: 0.98;
    letter-spacing: -0.015em;
    color: #191713;
  }
  .kicker {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 28px;
    line-height: 1.32;
    letter-spacing: 0;
    color: #3b362e;
    margin-top: 22px;
    text-wrap: balance;
  }
  .num {
    flex: 0 0 auto;
    width: 400px;
    text-align: right;
    border-right: 4px solid #be241f;
    padding-right: 28px;
  }
  .num-value {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 190px;
    line-height: 0.9;
    letter-spacing: -0.02em;
    color: #191713;
    white-space: nowrap;
  }
  .arr, .kicker .arr {
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0;
  }
  .num-caption {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 20px;
    line-height: 1.3;
    color: #6d675e;
    margin-top: 16px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .standing {
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #191713;
  }
  .domain {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    letter-spacing: .04em;
    color: #6d675e;
  }
</style>
</head>
<body>
  <div class="frame">
    <p class="top">§ Zoeb Nomi</p>
    <div class="main">
      <div class="text">
        <p class="title" id="title">${esc(title)}</p>
        <p class="kicker">${withArrows(sub).replace(/\n/g, '<br>')}</p>
      </div>
      ${num ? `<div class="num"><p class="num-value" id="num">${withArrows(num.value)}</p><p class="num-caption">${withArrows(num.caption)}</p></div>` : ''}
    </div>
    <div class="bottom">
      <p class="standing">${STANDING_LINE}</p>
      <p class="domain">zoebnomi.com</p>
    </div>
  </div>
</body>
</html>`;
}

// Shrink the title until it fits in ≤2 lines, and the numeral until it fits its column.
async function fit(tab) {
  await tab.evaluate(() => {
    const t = document.getElementById('title');
    let fs = 116;
    const maxH = () => fs * 0.98 * 2 + 2;
    t.style.fontSize = fs + 'px';
    // avoid breaking inside a single word: shrink until no word overflows
    while (fs > 64 && (t.scrollWidth > t.clientWidth || t.getBoundingClientRect().height > maxH())) {
      fs -= 2;
      t.style.fontSize = fs + 'px';
    }
    const n = document.getElementById('num');
    if (n) {
      let nf = 190;
      const box = n.parentElement;
      const avail = () => box.clientWidth - 28;
      while (nf > 80 && n.scrollWidth > avail()) {
        nf -= 4;
        n.style.fontSize = nf + 'px';
      }
    }
  });
}

async function run() {
  const outDir = path.join(ROOT, 'public/og');
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const tab = await ctx.newPage();

  for (const p of pages) {
    await tab.setContent(templateHTML(p), { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);
    await fit(tab);
    const file = path.join(outDir, `${p.id}.png`);
    await tab.screenshot({ path: file });
    console.log(`${p.id}.png  ${(statSync(file).size / 1024).toFixed(1)} KB`);
  }

  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
