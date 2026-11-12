# PullQuote

`src/components/PullQuote.astro` · changed in v3

![PullQuote](../mocks/2026-11-12-v3/components/PullQuote.jpg)

## What it is

(No header comment in the source; see the markup.)

## Props

```ts
  kicker?: string;
  rule?: 'ink' | 'red';
```

## Used on

- `/`
- `/builds/`
- `/crosssource/`
- `/mirror-eval/`
- `/screener-eval/`
- `/writing/eval-harness-at-my-own-reflection/`
- `/writing/nobody-reports-the-misses/`
- `/writing/the-bus-stop-nobody-notices/`
- `/writing/the-judge-caught-a-bug/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
