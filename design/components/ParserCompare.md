# ParserCompare

`src/components/ParserCompare.astro` · unchanged in v3

![ParserCompare](../mocks/2026-11-12-v3/components/ParserCompare.jpg)

## What it is

Two résumé versions, one row of 29 squares each, per parser. Both versions are shown at rest; the two
checkboxes grey a version out so the other can be read alone. v4.1 is drawn in ink and v4.2 in red (the
reviewer's colour for "after"). The squares are grouped by outcome, not by field order. Every count is also
written out as text, so nothing depends on colour.

## Props

```ts
  rows: Row[];
  v1Label?: string;
  v2Label?: string;
```

## Used on

- `/screener-eval/`
- `/writing/two-levers-that-did-not-move/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
