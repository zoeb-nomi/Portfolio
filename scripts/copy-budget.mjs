// Copy budget and slop audit (design/README.md §9a, v4). Renders each budgeted route from dist/ at 1440px and
// counts the visible words in <main> (closed <details> panels do not count: depth one tap away is free).
// On every route it also flags the stock patterns the v4 review found: a mono sentence (mono is for numbers and
// labels), a long run of red text (red marks, it does not narrate), an italic display line, and a self-reference
// to a figure from outside it ("Fig. 0, step", "Next:" lines).
//
// A route with `enforce: true` fails the run when it is over budget or trips a check; the rest report only,
// until their v4 copy cut lands. Run after `npm run build`: node scripts/copy-budget.mjs
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveDist } from './lib/serve-dist.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const BUDGETS = [
  // Red Pen 5: the live audit's example answer (about 90 words) and the harness panel's data labels (about 60) are
  // artifacts on the page, not prose, so home's budget is 520.
  { route: '/', words: 520, enforce: true },
  { route: '/builds/', words: 700 },
  { route: '/about/', words: 500 },
  { route: '/writing/', words: 400 },
  { route: '/crosssource/', words: 900 },
  { route: '/mirror-eval/', words: 900 },
  { route: '/screener-eval/', words: 900 },
];
const MONO_MAX_WORDS = 16;
const RED_MAX_WORDS = 8;

const { server, origin } = await serveDist(ROOT);
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });

let failed = false;
for (const b of BUDGETS) {
  await page.goto(origin + b.route, { waitUntil: 'load' });
  const r = await page.evaluate(
    ({ MONO_MAX_WORDS, RED_MAX_WORDS }) => {
      const main = document.querySelector('main') ?? document.body;
      const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
      const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ');
      const visible = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
      const red = getComputedStyle(document.documentElement).getPropertyValue('--red-ink').trim();
      const probe = document.createElement('span');
      probe.style.color = red;
      document.body.append(probe);
      const redRgb = getComputedStyle(probe).color;
      probe.remove();
      const issues = [];
      for (const e of main.querySelectorAll('*')) {
        if (!visible(e) || e.closest('[aria-hidden="true"], details:not([open]) > :not(summary)')) continue;
        const text = e.innerText ?? '';
        const cs = getComputedStyle(e);
        const n = words(text);
        const isBlock = /^(P|LI|FIGCAPTION|DD|DT|BLOCKQUOTE|TD|H[1-6])$/.test(e.tagName);
        if (isBlock && cs.fontFamily.includes('Mono') && n > MONO_MAX_WORDS) issues.push(`mono sentence (${n} words): "${text.slice(0, 60)}…"`);
        if (isBlock && cs.color === redRgb && n > RED_MAX_WORDS && !e.querySelector('a')) issues.push(`red run (${n} words): "${text.slice(0, 60)}…"`);
        if (/^H[1-3]$/.test(e.tagName) && cs.fontStyle === 'italic') issues.push(`italic heading: "${text.slice(0, 60)}"`);
        if (words(own(e)) && /Fig\. 0, step|^Next:|Back to Fig\. 0/.test(own(e).trim())) issues.push(`self-reference: "${own(e).trim().slice(0, 60)}"`);
      }
      return { words: words(main.innerText), issues: [...new Set(issues)] };
    },
    { MONO_MAX_WORDS, RED_MAX_WORDS },
  );
  const over = r.words > b.words;
  const bad = b.enforce && (over || r.issues.length);
  if (bad) failed = true;
  const tag = bad ? 'FAIL' : over || r.issues.length ? 'warn' : 'ok  ';
  console.log(`${tag} ${b.route.padEnd(16)} ${String(r.words).padStart(5)} / ${b.words} words${b.enforce ? '' : '  (report only)'}`);
  for (const i of r.issues) console.log(`       ${i}`);
}

await browser.close();
server.close();
if (failed) {
  console.error('\ncopy-budget: FAIL');
  process.exit(1);
}
console.log('\ncopy-budget: pass on enforced routes');
