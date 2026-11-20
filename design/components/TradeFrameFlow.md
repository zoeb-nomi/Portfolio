# TradeFrameFlow

## Purpose
"Who decides what runs" (Fig. 1): TradeFrame's decision path as a diagram. A dashed node only proposes; a solid node decides. Every label is printed in the SVG, and a token moves along the path: propose, validate, confirm, execute and record.

## Anatomy
`.bd-flow-wrap[data-tf-flow]`: an `svg.bd-flow` (`role="img"` with a label; nodes for the model, the deterministic gate, the US and India books and the log; kill-switch bars; the token), an `ol.bd-steps` of the four step labels, and `p.bd-flowcap` (the red "Fig. 1" and the title).

## Props
None. Copy from `pipelineBuilds.flow` and `builds.tradeframeFlow` in `copy.ts`.

## Variants
None.

## Kit classes
`.fno` (the figure number) plus own `bd-*` and SVG classes (`.nd`, `.dash`, `.ed`, `.ks`). Dashed means proposes, solid means decides; the accent marks the lit path and the kill switch.

## Motion
The script moves one token along the path on a 4.4 second cycle, alternating the US and India book, and one run in three fires the kill switch. It runs only while the figure is on screen and the tab is visible. Reduced motion (`motion()` from `ds.ts` is false) shows the finished path with all four steps lit.

## Accessibility
The SVG has a text label and every node label is real SVG text; the four steps are also an ordered list, so the sequence is readable without the animation. Nothing relies on colour alone (dashed versus solid).

## Light and dark
Roles only (`--color-surface`, `--line-strong`, accent for the path), so the diagram reads on graphite and on paper.

## Used on
`/builds/`, inside the `BuildsLedger` row for TradeFrame.
