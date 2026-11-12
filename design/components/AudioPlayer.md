# AudioPlayer

`src/components/AudioPlayer.astro` · unchanged in v3

![AudioPlayer](../mocks/2026-11-12-v3/components/AudioPlayer.jpg)

## What it is

Compact in-page narration player. Progressive enhancement, same pattern
as the §9 watch-card script: the markup starts as a working native
<audio controls> element, and the inline script below swaps it for the
custom row once it runs, so a no-JS reader still gets a full player,
just the browser's own chrome instead of ours.
Read-along cue tuple: [data-narr id, start seconds, end seconds].

## Props

```ts
  audio: AudioData;
  articleId: string;
```

## Used on

- `/crosssource/`
- `/mirror-eval/`
- `/screener-eval/`
- `/writing/decisions-api-legal-quiz/`
- `/writing/eval-harness-at-my-own-reflection/`
- `/writing/nobody-reports-the-misses/`
- `/writing/the-bus-stop-nobody-notices/`
- `/writing/the-judge-caught-a-bug/`
- `/writing/two-levers-that-did-not-move/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
