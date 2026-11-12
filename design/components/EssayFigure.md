# EssayFigure

`src/components/EssayFigure.astro` · unchanged in v3

![EssayFigure](../mocks/2026-11-12-v3/components/EssayFigure.jpg)

## What it is

A captioned figure for essays: "Fig. N" proof mark + title above, source line
below. The body is a slot, so charts, diagrams and tables share one frame.

## Props

```ts
  n: number;
  title: string;
  /** Where the numbers come from, in words. */
  source?: string;
  href?: string;
  hrefLabel?: string;
  /** The figure animates: show a small Replay link (shown by figure-motion.ts when motion is allowed). */
  replay?: boolean;
```

## Used on

- `/crosssource/`
- `/mirror-eval/`
- `/notes/<slug>/`
- `/screener-eval/`
- `/writing/decisions-api-legal-quiz/`
- `/writing/eval-harness-at-my-own-reflection/`
- `/writing/nobody-reports-the-misses/`
- `/writing/the-judge-caught-a-bug/`
- `/writing/two-levers-that-did-not-move/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
