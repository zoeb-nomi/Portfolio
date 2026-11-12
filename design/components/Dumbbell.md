# Dumbbell

`src/components/Dumbbell.astro` · unchanged in v3

![Dumbbell](../mocks/2026-11-12-v3/components/Dumbbell.jpg)

## What it is

Dumbbell: one row per item, a hollow marker where it started and a filled marker where it ended, joined by a
line. It plays once as it scrolls into view: the filled marker slides from the start to the end. The values
are text first; the drawing is aria-hidden.

## Props

```ts
  rows: Row[];
  max: number;
  ticks: number[];
  fromLabel: string;
  toLabel: string;
  /** Appended to each value, e.g. "of 63". */
  unit?: string;
  heading?: string;
  /** Show the hollow / filled key (leave it off for later groups in the same figure). */
  showKey?: boolean;
```

## Used on

- `/mirror-eval/`
- `/writing/eval-harness-at-my-own-reflection/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
