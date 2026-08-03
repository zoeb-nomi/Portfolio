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
  'Open to US relocation',
];

// Simple literal-string negatives.
const NEGATIVE_LITERALS = [
  'BlueJ',
  'TaxGPT',
  '85%',
  '$800K',
  'cultural products',
  '1,200+',
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
