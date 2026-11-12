# OwnershipGap

`src/components/OwnershipGap.astro` · unchanged in v3

![OwnershipGap](../mocks/2026-11-12-v3/components/OwnershipGap.jpg)

## What it is

Illustration (not data): the ownership chart from the KYB example. It reads
as complete because nothing on it is wrong; the red node is what never made
it onto the page. Built from boxes and hairlines so the type stays on the
site's scale. The visible text carries the meaning.

## Props

```ts
  nodes: Node[];
```

## Used on

- `/writing/nobody-reports-the-misses/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
