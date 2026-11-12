# MiniFigure

`src/components/MiniFigure.astro` · new in v3

![MiniFigure](../mocks/2026-11-12-v3/components/MiniFigure.jpg)

## What it is

Mini figure: the small before -> after mark on tiles, ledger rows and case-
study Fig. 1s (DESIGN v3 D-07, D-16). HTML and hairlines, not SVG, so every
label stays at or above the 12px floor.
dumbbell  hollow square = before, filled square = after, joined by a 2px ink
line; a zoomed axis says so.
ratio     n of N as a filled share of one track.
bars      a few ink bars on one scale; `mark` puts the red verdict tick on one.
The final state is in the HTML. The motion layer draws the joining line and
the bars from zero (`data-draw`), once, when the figure enters view.

## Props

```ts
  /** One figure, or several labelled dumbbells sharing a frame (case-study Fig. 1). */
  fig?: Fig;
  rows?: Row[];
  size?: 'mini' | 'wide';
  /** Accessible summary; the figure itself is aria-hidden. */
  label: string;
```

## Used on

- `/about/`
- `/crosssource/`
- `/screener-eval/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
- Motion: the final state is in the HTML; the pre-reveal state lives in CSS under `.motion` and the motion layer (`src/scripts/motion.ts`) plays it. Reduced motion shows the final state.
