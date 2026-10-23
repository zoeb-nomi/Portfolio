// GEO acceptance gate — build-spec.md §10 / copy-pack.md §9.
// Greps every positive string across dist/**/*.html + dist/llms.txt (search target
// is the UNION of those files — a positive string passes if it appears in ANY of
// them). Fails if any negative string is present anywhere in that same union.
//
// Run: node scripts/geo-gate.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const POSITIVES = [
  '0.994',
  '0.981',
  '0.760',
  '1.000',
  '100% (15/15)',
  '~95%',
  '22 public-domain US court opinions',
  '25 human-authored questions',
  'BM25',
  'Mata v. Avianca',
  'punctuation-only claim spans',
  '270K+',
  '100+',
  '378 sources',
  '~139K',
  '160+ tax strategies',
  'Source Explorer',
  'pipeline-collapse',
  'knowledge–citation gap', // en dash — matches pack exactly
  '~90%',
  '50+ scenarios over 5 rounds',
  'IRS e-filing',
  '$2.7M MRR',
  '28 US enterprise clients',
  'Checkr',
  '27%',
  '$121K',
  '28%',
  '80%',
  '$100K',
  '47%',
  '21 days',
  '150+ countries',
  '43%',
  '31%',
  'STOA',
  'MIT Aurangabad',
  'CrossSource',
  'github.com/zoeb-nomi/crosssource',
  'linkedin.com/in/zoebnomi',
  'calendar.app.google/56javKNeXqw7X8oq6',
  'zoeb.nomi@gmail.com',

  // mirror-eval — copy-pack-additions.md §16, added 2026-09-10.
  'mirror-eval',
  'github.com/zoeb-nomi/mirror-eval',
  '13 → 63',
  '0 → 0',
  '0 → 25',
  '0 → 32',
  '79 → 11',
  '0 → 74',
  '228 → 36',
  '27% → 19%',
  '3/40',
  '12/40',
  '117 of 332',
  '86%',
  '63 search-mode probes',
  '332 per wave',
  'four hit (one tied)',
  'PM who ships code',

  // screener-eval — copy-pack-s17.md §19, added 2026-09-11.
  'screener-eval',
  'github.com/zoeb-nomi/screener-eval',
  '885',
  '21 open',
  '+0.07',
  '−1.14',
  '−0.90',
  '+0.41',
  '22.3',
  '6 of 21',
  '19 of 21',
  '29 / 0 / 0 / 0',
  'Three harnesses, one method',

  // CrossSource v0.3 — released 2026-10-20, added 2026-10-23. The v0.1 strings
  // above (0.981, 0.994, 0.760, 22 opinions, 25 questions) stay: labelled v0.1.
  'CrossSource v0.1',
  '150 items',
  '45 public US opinions',
  '75 qa_citation, 75 citation_check',
  'LABELING_PROTOCOL.md v1.1',
  'kappa 0.98',
  '27 of 30',
  'no human labelled every item',
  'not a full run',
  '0.919',
  '0.718',
  'github.com/zoeb-nomi/crosssource/releases/tag/v0.3',
  '10.5281/zenodo.23493797',
  '10.5281/zenodo.21969577',

  // Upstream contributions — added 2026-10-23. Both open, not merged.
  'github.com/column-tax/tax-calc-bench/pull/157',
  'github.com/freelawproject/eyecite/pull/360',
  'github.com/freelawproject/eyecite/issues/361',
  '15,988 citations',
];

// Instead's production numbers must never be attached to CrossSource. They are
// legitimate on the Instead work entry (~95%, 270K+ above) and "95%" is a
// common statistic ("95% CI"), so these are banned only where CrossSource is
// described: its case-study page, its SoftwareSourceCode JSON-LD on any page,
// and every llms.txt line that names CrossSource.
const CROSSSOURCE_BANNED = ['270K', '95%'];

// Simple literal-string negatives.
const NEGATIVE_LITERALS = [
  'BlueJ',
  'TaxGPT',
  '85%',
  '$800K',
  'cultural products',
  '1,200+',

  // mirror-eval — copy-pack-additions.md §16 negative checks, added 2026-09-10.
  '+1.41',
  '+0.65',
  '−0.25',

  // screener-eval — copy-pack-s17.md §19 negative checks, added 2026-09-11.
  // "Two harnesses, one method" is retired now that a third harness exists.
  'Two harnesses, one method',

  // Relocation language removed sitewide 2026-10-23; keep it out.
  'relocation',
];

// "Filed" as a standalone product name — must not match the common word
// "filed" (e.g. "a filed document") which is legitimate canon copy (lowercase,
// used in the reviewer's note). Case-sensitive whole-word match on "Filed".
const FILED_PRODUCT_NAME_RE = /\bFiled\b/;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function loadTargetFiles() {
  const all = walk(DIST);
  return all.filter((f) => f.endsWith('.html') || f.endsWith('llms.txt'));
}

function main() {
  const files = loadTargetFiles();
  if (!files.length) {
    console.error('No dist/**/*.html or dist/llms.txt files found. Run `npm run build` first.');
    process.exit(1);
  }

  const contents = files.map((f) => ({ file: path.relative(DIST, f), text: readFileSync(f, 'utf8') }));

  let allPositivesPass = true;
  const positiveResults = [];

  for (const positive of POSITIVES) {
    const hits = contents.filter((c) => c.text.includes(positive));
    const found = hits.length > 0;
    if (!found) allPositivesPass = false;
    positiveResults.push({ string: positive, found, files: hits.map((h) => h.file) });
  }

  let negativesClean = true;
  const negativeResults = [];

  for (const negative of NEGATIVE_LITERALS) {
    const hits = contents.filter((c) => c.text.includes(negative));
    const present = hits.length > 0;
    if (present) negativesClean = false;
    negativeResults.push({ string: negative, present, files: hits.map((h) => h.file) });
  }

  // "Filed" standalone-product-name check, context-aware (case-sensitive word match).
  const filedHits = contents.filter((c) => FILED_PRODUCT_NAME_RE.test(c.text));
  const filedPresent = filedHits.length > 0;
  if (filedPresent) negativesClean = false;
  negativeResults.push({ string: 'Filed (standalone product name)', present: filedPresent, files: filedHits.map((h) => h.file) });

  // CrossSource-scoped negatives.
  const csScopes = [];
  for (const c of contents) {
    if (c.file === path.join('crosssource', 'index.html')) csScopes.push({ where: c.file, text: c.text });
    if (c.file.endsWith('llms.txt')) {
      c.text.split('\n').filter((l) => l.includes('CrossSource')).forEach((l) => csScopes.push({ where: 'llms.txt', text: l }));
    }
    for (const m of c.text.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      if (m[1].includes('"SoftwareSourceCode"') && m[1].includes('"CrossSource"')) csScopes.push({ where: `${c.file} (JSON-LD)`, text: m[1] });
    }
  }
  for (const banned of CROSSSOURCE_BANNED) {
    const hits = [...new Set(csScopes.filter((s) => s.text.includes(banned)).map((s) => s.where))];
    if (hits.length) negativesClean = false;
    negativeResults.push({ string: `${banned} (in any CrossSource description)`, present: hits.length > 0, files: hits });
  }

  // ---- report ----
  console.log('\nGEO ACCEPTANCE GATE — positive strings (copy-pack §9)');
  console.log('='.repeat(72));
  for (const r of positiveResults) {
    const status = r.found ? 'PASS' : 'FAIL';
    console.log(`[${status}] ${r.string}`);
  }

  console.log('\nGEO ACCEPTANCE GATE — negative checks (must be absent)');
  console.log('='.repeat(72));
  for (const r of negativeResults) {
    const status = r.present ? 'FAIL (present)' : 'PASS (absent)';
    console.log(`[${status}] ${r.string}${r.present ? ' — found in: ' + r.files.join(', ') : ''}`);
  }

  const nPositivesFound = positiveResults.filter((r) => r.found).length;
  console.log('\n' + '='.repeat(72));
  console.log(`Positives: ${nPositivesFound} / ${POSITIVES.length} found`);
  console.log(`Negatives clean: ${negativesClean ? 'YES' : 'NO'}`);
  console.log('='.repeat(72));

  if (!allPositivesPass || !negativesClean) {
    console.error('\nGEO GATE: FAIL');
    process.exit(1);
  }

  console.log('\nGEO GATE: PASS');
}

main();
