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

// Cards, titles, subtitles, numerals and the standing line come from
// src/data/copy.ts (`ogCards`), bundled on the fly with esbuild, so a card can
// never drift from its page (SPEC v3 #8). Colours come from design/tokens.css.
async function loadCopy() {
  const { build } = await import('esbuild');
  const out = await build({
    entryPoints: [path.join(ROOT, 'src/data/copy.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64');
  return import(url);
}

const { ogCards } = await loadCopy();
const STANDING_LINE = ogCards.standing;
const pages = ogCards.cards;
// The token file's first :root block, embedded so the card uses var(--paper) etc.
const TOKENS_ROOT = /:root\s*\{[\s\S]*?\n\}/.exec(readFileSync(path.join(ROOT, 'design/tokens.css'), 'utf8'))[0];

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
  ${TOKENS_ROOT}
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
    background: var(--paper);
    overflow: hidden;
  }
  .frame {
    position: relative;
    width: 1200px;
    height: 630px;
    border-top: 10px solid var(--red);
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
    color: var(--ink-muted);
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
    color: var(--ink);
  }
  .kicker {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 28px;
    line-height: 1.32;
    letter-spacing: 0;
    color: var(--ink-body);
    margin-top: 22px;
    text-wrap: balance;
  }
  .num {
    flex: 0 0 auto;
    width: 400px;
    text-align: right;
    border-right: 4px solid var(--red);
    padding-right: 28px;
  }
  .num-value {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 190px;
    line-height: 0.9;
    letter-spacing: -0.02em;
    color: var(--ink);
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
    color: var(--ink-muted);
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
    color: var(--ink);
  }
  .domain {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    letter-spacing: .04em;
    color: var(--ink-muted);
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

  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
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
