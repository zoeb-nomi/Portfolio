// functions/_lib/parse-contributions.mjs
//
// Shared parser for GitHub's public (undocumented, unauthenticated) HTML
// contributions endpoint: https://github.com/users/<login>/contributions
//
// Imported by:
//   - functions/api/contributions.ts   (Cloudflare Pages Function, live fetch)
//   - scripts/fetch-contributions.mjs  (prebuild snapshot generator)
//   - scripts/test-parse-contributions.mjs (fixture-based test)
//
// Deliberately dependency-free — no HTML parsing library, just regex over a
// known, narrow slice of GitHub's markup. GitHub does not document or version
// this endpoint; if they change the calendar markup this file is the first
// place to look. See README.md "Contributions graph" section.

const DAY_CELL_RE =
  /<td\b([^>]*\bclass="[^"]*\bContributionCalendar-day\b[^"]*"[^>]*)>/g;

const TOOLTIP_RE = /<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g;

const TOTAL_RE = /([\d,]+)\s+contributions?\s+in the last year/i;

function getAttr(tagAttrs, name) {
  const m = tagAttrs.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? m[1] : null;
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Parse a tooltip's text into a contribution count.
 * "No contributions on September 7th." -> 0
 * "1 contribution on May 3rd."          -> 1
 * "3 contributions on July 5th."        -> 3
 */
function parseTooltipCount(text) {
  const clean = decodeEntities(text);
  if (/^no contributions/i.test(clean)) return 0;
  const m = clean.match(/^(\d+)\s+contributions?/i);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Parse the GitHub contributions-calendar HTML into structured data.
 * Throws if it cannot find at least one day cell or the yearly total —
 * callers should treat a throw as "markup changed, endpoint unavailable".
 *
 * @param {string} html
 * @returns {{ total_last_year: number, days: { date: string, level: number, count: number }[] }}
 */
export function parseContributions(html) {
  // Map tooltip "for" id -> parsed count, so day cells can be matched to
  // their tooltip regardless of DOM order (GitHub renders tool-tip elements
  // outside the table, linked back to the cell via for="<cell id>").
  const tooltipById = new Map();
  let tm;
  TOOLTIP_RE.lastIndex = 0;
  while ((tm = TOOLTIP_RE.exec(html))) {
    const forId = getAttr(tm[1], 'for');
    if (!forId) continue;
    const count = parseTooltipCount(tm[2]);
    if (count !== null) tooltipById.set(forId, count);
  }

  const days = [];
  let dm;
  DAY_CELL_RE.lastIndex = 0;
  while ((dm = DAY_CELL_RE.exec(html))) {
    const attrs = dm[1];
    const date = getAttr(attrs, 'data-date');
    const levelStr = getAttr(attrs, 'data-level');
    const id = getAttr(attrs, 'id');
    if (!date || levelStr === null) continue;
    const level = parseInt(levelStr, 10);
    const count = id && tooltipById.has(id) ? tooltipById.get(id) : null;
    days.push({ date, level, count: count === null ? 0 : count });
  }

  days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const totalMatch = html.match(TOTAL_RE);
  const total_last_year = totalMatch
    ? parseInt(totalMatch[1].replace(/,/g, ''), 10)
    : days.reduce((sum, d) => sum + d.count, 0);

  if (days.length === 0 || totalMatch === null) {
    throw new Error(
      `parseContributions: markup did not match expected shape (days=${days.length}, totalFound=${!!totalMatch}) — GitHub may have changed the contributions-calendar HTML.`
    );
  }

  return { total_last_year, days };
}
