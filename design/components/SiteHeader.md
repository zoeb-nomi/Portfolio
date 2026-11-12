# SiteHeader

`src/components/SiteHeader.astro` · changed in v3

![SiteHeader](../mocks/2026-11-12-v3/components/SiteHeader.jpg)

## What it is

Site header (DESIGN v3 §e, D-05): wordmark + role line, the four nav items at
every width (no hamburger), and a red "Book a call →" action on desktop.
The header is named for view transitions so it holds still between pages.

## Props

```ts
  currentPath: string;
```

## Used on

- `via Base`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
