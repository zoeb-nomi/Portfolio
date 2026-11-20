// The essays, in the order /writing/ lists them, for the related rows at the foot of each essay page.
import { writingIndex, writingDecisions, writingMisses, writingJudgeBug, writingTwoLevers, writingReflection } from '../data/copy';

const all = [
  { slug: 'decisions-api-legal-quiz', e: writingDecisions },
  { slug: 'nobody-reports-the-misses', e: writingMisses },
  { slug: 'the-judge-caught-a-bug', e: writingJudgeBug },
  { slug: 'two-levers-that-did-not-move', e: writingTwoLevers },
  { slug: 'eval-harness-at-my-own-reflection', e: writingReflection },
].map(({ slug, e }) => ({
  slug,
  href: `/writing/${slug}/`,
  title: e.title,
  kicker: e.kicker,
  num: writingIndex.numbers[slug],
}));

/** Up to `count` other essays, starting after the current one and wrapping round. */
export function relatedEssays(current: string, count = 3) {
  const i = all.findIndex((x) => x.slug === current);
  const rest = all.filter((x) => x.slug !== current);
  const start = i < 0 ? 0 : i % rest.length;
  return [...rest.slice(start), ...rest.slice(0, start)].slice(0, count);
}
