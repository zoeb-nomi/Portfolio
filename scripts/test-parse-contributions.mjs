// Unit test for functions/_lib/parse-contributions.mjs, run against the real
// (fixture) HTML in tests/fixtures/contributions.html.
//
// Run: node scripts/test-parse-contributions.mjs   (also wired as `npm test`)

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseContributions } from '../functions/_lib/parse-contributions.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FIXTURE = path.join(ROOT, 'tests/fixtures/contributions.html');

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    failures += 1;
    console.error(`[FAIL] ${msg}`);
  } else {
    console.log(`[PASS] ${msg}`);
  }
}

function main() {
  const html = readFileSync(FIXTURE, 'utf8');
  const result = parseContributions(html);

  assert(typeof result.total_last_year === 'number', 'total_last_year is a number');
  assert(result.total_last_year === 75, `total_last_year === 75 (got ${result.total_last_year})`);

  assert(Array.isArray(result.days), 'days is an array');
  assert(
    result.days.length >= 360 && result.days.length <= 371,
    `days.length is ~365 (got ${result.days.length})`
  );

  const levels = new Set(result.days.map((d) => d.level));
  assert(
    [...levels].every((l) => l >= 0 && l <= 4),
    `every level is 0-4 (got [${[...levels].sort().join(', ')}])`
  );
  assert(levels.has(0) && levels.has(4), `both level 0 and level 4 are present (got [${[...levels].sort().join(', ')}])`);

  const sumCounts = result.days.reduce((s, d) => s + d.count, 0);
  assert(sumCounts === result.total_last_year, `sum(day.count) === total_last_year (${sumCounts} vs ${result.total_last_year})`);

  const dates = result.days.map((d) => d.date);
  const sorted = [...dates].sort();
  assert(JSON.stringify(dates) === JSON.stringify(sorted), 'days are sorted ascending by date');
  assert(new Set(dates).size === dates.length, 'no duplicate dates');

  for (const d of result.days) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(d.date), `date "${d.date}" matches YYYY-MM-DD`);
    break; // spot-check the shape once; full loop would be noisy on failure
  }

  // Spot-check one known real value from the fixture (fetched unauthenticated
  // — the anonymous, public-only view a Pages Function actually sees; an
  // authenticated browser session can show a higher total including private
  // contributions, which is why this number won't match what you see logged
  // into github.com yourself).
  const aug18 = result.days.find((d) => d.date === '2026-08-18');
  assert(!!aug18, '2026-08-18 present in parsed days');
  if (aug18) {
    assert(aug18.count === 10, `2026-08-18 count === 10 (got ${aug18.count})`);
    assert(aug18.level === 4, `2026-08-18 level === 4 (got ${aug18.level})`);
  }

  console.log(`\n${failures === 0 ? 'ALL TESTS PASSED' : `${failures} TEST(S) FAILED`}`);
  if (failures > 0) process.exit(1);
}

main();
