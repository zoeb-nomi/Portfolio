// Reads the narration script straight from a built page: every element carrying
// data-narr, in document order. The page is the source of truth, so the audio
// can never drift from the words on screen, and the cue ids match the DOM ids
// the AudioPlayer highlights.
//
// Prose, headings and quotes are read as written. Tables, lists, figures and
// stat blocks cannot be read verbatim, so they need a hand-written spoken
// version in pages.json `overrides` (extraction fails loudly if one is missing
// rather than silently skipping content).

import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

export const kindOf = (id) => {
  if (id === 's0-title') return 'title';
  if (id === 's0-dek') return 'dek';
  if (/^s\d+-cue$/.test(id)) return 'cue';
  if (/-quote$/.test(id)) return 'quote';
  if (/-p\d+$/.test(id)) return 'para';
  return 'other';
};

/**
 * @param {string} htmlPath  e.g. dist/writing/<slug>/index.html
 * @param {Record<string,string>} overrides  id -> spoken text for non-prose anchors
 * @returns {Promise<{id:string, kind:string, raw:string, hashBasis:string}[]>}
 */
export async function extractSegments(htmlPath, overrides = {}) {
  // No page scripts, no network: we only need the parsed DOM.
  const html = readFileSync(htmlPath, 'utf8').replace(/<script\b[\s\S]*?<\/script>/gi, '');
  const browser = await chromium.launch();
  let found;
  try {
    const ctx = await browser.newContext();
    await ctx.route('**/*', (route) => route.abort());
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    found = await page.evaluate(() =>
      [...document.querySelectorAll('[data-narr]')].map((el) => {
        // Section headings render "<span class=mark>§1</span> <span class=label>Text</span>": say only the label.
        const label = el.querySelector('.label');
        const text = (label ?? el).textContent.replace(/\s+/g, ' ').trim();
        const structured = el.matches('table, dl, figure, ul, ol') || !!el.querySelector('table, dl, figure, svg, ul, ol');
        return { id: el.getAttribute('data-narr'), text, structured };
      }),
    );
  } finally {
    await browser.close();
  }

  const seen = new Set();
  const missing = [];
  const segments = [];
  for (const f of found) {
    if (seen.has(f.id)) throw new Error(`Duplicate data-narr id "${f.id}" in ${htmlPath}`);
    seen.add(f.id);
    if (f.structured && !(f.id in overrides)) { missing.push(f.id); continue; }
    const raw = f.id in overrides ? overrides[f.id] : f.text;
    if (!raw) throw new Error(`Empty narration text for "${f.id}" in ${htmlPath}`);
    // Overrides are hashed together with the page text so editing either one marks the audio stale.
    const hashBasis = f.id in overrides ? `${raw}||${f.text}` : raw;
    segments.push({ id: f.id, kind: kindOf(f.id), raw, hashBasis });
  }
  const unused = Object.keys(overrides).filter((id) => !seen.has(id));
  if (unused.length) throw new Error(`pages.json overrides for ids not on the page: ${unused.join(', ')}`);
  if (missing.length) {
    throw new Error(
      `These anchors contain a table, list or figure and need a spoken version in pages.json "overrides": ${missing.join(', ')}`,
    );
  }
  if (!segments.length) throw new Error(`No [data-narr] anchors found in ${htmlPath}`);
  return segments;
}
