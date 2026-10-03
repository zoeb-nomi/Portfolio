import { existsSync } from 'node:fs';
import { extractSegments } from './extract.mjs';
import { loadLexicon, htmlPathFor } from './config.mjs';
import { splitSentences, toSpoken } from './spoken.mjs';

/**
 * Page -> narration script: segments in document order, each split into
 * sentences carrying both the page's words (`raw`, used for captions) and the
 * words the voice will say (`spoken`).
 */
export async function prepare(page) {
  const html = htmlPathFor(page);
  if (!existsSync(html)) throw new Error(`${html} not found. Run "npm run build" first (the narration is read from the built page).`);
  const words = loadLexicon();
  const segments = await extractSegments(html, page.overrides ?? {});
  for (const s of segments) {
    s.sentences = splitSentences(s.raw).map((raw) => ({ raw, spoken: toSpoken(raw, words) }));
  }
  return segments;
}
