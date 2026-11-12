# CareerTimeline

`src/components/CareerTimeline.astro` · unchanged in v3

![CareerTimeline](../mocks/2026-11-12-v3/components/CareerTimeline.jpg)

## What it is

The About record as a vertical timeline, newest first, current role on top. The dates sit on the left, a spine
runs down the middle, and each entry reads: organisation (the headline), then role and detail, then a source
link if one exists. As you read down, the spine fills red, each marker fills as you pass it, and the entries
you have not reached yet are set in the muted ink. Everything is always on the page; reduced motion and no
script show it fully lit and still. A row with no link shows none: it is a claim taken on trust, and the page
does not imply otherwise.
"2019" is the year 2019; "2021–2022" runs to the end of 2022; "2025–present" has no end.
"Product Manager, Instead · owning production LLM output quality" -> org "Instead", role "Product Manager",
detail "owning production LLM output quality". The copy stays one string in copy.ts.
Newest first: whatever is still running, then by when it ended, then by when it began.

## Props

```ts
  items: Item[];
```

## Used on

- `/about/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
