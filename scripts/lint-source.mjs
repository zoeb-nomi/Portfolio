#!/usr/bin/env node
// Source-level design-system lint. The rendered-page audits (qa-sweep, tokens-audit) only see
// computed values on pages they are told about; this reads the CSS and templates themselves and
// fails on the things that drift quietly:
//
//   1. a media query or matchMedia() width that is not on the breakpoint grid (599/600, 899/900, 1099/1100)
//   2. a raw colour literal outside tokens.css (print white is the one allowed exception)
//   3. a raw line-height, underline offset, hit-area height or font-size that has a token
//
// Run: npm run lint   (no build needed, no dependencies)

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');

const BREAKPOINTS = new Set([599, 600, 899, 900, 1099, 1100]);
const LINE_HEIGHT = { '1.62': '--lh-prose', '1.5': '--lh-snug', '1.7': '--lh-label', '1.6': '--lh-body', '1.55': '--lh-base', '1.15': '--lh-heading', '1.02': '--lh-display', '1.1': '--lh-title' };
const FONT_PX = { '11px': '--t-micro / --t-label', '12px': '--t-note', '13px': '--t-data', '15px': '--t-small' };
// File + literal pairs that are deliberate. Keep this list short and justified.
const ALLOW = [
  { file: 'src/styles/base.css', match: /#ffffff/i, why: 'print: force a white page' },
  { file: 'src/layouts/Base.astro', match: /#f4f1ea/i, why: '<meta name="theme-color"> must be a literal; keep equal to --paper' },
];

const walk = (d) => readdirSync(d).flatMap((f) => { const p = path.join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|css)$/.test(p) ? [p] : []; });

const problems = [];
const report = (file, line, msg) => problems.push(`${path.relative(ROOT, file)}:${line}  ${msg}`);

for (const file of walk(SRC)) {
  const rel = path.relative(ROOT, file);
  const isTokens = rel === 'src/styles/tokens.css';
  readFileSync(file, 'utf8').split('\n').forEach((text, i) => {
    const n = i + 1;
    const line = text.replace(/\/\*.*?\*\//g, ''); // drop same-line comments
    if (/@media|matchMedia/.test(line)) {
      for (const m of line.matchAll(/(?:min|max)-width:\s*(\d+)px/g)) {
        if (!BREAKPOINTS.has(Number(m[1]))) report(file, n, `breakpoint ${m[1]}px is off the grid (599/600, 899/900, 1099/1100 only)`);
      }
    }
    if (!isTokens) {
      for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        if (/^#\d+$/.test(m[0])) continue; // an id selector or anchor, not a colour
        if (ALLOW.some((a) => a.file === rel && a.match.test(m[0]))) continue;
        if (/^\s*(\.|#|[a-z]).*\{/.test(line) && !/(color|background|fill|stroke|border|outline|shadow)/i.test(line)) continue;
        if (/(color|background|fill|stroke|border|outline|shadow|gradient)/i.test(line)) report(file, n, `raw colour ${m[0]}; use a token from tokens.css`);
      }
      const lh = line.match(/line-height:\s*([0-9.]+)\s*;/);
      if (lh && LINE_HEIGHT[lh[1]]) report(file, n, `line-height ${lh[1]} has a token: var(${LINE_HEIGHT[lh[1]]})`);
      if (/text-underline-offset:\s*3px/.test(line)) report(file, n, 'underline offset 3px has a token: var(--underline-offset)');
      const mh = line.match(/min-height:\s*(24|44)px/);
      if (mh) report(file, n, `min-height ${mh[1]}px has a token: var(${mh[1] === '24' ? '--hit-min' : '--hit-touch'})`);
      const fs = line.match(/font-size:\s*(\d+px)\s*;/);
      if (fs && FONT_PX[fs[1]]) report(file, n, `font-size ${fs[1]} equals a type token: var(${FONT_PX[fs[1]]})`);
    }
  });
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\nlint-source: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log('lint-source: clean (breakpoints on the grid, no raw colours, no raw values that have tokens)');
