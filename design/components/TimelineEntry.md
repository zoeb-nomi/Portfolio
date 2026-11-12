# TimelineEntry

`src/components/TimelineEntry.astro` · changed in v3

![TimelineEntry](../mocks/2026-11-12-v3/components/TimelineEntry.jpg)

## What it is

(No header comment in the source; see the markup.)

## Props

```ts
  company: string;
  role: string;
  dateRange: string;
  descriptor?: string | null;
  standfirst?: string | null;
  achievements: Achievement[];
  primary?: boolean;
  logo?: Logo | null;
  note?: string | null;
  /** h2 when the entries stand alone; h3 inside About's §2 The record. */
  headingLevel?: 'h2' | 'h3';
```

## Used on

- `/about/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
