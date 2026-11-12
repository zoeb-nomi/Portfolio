# Fig0

`src/components/Fig0.astro` · new in v3

![Fig0](../mocks/2026-11-12-v3/components/Fig0.jpg)

## What it is

Fig. 0: the home hero's story figure (Take B B-05/B-19, redrawn in red ink on
paper). Step 0 is the output: a memo line citing a passage that does not
support its claim, ringed by a red revision cloud. Steps 1 to 4 are the four
verbs, each with its proof, then a "Released" stamp.
The HTML is the complete, final drawing. With motion allowed, the motion
layer plays it once on load (steps rise in turn, connectors grow, the cloud
draws, the stamp lands at about 3.2 s) and un-hides the Replay button.

## Props

None.

## Used on

- `/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
- Motion: the final state is in the HTML; the pre-reveal state lives in CSS under `.motion` and the motion layer (`src/scripts/motion.ts`) plays it. Reduced motion shows the final state.
