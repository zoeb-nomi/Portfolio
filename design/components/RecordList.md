# RecordList

`src/components/RecordList.astro` · changed in v3

![RecordList](../mocks/2026-11-12-v3/components/RecordList.jpg)

## What it is

Public record, the claims-you-can-check block that closes a Work entry.
Every row is `what` (with the artefacts as underlined red-ink links) on the
left and `where` (the surface it lives on) on the right. Rows whose only
link is still a placeholder (href starting `TODO_`) are not rendered: an
unlinked "public record" row is a claim pretending to be evidence.
Disambiguates the landmark when several entries each carry a record.
Drop the block's own top rule and spacing when it directly follows another
strong rule (e.g. a masthead): at most ONE strong rule between blocks.
The kicker is the block's heading. h3 inside a work entry; h2 when the list stands alone.

## Props

```ts
  kicker: string;
  items: RecordItem[];
  note?: string;
  // Disambiguates the landmark when several entries each carry a record.
  context?: string;
  // Drop the block's own top rule and spacing when it directly follows another
  // strong rule (e.g. a masthead): at most ONE strong rule between blocks.
  flush?: boolean;
  // The kicker is the block's heading. h3 inside a work entry; h2 when the list stands alone.
  headingLevel?: 'h2' | 'h3';
```

## Used on

- `/about/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
