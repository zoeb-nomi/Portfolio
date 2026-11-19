# Motion

## Purpose
Not visible. It loads the motion layer (`src/scripts/motion.ts`, anime.js) on the pages that render it, so other pages ship no animation library.

## Anatomy
A single `<script>` that imports `../scripts/motion.ts`. No markup.

## Props
None.

## Tokens it reads
None. The durations and easings it plays (`--dur-*`, `--ease-*`) live in `design/tokens.css`; pre-states live under `.motion` in `src/styles/motion.css`.

## States and motion
- Animation runs only when `<html>` has `.motion`, which the head sets when JS runs; Base removes it if the module has not booted in 4 seconds. Without it every element shows its final state.
- Verbs it drives: tally, reveal, stamp, and ledger and figure interactions. Marks belong to `pen.ts`.
- Reduced motion: handled in the script and in `motion.css`; the final state is shown.

## Accessibility
No UI. Never hides content from the HTML: pre-states exist only under `.motion`.

## Used on
Also via: `layout Base`.
Base renders it only when a page asks for motion (home, /builds/, the case studies, /writing/).
