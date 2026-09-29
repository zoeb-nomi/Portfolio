// QA sweep — overflow, axe, font-weight, font-size scale, console/network.
// Run against a live site:  npx astro preview --host 127.0.0.1 --port 4321 &  npm run qa
// Env: BASE_URL (default http://127.0.0.1:4321). Report: .astro/qa-report.json
// Exit 1 on: overflow, axe violation, font-weight > 500, or any 4xx/5xx request.
// Font-size deviations, console errors and failed requests are WARN only.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const PAGES = [
  '/', '/about/', '/work/', '/evals/', '/crosssource/', '/mirror-eval/', '/screener-eval/',
  '/writing/',
  '/writing/eval-harness-at-my-own-reflection/',
  '/writing/the-bus-stop-nobody-notices/',
  '/writing/the-judge-caught-a-bug/',
  '/writing/two-levers-that-did-not-move/',
  '/404.html',
];
const WIDTHS = [360, 390, 412, 768, 1024, 1280, 1440, 1920];
const AXE_WIDTHS = [390, 1440];
const IGNORE = /umami|cloudflareinsights|\/api\/contributions/;

// --- allowed font sizes from tokens.css -----------------------------------
function loadScale() {
  const css = readFileSync(path.join(ROOT, 'src/styles/tokens.css'), 'utf8');
  const fixed = new Set();
  const ranges = [];
  for (const m of css.matchAll(/--t-[\w-]+:\s*([^;]+);/g)) {
    const v = m[1].trim();
    const c = v.match(/^clamp\(\s*([\d.]+)px\s*,.*,\s*([\d.]+)px\s*\)$/);
    if (c) ranges.push([parseFloat(c[1]), parseFloat(c[2])]);
    else if (/^[\d.]+px$/.test(v)) fixed.add(parseFloat(v));
  }
  return { fixed, ranges };
}
const scale = loadScale();
const sizeOk = (px) =>
  [...scale.fixed].some((f) => Math.abs(f - px) < 0.05) ||
  scale.ranges.some(([lo, hi]) => px >= lo - 0.05 && px <= hi + 0.05);

// --- in-page probes ---------------------------------------------------------
const textElements = () => {
  const out = [];
  const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'HEAD', 'TITLE', 'META', 'LINK', 'SVG']);
  const sel = (el) =>
    el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
    (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  for (const el of document.body.querySelectorAll('*')) {
    if (skip.has(el.tagName.toUpperCase()) || el.closest('svg')) continue;
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    out.push({ sel: sel(el), weight: parseInt(cs.fontWeight, 10), size: parseFloat(cs.fontSize), text: el.textContent.trim().slice(0, 40) });
  }
  return out;
};

const browser = await chromium.launch();
const results = [];
let fail = false;

for (const p of PAGES) {
  const r = { page: p, overflow: [], axe: [], heavy: [], sizes: [], console: [], failed: [], http: [] };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error' && !IGNORE.test(m.location().url || '') && !IGNORE.test(m.text())) r.console.push(m.text().slice(0, 160));
  });
  page.on('requestfailed', (q) => { if (!IGNORE.test(q.url()) && q.failure()?.errorText !== 'net::ERR_ABORTED') r.failed.push(`${q.url()} ${q.failure()?.errorText || ''}`); });
  page.on('response', (res) => {
    const u = res.url();
    if (res.status() < 400 || IGNORE.test(u)) return;
    if (p === '/404.html' && u === BASE + p) return; // the 404 page may itself be served as 404
    r.http.push(`${res.status()} ${u}`);
  });
  try {
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(80);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
      if (o.sw > o.iw) r.overflow.push(`${w}: ${o.sw}>${o.iw}`);
      if (AXE_WIDTHS.includes(w)) {
        await page.addScriptTag({ path: path.join(ROOT, 'node_modules/axe-core/axe.min.js') });
        const ax = await page.evaluate(() => axe.run());
        for (const v of ax.violations) r.axe.push(`${w}: ${v.id} (${v.impact}) x${v.nodes.length} ${v.nodes[0]?.target?.join(' ')}`);
      }
      if (w === 1440) {
        const els = await page.evaluate(textElements);
        const heavy = new Map(), bad = new Map();
        for (const e of els) {
          if (e.weight > 500) heavy.set(`${e.sel}=${e.weight}`, (heavy.get(`${e.sel}=${e.weight}`) || 0) + 1);
          if (!sizeOk(e.size)) bad.set(`${e.size}px`, [...(bad.get(`${e.size}px`) || []), e.sel]);
        }
        r.heavy = [...heavy].map(([k, n]) => `${k} x${n}`);
        r.sizes = [...bad].map(([k, s]) => `${k} x${s.length} e.g. ${s[0]}`);
      }
    }
  } catch (err) {
    r.http.push(`ERR ${err.message.split('\n')[0]}`);
  }
  await ctx.close();
  if (r.overflow.length || r.axe.length || r.heavy.length || r.http.length) fail = true;
  results.push(r);
}
await browser.close();

// --- output -------------------------------------------------------------------
const pad = (s, n) => String(s).padEnd(n);
console.log(`QA sweep ${BASE}  (font scale: fixed ${[...scale.fixed].join('/')}px, ${scale.ranges.length} clamp ranges)`);
console.log(pad('page', 46) + pad('ovf', 5) + pad('axe', 5) + pad('w>500', 7) + pad('http', 6) + pad('size~', 6) + pad('cons', 5) + 'reqfail');
for (const r of results) {
  console.log(pad(r.page, 46) + pad(r.overflow.length, 5) + pad(r.axe.length, 5) + pad(r.heavy.length, 7) + pad(r.http.length, 6) + pad(r.sizes.length, 6) + pad(r.console.length, 5) + r.failed.length);
}
for (const r of results) {
  for (const [k, label] of [['overflow', 'FAIL overflow'], ['axe', 'FAIL axe'], ['heavy', 'FAIL weight'], ['http', 'FAIL http'], ['sizes', 'WARN size'], ['console', 'WARN console'], ['failed', 'WARN reqfail']]) {
    for (const line of r[k].slice(0, 6)) console.log(`${label} ${r.page}  ${line}`);
    if (r[k].length > 6) console.log(`${label} ${r.page}  ... +${r[k].length - 6} more`);
  }
}
mkdirSync(path.join(ROOT, '.astro'), { recursive: true });
writeFileSync(path.join(ROOT, '.astro/qa-report.json'), JSON.stringify({ base: BASE, date: new Date().toISOString(), pass: !fail, results }, null, 2));
console.log(fail ? 'RESULT: FAIL' : 'RESULT: PASS');
process.exit(fail ? 1 : 0);
