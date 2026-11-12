# PlayerStepper

`src/components/PlayerStepper.astro` · changed in v3

![PlayerStepper](../mocks/2026-11-12-v3/components/PlayerStepper.jpg)

## What it is

A step-through explainer built like a media player: a screen, five chapters, and a bar with Play/Pause, Back,
Next, a scrubber, the time, and a speed control. It never starts by itself. Without JavaScript the player is
hidden and the transcript below it (all five steps, in full) is the figure.

## Props

```ts
  stages: Stage[];
  /** Seconds each step lasts at 1x. */
  seconds?: number;
```

## Used on

- `/crosssource/`
- `/writing/the-judge-caught-a-bug/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
