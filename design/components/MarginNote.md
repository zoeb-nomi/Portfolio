# MarginNote

`src/components/MarginNote.astro` · unchanged in v3

![MarginNote](../mocks/2026-11-12-v3/components/MarginNote.jpg)

## What it is

Reviewer-annotation. Never carries a fact that exists nowhere else.
Renders as <aside> (a real landmark) by default. When already nested inside
another <aside> (e.g. Section's margin column), pass as="div", a landmark
should never be nested inside another landmark of the same kind.

## Props

```ts
  label?: string;
  as?: 'aside' | 'div';
```

## Used on

- `/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
