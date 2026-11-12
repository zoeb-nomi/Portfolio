#!/usr/bin/env node
// Link check over dist/ (the lychee equivalent; brief §6 "0 dead links").
//   - every internal href/src resolves to a built file (dir/ -> dir/index.html)
//   - every internal #fragment exists as an id on its target page
//   - every public/_redirects target resolves, fragment included
//   - with --external, every external http(s) link answers < 400 (HEAD, then GET)
// Run after `npm run build`:  npm run links   |   npm run links -- --external
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const EXTERNAL = process.argv.includes('--external');
const SITE = 'https://www.zoebnomi.com';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = path.join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(DIST).filter((f) => f.endsWith('.html'));

const fileFor = (p) => {
  const clean = decodeURIComponent(p.split('?')[0]);
  const full = path.join(DIST, clean);
  if (clean.endsWith('/')) return path.join(full, 'index.html');
  if (existsSync(full) && statSync(full).isFile()) return full;
  if (existsSync(path.join(full, 'index.html'))) return path.join(full, 'index.html');
  return null;
};

const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

const problems = [];
const external = new Map();
let internalN = 0;

function checkInternal(from, url) {
  internalN++;
  const [p, frag] = url.split('#');
  const target = p === '' ? from : fileFor(p);
  if (!target) return problems.push(`${path.relative(DIST, from)} -> ${url}  (no such page or file)`);
  if (frag && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(frag))) {
    problems.push(`${path.relative(DIST, from)} -> ${url}  (no id="${frag}" on the target)`);
  }
}

for (const file of pages) {
  const html = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, (s) => (s.includes('application/ld+json') ? '' : s.replace(/[\s\S]*/, '')));
  const base = '/' + path.relative(DIST, path.dirname(file)).split(path.sep).join('/') + '/';
  for (const m of html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) {
    let url = m[1].replace(/&amp;/g, '&');
    if (/^(mailto:|tel:|data:|javascript:)/.test(url)) continue;
    if (url.startsWith(SITE)) url = url.slice(SITE.length) || '/';
    if (/^https?:\/\//.test(url)) { if (!external.has(url)) external.set(url, path.relative(DIST, file)); continue; }
    if (url.startsWith('//')) continue;
    if (!url.startsWith('/') && !url.startsWith('#')) url = new URL(url, 'http://x' + base).pathname;
    // Pages Functions (functions/) answer /api/* at the edge, not from dist.
    if (url.startsWith('/api/')) continue;
    checkInternal(file, url);
  }
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/')) checkInternal(file, u);
    }
  }
}

// _redirects targets.
const redirectsFile = path.join(DIST, '_redirects');
let redirectN = 0;
if (existsSync(redirectsFile)) {
  for (const line of readFileSync(redirectsFile, 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [, to] = line.trim().split(/\s+/);
    redirectN++;
    checkInternal(redirectsFile, to);
  }
}

let externalBad = 0;
if (EXTERNAL) {
  const check = async (url) => {
    for (const method of ['HEAD', 'GET']) {
      try {
        const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'link-check (zoebnomi.com build)' } });
        if (res.status < 400 || res.status === 429 || res.status === 999) return null;
        if (method === 'GET') return res.status;
      } catch (e) {
        if (method === 'GET') return e.name;
      }
    }
  };
  const urls = [...external.keys()];
  for (let i = 0; i < urls.length; i += 8) {
    const batch = urls.slice(i, i + 8);
    const res = await Promise.all(batch.map(check));
    res.forEach((r, j) => { if (r) { externalBad++; problems.push(`${external.get(batch[j])} -> ${batch[j]}  (${r})`); } });
  }
}

console.log(`link-check: ${pages.length} pages, ${internalN} internal links and assets, ${redirectN} redirect targets, ${external.size} external URLs${EXTERNAL ? ' (checked)' : ' (not checked; pass --external)'}`);
if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\nlink-check: ${problems.length} dead link(s)`);
  process.exit(1);
}
console.log('link-check: 0 dead links');
