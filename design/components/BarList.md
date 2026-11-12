# BarList

`src/components/BarList.astro` · unchanged in v3

![BarList](../mocks/2026-11-12-v3/components/BarList.jpg)

## What it is

Horizontal bars for a short list of values on one scale. Each row is
"label, bar, value" in a real list, so the numbers are text first; the bar is
decoration. An optional note is a reviewer's annotation (red) on that row.

## Props

```ts
  rows: Row[];
  /** The value that fills the whole track. */
  max: number;
  heading?: string;
```

## Used on

- `/writing/nobody-reports-the-misses/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
