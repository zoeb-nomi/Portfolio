# DataTable

`src/components/DataTable.astro` · changed in v3

![DataTable](../mocks/2026-11-12-v3/components/DataTable.jpg)

## What it is

Keep every data cell on one line (numbers, ids, ranges: "claude-haiku-4-5", "-3.05 to +2.76").
Wide tables then scroll sideways instead of breaking a value mid-token. Leave off for prose cells.

## Props

```ts
  caption: string;
  columns: string[]; // first column header is the row-label header
  rows: Row[];
  // Keep every data cell on one line (numbers, ids, ranges: "claude-haiku-4-5", "-3.05 to +2.76").
  // Wide tables then scroll sideways instead of breaking a value mid-token. Leave off for prose cells.
  nowrap?: boolean;
  /** D-14: at <=599px the table stacks into label/value rows instead of scrolling. */
  stack?: boolean;
```

## Used on

- `/builds/`
- `/crosssource/`
- `/mirror-eval/`
- `/screener-eval/`
- `/writing/decisions-api-legal-quiz/`
- `/writing/nobody-reports-the-misses/`
- `/writing/the-bus-stop-nobody-notices/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
