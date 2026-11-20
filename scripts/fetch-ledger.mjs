// scripts/fetch-ledger.mjs
//
// Prebuild step (after fetch-contributions). Refreshes src/data/ledger-snapshot.json from the agent ledger's
// public summary (home.v5.harness.ledgerUrl in copy.ts), so the harness panel's no-script / ledger-down fallback is
// as fresh as the last build, not frozen at the day the panel shipped.
//
// It must never fail the build: on any error (offline CI, ledger down, rate limit, unexpected shape) it warns and
// leaves the committed snapshot untouched. Timestamps are rounded down to the hour before they are written, so the
// public repo's history does not keep a minute-by-minute record of when work happened.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/data/ledger-snapshot.json');
const COPY = readFileSync(path.join(ROOT, 'src/data/copy.ts'), 'utf8');
const BASE = (COPY.match(/ledgerUrl:\s*'(https:\/\/[^']+)'/) || [])[1];

const hour = (iso) => {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? new Date(Math.floor(t / 3600000) * 3600000).toISOString() : null;
};
const isNum = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0;

async function main() {
  if (!BASE) return console.warn('[fetch-ledger] no ledgerUrl in copy.ts; keeping the committed snapshot.');
  let d;
  try {
    const res = await fetch(`${BASE}/v1/summary`, { headers: { 'user-agent': 'zoebnomi-build/1' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    d = await res.json();
  } catch (err) {
    return console.warn(`[fetch-ledger] ${err.message}; keeping the committed snapshot.`);
  }
  const ok =
    d && d.live && d.outcomes && Array.isArray(d.days) && d.days.length === 14 &&
    isNum(d.outcomes.shipped_total) && isNum(d.outcomes.caught_total) &&
    d.days.every((x) => /^\d{4}-\d{2}-\d{2}$/.test(x?.date) && isNum(x?.shipped) && isNum(x?.caught));
  if (!ok) return console.warn('[fetch-ledger] unexpected shape; keeping the committed snapshot.');
  d.generated_at = hour(d.generated_at);
  d.last_event_at = d.last_event_at ? hour(d.last_event_at) : null;
  writeFileSync(OUT, JSON.stringify(d, null, 2) + '\n');
  console.log(`[fetch-ledger] snapshot refreshed: ${d.outcomes.shipped_total} closed, ${d.outcomes.caught_total} caught since ${d.outcomes.since}`);
}

main();
