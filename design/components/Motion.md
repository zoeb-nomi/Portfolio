# Motion

`src/components/Motion.astro` · new in v3

## What it is

Loads the motion layer (src/scripts/motion.ts, anime.js) on the page that
renders this component. Only home, /builds/, the case studies and /writing/
include it; every other page ships no animation library.

## Props

None.

## Used on

- `via Base`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
- Motion: the final state is in the HTML; the pre-reveal state lives in CSS under `.motion` and the motion layer (`src/scripts/motion.ts`) plays it. Reduced motion shows the final state.
