# FailureOwners

`src/components/FailureOwners.astro` · unchanged in v3

![FailureOwners](../mocks/2026-11-12-v3/components/FailureOwners.jpg)

## What it is

Which layer owns each failure. Every failure is a square: ink for a wrong-passage failure (tied to the prompt), red
for a missing-authority failure (traces to retrieval). The strict prompt row shows the same squares with the ones
that are gone left as dashed outlines. It plays once as it scrolls into view: the strict row starts identical to the
baseline row, then those squares empty out.

## Props

```ts
  baseline: Count;
  strict: Count;
  precision: { from: string; to: string };
  recall: { from: string; to: string };
```

## Used on

- `/crosssource/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
