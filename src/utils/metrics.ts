// Wraps an explicit, known list of canon metric substrings in <strong class="metric">.
// Deliberately NOT a generic number regex — every bolded token is enumerated in
// src/data/copy.ts against COPY PACK v1, so no number ships that isn't in the pack.

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderMetrics(text: string, metrics: string[] = []): string {
  if (!metrics.length) return escapeHtml(text);

  // Find all match positions for all metrics, longest-first to avoid partial overlaps.
  const sorted = [...metrics].sort((a, b) => b.length - a.length);
  const ranges: Array<[number, number]> = [];

  for (const m of sorted) {
    let from = 0;
    while (true) {
      const idx = text.indexOf(m, from);
      if (idx === -1) break;
      const end = idx + m.length;
      const overlaps = ranges.some(([s, e]) => idx < e && end > s);
      if (!overlaps) ranges.push([idx, end]);
      from = end;
    }
  }

  ranges.sort((a, b) => a[0] - b[0]);

  let out = '';
  let cursor = 0;
  for (const [start, end] of ranges) {
    out += escapeHtml(text.slice(cursor, start));
    out += `<strong class="metric">${escapeHtml(text.slice(start, end))}</strong>`;
    cursor = end;
  }
  out += escapeHtml(text.slice(cursor));
  return out;
}
