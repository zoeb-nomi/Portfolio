# EvidenceStack

`src/components/EvidenceStack.astro` · unchanged in v3

![EvidenceStack](../mocks/2026-11-12-v3/components/EvidenceStack.jpg)

## What it is

One sheet per engine, 63 squares per sheet (the search-mode probes). A dark square is a probe whose answer cited
the site or the repo in Wave 1, a red square is one Wave 2 added, a dashed square is one it lost. Each sheet is
named with a label that stays upright and readable as the stack tilts. Plays once as it scrolls into view: the
sheets slide apart, the Wave 1 squares fill, then the Wave 2 squares fill in red. The drawing is aria-hidden; the
list under it carries every number. Reduced motion lays the sheets flat in a grid.

## Props

```ts
  engines: Engine[];
  of: number;
  fromLabel: string;
  toLabel: string;
```

## Used on

- `/mirror-eval/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
