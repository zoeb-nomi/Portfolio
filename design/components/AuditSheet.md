# AuditSheet

## Purpose
The home hero's second object (formerly Fig. 0, `Fig0.astro`): one flat sheet of squares, one per real model output that a check read, with the failed ones red. It is the evidence behind the count.

## Anatomy
- `<figure id="fig-0">` with a caption (number and title from `home.fig0`), a focusable stage (`role="group"`, `aria-label` = a one-sentence summary), the sheet, a live readout line and a caption sentence.
- The sheet is drawn band by band, one band per harness group, grouped in families with a plain row tag. Failed squares are last in reading order and are repeated on one red overlay per band (`.as-red`), which the scan reveals with a clip-path.
- A scan line (`data-f0-scan`) crosses the sheet once.
- Counts, summary, caption and legend come from `src/data/fig0-cells.ts`, which reads them out of the case-study copy.

## Props
None. Data: `cols`, `families`, `summary`, `caption`, `legend` from `fig0-cells.ts`, and `home.fig0` from `copy.ts`.

## Tokens it reads
- Colour roles: `--color-text`, `-text-muted`, `-surface`, `-surface-raised` (the sheet), `--color-accent` (failed squares), `-accent-text` (Fig. number, replay).
- Type and space: `--font-data`, `--t-label`, `--lh-snug`, `--lh-label`, `--s-1` to `--s-5`, `--header-h`, `--hit-min`, `--underline-offset`.
- Lines: `--line-object`, `--line-object-muted`, `--line-heavy`, `--line-hair`.

## States and motion
- Reveal: under `.motion`, before it has run, every square is paper (overlays clipped away). At 35% in view `motion.ts` sweeps the scan line once (1600 ms), revealing each overlay with the line; then the strip under the H1 wipes in (`SWEEP + 80` ms).
- Interaction: hovering a square, or moving a cursor with Arrow keys, Home, End from the one focusable stage (Escape clears), writes "harness, what, check: outcome (count)" into the `aria-live` readout.
- No JS, or reduced motion: the final state (red squares, tags, caption) is the HTML.
- Ink surface: roles re-point; it sits on paper on home.

## Accessibility
The squares are `aria-hidden`; the stage has the summary label and `aria-describedby` the readout, with a `:focus-visible` outline. No square is a tab stop.

## Used on
Pages: `/`, `/design/components/`.
