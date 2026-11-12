# ForestPlot

`src/components/ForestPlot.astro` · unchanged in v3

![ForestPlot](../mocks/2026-11-12-v3/components/ForestPlot.jpg)

## What it is

Forest plot: each lever as a mean marker with its 95% interval on one shared axis, then the screener gap
drawn on the same scale. The values are text first; the drawing is aria-hidden. It plays once as it scrolls
into view (zero line, the lever intervals, then the screener bar) and has no controls of its own.

## Props

```ts
  groups: Group[];
  gap: Gap;
  min: number;
  max: number;
  ticks: number[];
  axisLabel: string;
```

## Used on

- `/screener-eval/`
- `/writing/two-levers-that-did-not-move/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
