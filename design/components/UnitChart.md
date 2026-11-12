# UnitChart

`src/components/UnitChart.astro` · unchanged in v3

![UnitChart](../mocks/2026-11-12-v3/components/UnitChart.jpg)

## What it is

Unit chart: one square per case, filled when the thing being counted
happened. "3 of 40" is easier to feel as 3 filled squares in a field of 40
than as a percentage. The squares are decoration (aria-hidden); the row's
visible text carries the numbers, so screen readers get them too.

## Props

```ts
  rows: Row[];
  /** Squares per line. */
  cols: number;
  /** What a filled square means, shown as the key. */
  filledMeans: string;
  emptyMeans: string;
```

## Used on

- `/mirror-eval/`
- `/screener-eval/`
- `/writing/eval-harness-at-my-own-reflection/`
- `/writing/nobody-reports-the-misses/`
- `/writing/two-levers-that-did-not-move/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
