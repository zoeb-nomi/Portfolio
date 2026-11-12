# StatTiles

`src/components/StatTiles.astro` · new in v3

![StatTiles](../mocks/2026-11-12-v3/components/StatTiles.jpg)

## What it is

Stat tiles (DESIGN v3 D-07): the proof tile without its figure. Heavy top
bar, numeral, label, optional mono source. Used by /builds/#shipping.
The numeral counts up once in view (aria-hidden copy; the DOM keeps the value).
Parse "12", "90%", "$0.07", "4.2" into a count spec from zero.

## Props

```ts
  tiles: Tile[];
```

## Used on

- `/builds/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
- Motion: the final state is in the HTML; the pre-reveal state lives in CSS under `.motion` and the motion layer (`src/scripts/motion.ts`) plays it. Reduced motion shows the final state.
