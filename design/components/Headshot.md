# Headshot

`src/components/Headshot.astro` · changed in v3

![Headshot](../mocks/2026-11-12-v3/components/Headshot.jpg)

## What it is

The one headshot <picture>. Three presets, each a different rendered size:
hero  ~240px plate (home hero, Figure)     : fills its container, square
thumb  120px (About masthead)
card   300px (EmbedCard)                   , the parent shrinks it on phones
avif -> webp -> jpg, from the same 480w/960w files everywhere. The parent
owns placement (margins, grid areas) via the `class` it passes in; this
component owns the picture's own box and crop.

## Props

```ts
  size?: Size;
  alt: string;
  loading?: 'eager' | 'lazy';
  class?: string;
```

## Used on

- `/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
