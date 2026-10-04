import { existsSync } from 'node:fs';
import { extractSegments } from './extract.mjs';
import { loadLexicon, htmlPathFor } from './config.mjs';
import { splitSentences, toSpoken } from './spoken.mjs';

/**
 * Page -> narration script: segments in document order, each split into
 * sentences carrying both the page's words (`raw`, used for captions) and the
 * words the voice will say (`spoken`).
 */
/** Move segments so they are spoken in a different order than they appear in the markup. */
export function applyOrder(segments, moveAfter = {}) {
  const out = [...segments];
  for (const [id, after] of Object.entries(moveAfter)) {
    const i = out.findIndex((s) => s.id === id);
    if (i < 0) throw new Error(`pages.json moveAfter: no anchor "${id}" on the page`);
    const [seg] = out.splice(i, 1);
    const j = out.findIndex((s) => s.id === after);
    if (j < 0) throw new Error(`pages.json moveAfter: no anchor "${after}" on the page`);
    out.splice(j + 1, 0, seg);
  }
  return out;
}

export async function prepare(page) {
  const html = htmlPathFor(page);
  if (!existsSync(html)) throw new Error(`${html} not found. Run "npm run build" first (the narration is read from the built page).`);
  const words = loadLexicon();
  const segments = applyOrder(await extractSegments(html, page.overrides ?? {}), page.moveAfter);
  for (const s of segments) {
    s.sentences = splitSentences(s.raw).map((raw) => ({ raw, spoken: toSpoken(raw, words) }));
  }
  return segments;
}
