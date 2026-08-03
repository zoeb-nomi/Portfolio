// Generates 4 static 1200×630 OG images (bone paper, red top rule, display-serif
// title, mono standing line) via Playwright screenshotting a local HTML template.
// Run: node scripts/generate-og.mjs

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const STANDING_LINE = 'AI Product Manager · Bengaluru (IST)';

const pages = [
  { id: 'home', title: 'Zoeb Nomi', kicker: 'AI Product Manager · LLM Evaluation & RAG Quality' },
  { id: 'crosssource', title: 'CrossSource', kicker: 'Open evaluation harness for legal RAG citation accuracy' },
  { id: 'work', title: 'Work', kicker: 'Four companies, two promotions, one through-line' },
  { id: 'about', title: 'About', kicker: 'Zoeb Nomi · AI Product Manager' },
];

function b64(file) {
  return readFileSync(path.join(ROOT, 'public/fonts', file)).toString('base64');
}

const instrumentSerif = b64('instrument-serif-latin-400-normal.woff2');
const plexMono = b64('ibm-plex-mono-latin-400-normal.woff2');
const plexMonoMedium = b64('ibm-plex-mono-latin-500-normal.woff2');

function templateHTML({ title, kicker }) {
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
    border-top: 10px solid oklch(0.52 0.19 28);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px 88px 64px;
  }
  .top {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 15px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #6d675e;
  }
  .title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 116px;
    line-height: 0.98;
    letter-spacing: -0.015em;
    color: #191713;
    max-width: 1000px;
  }
  .kicker {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 20px;
    letter-spacing: .02em;
    color: #3b362e;
    max-width: 900px;
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
    <div>
      <p class="title">${title}</p>
      <p class="kicker" style="margin-top: 20px;">${kicker}</p>
    </div>
    <div class="bottom">
      <p class="standing">${STANDING_LINE}</p>
      <p class="domain">zoebnomi.com</p>
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  const outDir = path.join(ROOT, 'public/og');
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const pageCtx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const tab = await pageCtx.newPage();

  for (const p of pages) {
    const html = templateHTML(p);
    const tmpFile = path.join(outDir, `_tmp-${p.id}.html`);
    writeFileSync(tmpFile, html);
    await tab.goto(`file://${tmpFile}`);
    await tab.waitForTimeout(80);
    await tab.screenshot({ path: path.join(outDir, `${p.id}.png`) });
    writeFileSync(tmpFile, ''); // clear
  }

  await browser.close();

  // remove temp html files
  for (const p of pages) {
    try {
      unlinkSync(path.join(outDir, `_tmp-${p.id}.html`));
    } catch {}
  }

  console.log('OG images generated:', pages.map((p) => `${p.id}.png`).join(', '));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
