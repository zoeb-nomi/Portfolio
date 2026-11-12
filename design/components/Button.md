# Button

`src/components/Button.astro` · unchanged in v3

![Button](../mocks/2026-11-12-v3/components/Button.jpg)

## What it is

(No header comment in the source; see the markup.)

## Props

```ts
  href: string;
  variant?: 'primary' | 'secondary' | 'inverse';
  class?: string;
```

## Used on

- `/`
- `/notes/<slug>/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
