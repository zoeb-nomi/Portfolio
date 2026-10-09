import type { APIRoute } from 'astro';
import {
  llmsTxt,
  meta,
  writingReflection,
  writingTwoLevers,
  writingBusStop,
  writingMisses,
  writingDecisions,
} from '../data/copy';
import { notes, isLive } from '../data/notes';

export const prerender = true;

const ORIGIN = 'https://www.zoebnomi.com';
const stripSuffix = (t: string) => t.replace(/\s+—\s+Zoeb Nomi$/, '');

// Essay list is generated from copy.ts so titles appear and it cannot drift.
// The judge-bug essay has no standalone data object, so it uses its meta entry.
const essays = [
  { slug: 'the-judge-caught-a-bug', title: stripSuffix(meta.writingJudgeBug.title), blurb: meta.writingJudgeBug.description },
  { slug: 'eval-harness-at-my-own-reflection', title: writingReflection.title, blurb: writingReflection.dek },
  { slug: 'two-levers-that-did-not-move', title: writingTwoLevers.title, blurb: writingTwoLevers.dek },
  { slug: 'the-bus-stop-nobody-notices', title: writingBusStop.title, blurb: writingBusStop.dek },
  { slug: 'nobody-reports-the-misses', title: writingMisses.title, blurb: writingMisses.dek },
  { slug: 'decisions-api-legal-quiz', title: writingDecisions.title, blurb: writingDecisions.dek },
];

const essayLines = essays.map(
  (e) => `- Writing — "${e.title}" (${e.blurb}): ${ORIGIN}/writing/${e.slug}/`,
);

// Notes are listed the same way, newest first, from src/data/notes.ts.
const noteLines = notes
  .filter((n) => isLive(n))
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((n) => `- Notes — "${n.title}" (${n.dek}): ${ORIGIN}/notes/${n.slug}/`);

// Drop the hand-written per-essay lines; keep the "Writing (essays index)" line.
const base = llmsTxt
  .split('\n')
  .filter((line) => !/^- Writing( —|:)/.test(line))
  .join('\n')
  .replace(/\n+$/, '\n');

export const GET: APIRoute = () => {
  return new Response(base + [...essayLines, ...noteLines].join('\n') + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
