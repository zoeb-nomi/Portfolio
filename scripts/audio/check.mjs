#!/usr/bin/env node
// Is the narration still true to the page? Run after "npm run build".
//
//   npm run audio:check              every page in scripts/audio/pages.json
//   npm run audio:check -- <slug>    one page
//
// For every page that has audio it fails (exit 1) when:
//   - the page text no longer matches the text the audio was built from (STALE; lists the changed anchors)
//   - the mp3 / captions / data file is missing or empty
//   - the cues are not exactly the page's data-narr anchors, in order, non-overlapping, inside the duration
//   - chapters are not ascending or point at an unknown section
// Pages registered but never generated are reported, not failed.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { loadRegistry, outPaths, htmlPathFor } from './lib/config.mjs';
import { extractSegments } from './lib/extract.mjs';
import { applyOrder } from './lib/prepare.mjs';
import { hashSegments } from './lib/hash.mjs';

const only = process.argv[2];
const pages = loadRegistry().filter((p) => !only || p.slug === only);
if (only && !pages.length) { console.error(`"${only}" is not in scripts/audio/pages.json`); process.exit(2); }

let failed = false;
for (const page of pages) {
  const out = outPaths(page);
  if (!existsSync(out.manifest)) { console.log(`-    ${page.slug}: no audio generated yet (npm run audio:build -- ${page.slug})`); continue; }

  const errors = [];
  const m = JSON.parse(readFileSync(out.manifest, 'utf8'));
  for (const [what, f] of [['mp3', out.mp3], ['captions', out.vtt]]) {
    if (!existsSync(f) || statSync(f).size < 1024) errors.push(`${what} missing or empty (${f})`);
  }

  if (!existsSync(htmlPathFor(page))) {
    errors.push(`built page not found (${htmlPathFor(page)}); run "npm run build" first`);
  } else {
    const segs = applyOrder(await extractSegments(htmlPathFor(page), page.overrides ?? {}), page.moveAfter);
    const now = hashSegments(segs);
    const was = m.meta?.segmentHashes ?? {};
    if (now.textHash !== m.meta?.textHash) {
      const changed = [
        ...Object.keys(now.segmentHashes).filter((id) => was[id] !== now.segmentHashes[id]).map((id) => (id in was ? `${id} (text changed)` : `${id} (new on page)`)),
        ...Object.keys(was).filter((id) => !(id in now.segmentHashes)).map((id) => `${id} (removed from page)`),
      ];
      errors.push(`STALE: the page text changed since the audio was built: ${changed.join(', ')}. Re-run: npm run audio:build -- ${page.slug}`);
    }
    const ids = segs.map((s) => s.id);
    const cueIds = m.cues.map((c) => c[0]);
    if (JSON.stringify(ids) !== JSON.stringify(cueIds)) errors.push(`cue ids differ from the page's data-narr anchors (page ${ids.length}, cues ${cueIds.length})`);
  }

  let prevEnd = 0;
  for (const [id, s, e] of m.cues) {
    if (!(s >= prevEnd - 0.001 && e > s)) errors.push(`cue ${id} overlaps or is empty (${s}-${e}, previous ended ${prevEnd})`);
    prevEnd = e;
  }
  if (prevEnd > m.duration + 1) errors.push(`last cue ends at ${prevEnd}s but duration is ${m.duration}s`);
  let prevStart = -1;
  for (const c of m.chapters ?? []) {
    if (!(c.start > prevStart)) errors.push(`chapter ${c.id} is not after the previous chapter`);
    if (!m.cues.some(([id]) => id === `${c.id}-cue`)) errors.push(`chapter ${c.id} has no matching ${c.id}-cue anchor`);
    prevStart = c.start;
  }

  if (errors.length) { failed = true; console.log(`FAIL ${page.slug}`); errors.forEach((e) => console.log(`       ${e}`)); }
  else console.log(`ok   ${page.slug}: ${m.cues.length} cues, ${m.chapters.length} chapters, ${m.duration}s, ${m.meta.voice} @ ${m.meta.lufs} LUFS, text hash ${m.meta.textHash}`);
}
process.exit(failed ? 1 : 0);
