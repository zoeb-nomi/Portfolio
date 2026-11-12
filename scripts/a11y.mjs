#!/usr/bin/env node
// axe-core over every built route at 390 / 768 / 1024 / 1440 (SPEC v3 #11, brief §6).
// Fails on any serious or critical violation. Routes come from the built sitemap
// plus /404.html (scripts/lib/pages.mjs). Run after `npm run build`:
//   npm run a11y                 all routes, four widths
//   CHROME=/path/to/chrome ...   use a specific Chromium build
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
import { sitemapPages } from './lib/pages.mjs';
import { serveDist } from './lib/serve-dist.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDTHS = [390, 768, 1024, 1440];
const routes = sitemapPages(ROOT);
const { server, origin } = await serveDist(ROOT);
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});

const summary = {};
const failures = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, reducedMotion: 'reduce' });
  // Third-party analytics never load in the sweep.
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  const counts = { routes: 0, serious: 0, critical: 0, moderate: 0, minor: 0 };
  for (const r of routes) {
    const page = await ctx.newPage();
    await page.goto(origin + r, { waitUntil: 'load' });
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    counts.routes++;
    for (const v of res.violations) {
      counts[v.impact] = (counts[v.impact] ?? 0) + v.nodes.length;
      if (v.impact === 'serious' || v.impact === 'critical') {
        failures.push(`${w}px ${r}  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
      }
    }
    await page.close();
  }
  summary[w] = counts;
  await ctx.close();
}
await browser.close();
server.close();

if (process.env.A11Y_JSON) writeFileSync(process.env.A11Y_JSON, JSON.stringify({ summary, failures }, null, 2));
for (const [w, c] of Object.entries(summary)) console.log(`${w}px  routes ${c.routes}  critical ${c.critical}  serious ${c.serious}  moderate ${c.moderate}  minor ${c.minor}`);
if (failures.length) {
  console.log('\n' + failures.join('\n'));
  console.log(`\na11y: ${failures.length} serious/critical finding(s)`);
  process.exit(1);
}
console.log('\na11y: 0 serious, 0 critical at 390/768/1024/1440');
