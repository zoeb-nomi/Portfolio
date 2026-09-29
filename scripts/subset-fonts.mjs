// Rebuilds the self-hosted IBM Plex woff2 subsets in public/fonts with the extra
// UI glyphs the site uses (→ ₹ − ≈ ▶ ✓ ↑). Repeatable and idempotent.
//
//   node scripts/subset-fonts.mjs
//
// Needs: python3 with fonttools + brotli
//   pip install --break-system-packages fonttools brotli
// Full Plex sources are fetched with `npm pack @ibm/plex-sans @ibm/plex-mono`
// into a temp dir (nothing is added to package.json).
//
// Baseline = every codepoint in the original @fontsource "latin" subset (so no
// existing coverage is lost) + EXTRA below. Layout features match the original
// subsets. Instrument Serif is NOT rebuilt: the font has no arrow/₹/≈/✓/▶
// glyphs at all (only U+2212 among these), so there is nothing to add — those
// characters must come from the body/mono stack (see the report in the PR).
// Note: IBM Plex has no ▶ (U+25B6) either; it falls back to a system font.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/fonts');
const FS = path.join(ROOT, 'node_modules/@fontsource');

// → ₹ − ≈ ▶ ✓ ↑
const EXTRA = [0x2192, 0x20b9, 0x2212, 0x2248, 0x25b6, 0x2713, 0x2191];

const SANS_FEATURES = 'ccmp,dnom,frac,liga,numr,kern,mark';
const MONO_FEATURES = 'ccmp,dnom,frac,numr,mark';

const jobs = [
  { pkg: '@ibm/plex-sans', src: 'IBMPlexSans-Regular.woff2', base: 'ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2', out: 'ibm-plex-sans-latin-400-normal.woff2', features: SANS_FEATURES },
  { pkg: '@ibm/plex-sans', src: 'IBMPlexSans-Medium.woff2', base: 'ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2', out: 'ibm-plex-sans-latin-500-normal.woff2', features: SANS_FEATURES },
  { pkg: '@ibm/plex-mono', src: 'IBMPlexMono-Regular.woff2', base: 'ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', out: 'ibm-plex-mono-latin-400-normal.woff2', features: MONO_FEATURES },
  { pkg: '@ibm/plex-mono', src: 'IBMPlexMono-Medium.woff2', base: 'ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2', out: 'ibm-plex-mono-latin-500-normal.woff2', features: MONO_FEATURES },
];

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...opts });

const tmp = mkdtempSync(path.join(tmpdir(), 'plex-'));
const extracted = {};
for (const pkg of new Set(jobs.map((j) => j.pkg))) {
  const tgz = run('npm', ['pack', pkg, '--silent'], { cwd: tmp }).trim().split('\n').pop();
  const dir = path.join(tmp, pkg.replace('/', '_'));
  mkdirSync(dir, { recursive: true });
  run('tar', ['xzf', path.join(tmp, tgz), '-C', dir]);
  extracted[pkg] = path.join(dir, 'package/fonts/complete/woff2');
}

const cmapDump = `
import sys
from fontTools.ttLib import TTFont
print(','.join('U+%04X' % c for c in sorted(TTFont(sys.argv[1]).getBestCmap())))
`;

for (const j of jobs) {
  const basePath = path.join(FS, j.base);
  const baseline = run('python3', ['-c', cmapDump, basePath]).trim();
  const unicodes = baseline + ',' + EXTRA.map((c) => 'U+' + c.toString(16).toUpperCase().padStart(4, '0')).join(',');
  const out = path.join(OUT, j.out);
  const before = existsSync(out) ? statSync(out).size : 0;
  run('pyftsubset', [
    path.join(extracted[j.pkg], j.src),
    `--output-file=${out}`,
    '--flavor=woff2',
    `--unicodes=${unicodes}`,
    `--layout-features=${j.features}`,
  ]);
  console.log(`${j.out}: ${before} -> ${statSync(out).size} bytes`);
}
