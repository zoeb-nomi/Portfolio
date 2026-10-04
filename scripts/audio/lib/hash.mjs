import { createHash } from 'node:crypto';

export const sha = (s) => createHash('sha256').update(s).digest('hex');

/** Per-segment content hashes + one hash over all of them. Detects "page text changed, audio did not". */
export function hashSegments(segments) {
  const per = Object.fromEntries(segments.map((s) => [s.id, sha(s.hashBasis ?? s.raw).slice(0, 12)]));
  return { segmentHashes: per, textHash: sha(JSON.stringify(Object.entries(per))).slice(0, 16) };
}
