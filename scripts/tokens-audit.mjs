// Tokens audit — does the rendered site stay inside The Red Pen's token set?
// (Pages come from the built sitemap; widths are 1440 / 1024 / 390.)
// Run against a live site:  npx astro preview --host 127.0.0.1 --port 4321 &  npm run tokens
// Env: BASE_URL (default http://127.0.0.1:4321). Report: .astro/tokens-report.json
//
//   (a) WARN  computed font-sizes outside the type tokens (fixed px + clamp ranges)
//   (b) FAIL  font-weight > 500
//   (c) FAIL  text / background colours outside the palette (probed from tokens.css)
//   (d) WARN  border / outline colour+width combos other than {1px ink, 1px rule, 2px red}
//   (e) WARN  border-radius other than 0
//
// Exit 1 on any (b) or (c). Pseudo-elements (::before/::after) are included.
// Chromium is preinstalled — never run `playwright install`.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { sitemapPages } from './lib/pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
// Every page in the built sitemap, plus /404.html (see scripts/lib/pages.mjs). Nothing to add by hand.
const PAGES = sitemapPages(ROOT);
// 1024 is the 900-1099px band (narrow margin column) that 1440/390 never render.
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

// --- token set from tokens.css --------------------------------------------
const css = readFileSync(path.join(ROOT, 'src/styles/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const fixedSizes = new Set();
const sizeRanges = [];
for (const m of css.matchAll(/--t-[\w-]+:\s*([^;]+);/g)) {
  const v = m[1].trim();
  const c = v.match(/^clamp\(\s*([\d.]+)px\s*,.*,\s*([\d.]+)px\s*\)$/);
  if (c) sizeRanges.push([parseFloat(c[1]), parseFloat(c[2])]);
  else if (/^[\d.]+px$/.test(v)) fixedSizes.add(parseFloat(v));
}
const sizeOk = (px) =>
  [...fixedSizes].some((f) => Math.abs(f - px) < 0.05) ||
  sizeRanges.some(([lo, hi]) => px >= lo - 0.05 && px <= hi + 0.05);

const colourTokens = [
  ...new Set([...css.matchAll(/(--(?:paper|ink|rule|red|on-red|heat)[\w-]*):/g)].map((m) => m[1])),
];

// --- in-page probe ----------------------------------------------------------
// Returns aggregated records: { cat, key, sel, n }. Runs once per page+viewport.
const probe = ({ colourTokens, fixed, ranges }) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const norm = (col) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = col;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3]];
  };
  const hex = (c) => '#' + c.slice(0, 3).map((v) => v.toString(16).padStart(2, '0')).join('') + (c[3] < 255 ? ' a' + (c[3] / 255).toFixed(2) : '');

  // palette: render a probe element per token, read back the computed colour
  const el = document.createElement('i');
  document.body.appendChild(el);
  const palette = {};
  for (const t of colourTokens) {
    el.style.color = `var(${t})`;
    palette[t] = norm(getComputedStyle(el).color);
  }
  el.remove();
  const near = (a, b) => Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1 && Math.abs(a[2] - b[2]) <= 1 && Math.abs(a[3] - b[3]) <= 2;
  const tokenFor = (c) => Object.keys(palette).find((t) => near(palette[t], c));
  const inkC = palette['--ink'], ruleC = palette['--rule'], redC = palette['--red'];

  const sizeOk = (px) => fixed.some((f) => Math.abs(f - px) < 0.05) || ranges.some(([lo, hi]) => px >= lo - 0.05 && px <= hi + 0.05);

  const agg = new Map();
  const add = (cat, key, sel) => {
    const k = cat + '\u0000' + key + '\u0000' + sel;
    agg.set(k, (agg.get(k) || 0) + 1);
  };
  const selOf = (e, pseudo) =>
    e.tagName.toLowerCase() +
    (e.id ? '#' + e.id : '') +
    (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') +
    (pseudo || '');

  const sides = ['Top', 'Right', 'Bottom', 'Left'];
  const corners = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'];

  const boxes = (e, cs, sel) => {
    // backgrounds
    const bg = norm(cs.backgroundColor);
    if (bg[3] > 0 && !tokenFor(bg)) add('colour', 'bg ' + hex(bg), sel);
    // borders (one record per distinct colour+width per element, not per side)
    const seen = new Set();
    for (const s of sides) {
      const w = parseFloat(cs['border' + s + 'Width']);
      if (!(w > 0) || cs['border' + s + 'Style'] === 'none' || cs['border' + s + 'Style'] === 'hidden') continue;
      const c = norm(cs['border' + s + 'Color']);
      if (c[3] === 0) continue;
      const ok = (w === 1 && near(c, inkC)) || (w === 1 && near(c, ruleC)) || (w === 2 && near(c, redC));
      const combo = `${w}px ${tokenFor(c) || hex(c)} (border)`;
      if (!ok && !seen.has(combo)) { seen.add(combo); add('line', combo, sel); }
    }
    const ow = parseFloat(cs.outlineWidth);
    if (ow > 0 && cs.outlineStyle !== 'none') {
      const c = norm(cs.outlineColor);
      if (c[3] > 0) {
        const ok = (ow === 1 && near(c, inkC)) || (ow === 1 && near(c, ruleC)) || (ow === 2 && near(c, redC));
        if (!ok) add('line', `${ow}px ${tokenFor(c) || hex(c)} (outline)`, sel);
      }
    }
    // radius
    const r = corners.map((k) => cs['border' + k + 'Radius']).find((v) => v && v !== '0px');
    if (r) add('radius', r, sel);
  };

  for (const e of document.body.querySelectorAll('*')) {
    if (e.closest('svg') || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(e.tagName)) continue;
    if (e.getClientRects().length === 0) continue;
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden') continue;
    const sel = selOf(e);
    boxes(e, cs, sel);

    if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
      const size = parseFloat(cs.fontSize);
      if (!sizeOk(size)) add('size', size.toFixed(2).replace(/\.?0+$/, '') + 'px', sel);
      const wt = parseInt(cs.fontWeight, 10);
      if (wt > 500) add('weight', String(wt), sel);
      const tc = norm(cs.color);
      if (tc[3] > 0 && !tokenFor(tc)) add('colour', 'text ' + hex(tc), sel);
    }

    for (const ps of ['::before', '::after']) {
      const pcs = getComputedStyle(e, ps);
      if (pcs.content === 'none' || pcs.content === 'normal' || pcs.display === 'none') continue;
      boxes(e, pcs, selOf(e, ps));
    }
  }
  return { records: [...agg.entries()].map(([k, n]) => { const [cat, key, sel] = k.split('\u0000'); return { cat, key, sel, n }; }), palette: Object.fromEntries(Object.entries(palette).map(([t, c]) => [t, hex(c)])) };
};

// --- run --------------------------------------------------------------------
const browser = await chromium.launch();
const totals = { size: new Map(), weight: new Map(), colour: new Map(), line: new Map(), radius: new Map() };
let palette = {};
const bump = (cat, key, sel, n, page) => {
  const m = totals[cat];
  const k = key + '\u0000' + sel;
  const cur = m.get(k) || { key, sel, n: 0, pages: new Set() };
  cur.n += n;
  cur.pages.add(page);
  m.set(k, cur);
};

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: vp });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + p, { waitUntil: 'load' });
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      await page.evaluate(() => document.fonts && document.fonts.ready);
      const res = await page.evaluate(probe, { colourTokens, fixed: [...fixedSizes], ranges: sizeRanges });
      palette = res.palette;
      for (const r of res.records) bump(r.cat, r.key, r.sel, r.n, `${p}@${vp.width}`);
    } catch (err) {
      console.error(`FAIL load ${p}@${vp.width}: ${err.message}`);
      process.exitCode = 1;
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();

// Rule (d) allowlist: component chrome, not a line tier.
const LINE_ALLOW = new Set([
  '1px --paper (border)\u0000a.rp-button.rp-button--inverse',
  '1px --red (border)\u0000a.rp-button.rp-button--primary',
]);
const rows = (m) =>
  [...m.values()]
    .filter((r) => !LINE_ALLOW.has(r.key + '\u0000' + r.sel))
    .map((r) => ({ key: r.key, selector: r.sel, count: r.n, pages: [...r.pages].slice(0, 4), pageCount: r.pages.size }))
    .sort((a, b) => b.count - a.count);
const sum = (rs) => rs.reduce((a, r) => a + r.count, 0);

const report = {
  base: BASE,
  generated: new Date().toISOString(),
  palette,
  sizeTokens: { fixed: [...fixedSizes].sort((a, b) => a - b), ranges: sizeRanges },
  a_fontSizesOffScale: rows(totals.size),
  b_fontWeightOver500: rows(totals.weight),
  c_offPaletteColours: rows(totals.colour),
  d_lineExceptions: rows(totals.line),
  e_nonZeroRadius: rows(totals.radius),
};
mkdirSync(path.join(ROOT, '.astro'), { recursive: true });
writeFileSync(path.join(ROOT, '.astro/tokens-report.json'), JSON.stringify(report, null, 2));

const show = (title, rs, level, limit = 12) => {
  const distinctSel = new Set(rs.map((r) => r.selector)).size;
  console.log(`\n${level === 'FAIL' && rs.length ? 'FAIL' : rs.length ? level : 'PASS'}  ${title} — ${sum(rs)} elements, ${rs.length} key+selector groups, ${distinctSel} selectors`);
  for (const r of rs.slice(0, limit)) console.log(`   ${String(r.count).padStart(5)}  ${r.key.padEnd(34)} ${r.selector}`);
  if (rs.length > limit) console.log(`   … ${rs.length - limit} more in .astro/tokens-report.json`);
};
console.log(`tokens-audit  ${BASE}  ${PAGES.length} pages x ${VIEWPORTS.map((v) => v.width).join('/')}`);
show('(a) font-size not in token set', report.a_fontSizesOffScale, 'WARN');
show('(b) font-weight > 500', report.b_fontWeightOver500, 'FAIL');
show('(c) colour not in palette', report.c_offPaletteColours, 'FAIL');
show('(d) line combo not {1px ink, 1px rule, 2px red}', report.d_lineExceptions, 'WARN');
show('(e) border-radius != 0', report.e_nonZeroRadius, 'WARN');

const failed = report.b_fontWeightOver500.length > 0 || report.c_offPaletteColours.length > 0;
console.log(`\n${failed ? 'FAIL' : 'PASS'} (report: .astro/tokens-report.json)`);
if (failed) process.exitCode = 1;
