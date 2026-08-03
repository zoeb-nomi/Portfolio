// Targeted screenshot + axe regen for /work/ (desktop + mobile) after the
// 2026-08-03 client-logo integration pass. Mirrors scripts/audit.mjs but
// scoped to a single page.
// Run: node scripts/audit-work.mjs

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCREENSHOT_DIR = path.join(ROOT, 'screenshots');
mkdirSync(SCREENSHOT_DIR, { recursive: true });

const axeSource = readFileSync(path.join(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8');

const PORT = 4323;
const BASE = `http://localhost:${PORT}`;

const pages = [{ id: 'work', path: '/work/' }];

const viewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844 },
];

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) return resolve();
      } catch {}
      if (Date.now() - start > timeoutMs) return reject(new Error('preview server did not start in time'));
      setTimeout(tick, 300);
    };
    tick();
  });
}

async function main() {
  const astroBin = path.join(ROOT, 'node_modules/.bin/astro');
  const server = spawn(astroBin, ['preview', '--port', String(PORT), '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  let serverOutput = '';
  server.stdout.on('data', (d) => (serverOutput += d.toString()));
  server.stderr.on('data', (d) => (serverOutput += d.toString()));

  try {
    await waitForServer(BASE + '/');
  } catch (e) {
    console.error('Preview server failed to start.\n' + serverOutput);
    try { process.kill(-server.pid, 'SIGKILL'); } catch {}
    process.exit(1);
  }

  const browser = await chromium.launch();
  const results = [];
  const googleFontRequests = [];

  for (const p of pages) {
    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const tab = await context.newPage();

      const consoleErrors = [];
      tab.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      tab.on('pageerror', (err) => {
        consoleErrors.push(String(err));
      });
      tab.on('request', (req) => {
        const url = req.url();
        if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
          googleFontRequests.push({ page: p.id, viewport: vp.id, url });
        }
      });

      const resp = await tab.goto(BASE + p.path, { waitUntil: 'networkidle' });
      await tab.waitForTimeout(300);

      const screenshotPath = path.join(SCREENSHOT_DIR, `${p.id}-${vp.id}.png`);
      await tab.screenshot({ path: screenshotPath, fullPage: true });

      let axeViolations = [];
      try {
        await tab.evaluate(axeSource);
        axeViolations = await tab.evaluate(async () => {
          // eslint-disable-next-line no-undef
          const r = await axe.run(document, { resultTypes: ['violations'] });
          return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
        });
      } catch (e) {
        axeViolations = [{ id: 'axe-run-error', impact: 'unknown', nodes: 0, help: String(e) }];
      }

      results.push({
        page: p.id,
        viewport: vp.id,
        status: resp?.status() ?? null,
        consoleErrors,
        axeViolations,
        screenshot: path.relative(ROOT, screenshotPath),
      });

      await context.close();
    }
  }

  await browser.close();
  try { process.kill(-server.pid, 'SIGKILL'); } catch {}

  console.log('\nTARGETED AUDIT — work');
  console.log('='.repeat(72));
  for (const r of results) {
    console.log(`\n${r.page} [${r.viewport}] — HTTP ${r.status}`);
    console.log(`  console errors: ${r.consoleErrors.length}`);
    if (r.consoleErrors.length) for (const e of r.consoleErrors) console.log(`    - ${e}`);
    console.log(`  axe violations: ${r.axeViolations.length}`);
    for (const v of r.axeViolations) console.log(`    - [${v.impact}] ${v.id} (${v.nodes} node(s)): ${v.help}`);
    console.log(`  screenshot: ${r.screenshot}`);
  }
  console.log('\n' + '='.repeat(72));
  console.log(`Google Fonts requests detected: ${googleFontRequests.length}`);
  for (const g of googleFontRequests) console.log(`  - [${g.page}/${g.viewport}] ${g.url}`);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
