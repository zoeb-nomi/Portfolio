#!/usr/bin/env node
// Content-Security-Policy, written at build time (runs as `postbuild`).
//
// The site has a few inline scripts it cannot avoid: the pre-paint theme script in Base.astro and small page
// modules Astro inlines. This hashes every inline executable <script> in dist/ (JSON and JSON-LD blocks are data,
// not scripts, and CSP does not apply to them), builds one policy for the whole site, and writes it into
// dist/_headers under `/*`. If this step never runs, the site ships with no CSP rather than a broken one.
//
// It fails the build on anything a hash cannot cover: an inline event handler (onclick=) or a javascript: URL.
// Hosts: Cloudflare Web Analytics and Umami (scripts and beacons), the agent ledger (fetch + WebSocket, the home
// harness band), the YouTube no-cookie embed (About video, made on click), and one bus-stop poster hotlinked from
// i.ytimg.com (Zoeb's decision). Add a host here when the site starts loading something new from it.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const COPY = readFileSync(path.join(ROOT, 'src/data/copy.ts'), 'utf8');
const LEDGER = (COPY.match(/ledgerUrl:\s*'(https:\/\/[^']+)'/) || [])[1];

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = path.join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

const hashes = new Set();
const problems = [];
for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1] || '';
    if (/\ssrc=/.test(attrs)) continue;
    const type = (attrs.match(/\stype="([^"]*)"/) || [])[1];
    if (type && type !== 'module' && type !== 'text/javascript') continue; // application/json, ld+json: data
    if (!m[2].trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`);
  }
  const rel = path.relative(DIST, file);
  for (const m of html.matchAll(/\son[a-z]+="/g)) problems.push(`${rel}: inline event handler ${m[0].trim()}`);
  if (/href="javascript:/i.test(html)) problems.push(`${rel}: javascript: URL`);
}
if (problems.length) {
  console.error(problems.join('\n'));
  console.error('\ncsp: inline handlers or javascript: URLs cannot be allowed by a hash; move them into a script.');
  process.exit(1);
}

const ledger = LEDGER ? [LEDGER, LEDGER.replace(/^https:/, 'wss:')] : [];
const policy = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(' ')} https://static.cloudflareinsights.com https://cloud.umami.is`,
  "style-src 'self' 'unsafe-inline'", // style="" attributes carry chart geometry; no script can run from CSS
  "img-src 'self' data: https://i.ytimg.com",
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self' ${ledger.join(' ')} https://cloudflareinsights.com https://cloud.umami.is https://gateway.umami.is https://api-gateway.umami.dev`,
  'frame-src https://www.youtube-nocookie.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const headersPath = path.join(DIST, '_headers');
let headers = readFileSync(headersPath, 'utf8');
if (!/^\/\*\s*$/m.test(headers)) {
  console.error('csp: dist/_headers has no "/*" block to add the policy to.');
  process.exit(1);
}
headers = headers.replace(/^(\/\*\s*\n)/m, `$1  Content-Security-Policy: ${policy}\n`);
writeFileSync(headersPath, headers);
console.log(`csp: wrote a policy with ${hashes.size} inline-script hash(es) into dist/_headers`);
