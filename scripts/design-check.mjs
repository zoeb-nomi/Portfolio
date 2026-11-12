#!/usr/bin/env node
// Design-system check (design/README.md §"Checks"). Fails when:
//   1. a palette hex declared in design/tokens.css appears in any other source file
//      (src/, scripts/, functions/, design/components/), case-insensitive, 3/6/8-digit forms;
//   2. any file other than design/tokens.css declares one of the token names
//      (`--paper: ...`), i.e. a second source of truth for a value.
// design/mocks/ holds frozen reference HTML and is not scanned.
//
// Run: npm run design   (no build, no dependencies)

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = path.join(ROOT, 'design', 'tokens.css');
const SCAN = ['src', 'scripts', 'functions', 'design/components', 'design/README.md'];
const EXT = /\.(astro|css|ts|tsx|js|mjs|cjs|md|json|svg|html)$/;
const SELF = path.relative(ROOT, fileURLToPath(import.meta.url));

const tokensCss = readFileSync(TOKENS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

// Normalise #abc / #aabbcc / #aabbccdd to six lowercase digits (alpha dropped).
const norm = (hex) => {
  let h = hex.slice(1).toLowerCase();
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split('').map((c) => c + c).join('');
  return h.slice(0, 6);
};

const palette = new Set();
const names = new Set();
for (const m of tokensCss.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
  names.add(m[1]);
  for (const h of m[2].matchAll(/#[0-9a-f]{3,8}\b/gi)) palette.add(norm(h[0]));
}

const walk = (p) => {
  const full = path.join(ROOT, p);
  let st;
  try { st = statSync(full); } catch { return []; }
  if (st.isFile()) return [full];
  return readdirSync(full).flatMap((f) => {
    if (f === 'node_modules' || f.startsWith('.')) return [];
    const child = path.join(p, f);
    const cs = statSync(path.join(ROOT, child));
    return cs.isDirectory() ? walk(child) : EXT.test(f) ? [path.join(ROOT, child)] : [];
  });
};

const problems = [];
for (const file of SCAN.flatMap(walk)) {
  const rel = path.relative(ROOT, file);
  if (rel === SELF) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      if (/^#\d{1,3}$/.test(m[0])) continue; // "#360", "#1": issue numbers, not colours
      if (palette.has(norm(m[0]))) problems.push(`${rel}:${i + 1}  palette hex ${m[0]} outside design/tokens.css; use var(--token)`);
    }
    if (/\.(css|astro)$/.test(rel)) {
      for (const m of line.matchAll(/(?<=^\s*|[{;]\s*)(--[a-z0-9-]+)\s*:/gi)) {
        if (names.has(m[1])) problems.push(`${rel}:${i + 1}  declares token ${m[1]}; tokens are declared only in design/tokens.css`);
      }
    }
  });
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\ndesign-check: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`design-check: clean (${palette.size} palette colours and ${names.size} token names live only in design/tokens.css)`);
