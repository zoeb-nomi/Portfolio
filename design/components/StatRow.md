# StatRow

`src/components/StatRow.astro` · unchanged in v3

![StatRow](../mocks/2026-11-12-v3/components/StatRow.jpg)

## What it is

(No header comment in the source; see the markup.)

## Props

```ts
  value: string;
  verdict?: string | null;
  sub?: string | null;
  label: string;
  provenance?: string | null;
```

## Used on

- `/writing/the-bus-stop-nobody-notices/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
