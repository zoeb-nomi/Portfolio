// scripts/fetch-contributions.mjs
//
// Prebuild step (wired as the `prebuild` npm script, so it runs automatically
// before `npm run build`). Fetches the live GitHub contributions HTML and
// writes a snapshot to src/data/contributions.json for ContributionGraph.astro
// to server-render — so the graph works with JS off and never disappears,
// even when the live /api/contributions fetch fails at request time.
//
// IMPORTANT: this script must never fail the build. If the fetch or parse
// fails (expected in sandboxed / offline CI environments — github.com may be
// unreachable), it logs a warning and leaves the existing snapshot in place
// untouched. A first-ever build with no network and no committed snapshot
// writes a small empty-but-valid placeholder instead of crashing.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseContributions } from '../functions/_lib/parse-contributions.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'src/data/contributions.json');
const GITHUB_LOGIN = 'zoeb-nomi';
const SOURCE_URL = `https://github.com/users/${GITHUB_LOGIN}/contributions`;

async function main() {
  let html;
  try {
    const res = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.warn(
      `[fetch-contributions] fetch failed (${err.message}) — keeping existing snapshot, not failing the build.`
    );
    ensurePlaceholderIfMissing();
    return;
  }

  let parsed;
  try {
    parsed = parseContributions(html);
  } catch (err) {
    console.warn(
      `[fetch-contributions] parse failed (${err.message}) — keeping existing snapshot, not failing the build.`
    );
    ensurePlaceholderIfMissing();
    return;
  }

  const snapshot = {
    source: 'snapshot',
    fetched_at: new Date().toISOString(),
    total_last_year: parsed.total_last_year,
    days: parsed.days,
  };

  writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(
    `[fetch-contributions] wrote ${OUT} — ${parsed.days.length} days, ${parsed.total_last_year} contributions.`
  );
}

function ensurePlaceholderIfMissing() {
  if (existsSync(OUT)) {
    const current = JSON.parse(readFileSync(OUT, 'utf8'));
    console.warn(
      `[fetch-contributions] existing snapshot kept (fetched_at: ${current.fetched_at}, ${current.days?.length ?? 0} days).`
    );
    return;
  }
  const placeholder = {
    source: 'snapshot',
    fetched_at: new Date().toISOString(),
    total_last_year: 0,
    days: [],
  };
  writeFileSync(OUT, JSON.stringify(placeholder, null, 2) + '\n');
  console.warn('[fetch-contributions] no existing snapshot — wrote an empty placeholder so the build can proceed.');
}

main().catch((err) => {
  // Belt-and-suspenders: this script must never fail the build.
  console.warn(`[fetch-contributions] unexpected error (${err.message}) — continuing build regardless.`);
});
