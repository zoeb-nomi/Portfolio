# Readings

`src/components/Readings.astro` · new in v3

![Readings](../mocks/2026-11-12-v3/components/Readings.jpg)

## What it is

Readings (Take B's B-07, drawn in the A system; replaces the home StatRow /
ProofStrip). Each headline number is a tile under a Heavy top bar: kicker,
numeral, a dimension figure from the datum (hollow) to the value (filled),
then the datum line (datum · change · n), the label and the source.
The DOM always holds the final numeral; the motion layer counts an
aria-hidden copy up from the datum and draws the dimension line (A §f).

## Props

```ts
  items?: typeof home.readings;
```

## Used on

- `/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
- Motion: the final state is in the HTML; the pre-reveal state lives in CSS under `.motion` and the motion layer (`src/scripts/motion.ts`) plays it. Reduced motion shows the final state.
