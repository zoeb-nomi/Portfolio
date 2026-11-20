#!/usr/bin/env node
// Text floor (design/README.md §4): no visible text renders under 11px at phone width, SVG text included
// (an SVG scaled into a narrow column shrinks its labels, which source-level lint cannot see).
// Renders every route in dist/sitemap at 375px, in both themes' layout (theme does not change size), and
// reports each visible text-bearing element whose rendered size is under the floor.
// Run after `npm run build`: node scripts/text-floor.mjs   (CHROME=/path to override Chromium)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveDist } from './lib/serve-dist.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FLOOR = 11;
const WIDTH = 375;

const sitemap = readFileSync(path.join(ROOT, 'dist/sitemap-0.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);

const { server, origin } = await serveDist(ROOT);
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage({ viewport: { width: WIDTH, height: 812 }, reducedMotion: 'reduce' });
await page.route(/agent-ledger\.[^/]*workers\.dev|cloudflareinsights|umami/, (r) => r.abort());

let bad = 0;
for (const r of routes) {
  await page.goto(origin + r, { waitUntil: 'load' });
  const hits = await page.evaluate((FLOOR) => {
    const out = [];
    const visible = (e) => {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      if (e.closest('.sr, .skip')) return false; // decorative (aria-hidden) text is still seen, so it is measured
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.height > 0;
    };
    const own = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    for (const e of document.querySelectorAll('main *')) {
      if (!own(e) || !visible(e)) continue;
      let px = parseFloat(getComputedStyle(e).fontSize);
      const svg = e.closest('svg');
      if (svg && e instanceof SVGElement) {
        const ctm = e.getScreenCTM();
        if (ctm) px *= Math.hypot(ctm.a, ctm.b);
      }
      if (px < FLOOR - 0.05) out.push(`${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0] : ''} ${px.toFixed(1)}px "${e.textContent.trim().slice(0, 30)}"`);
    }
    return out;
  }, FLOOR);
  if (hits.length) {
    bad += hits.length;
    console.log(`${r}`);
    for (const h of [...new Set(hits)].slice(0, 12)) console.log(`   ${h}`);
  }
}
await browser.close();
server.close();
if (bad) {
  console.log(`\ntext-floor: ${bad} element(s) under ${FLOOR}px at ${WIDTH}px`);
  process.exit(1);
}
console.log(`text-floor: clean (${routes.length} routes, nothing under ${FLOOR}px at ${WIDTH}px, SVG text included)`);
