# home/PipelineScene

## Purpose
The home hero and its pinned "Pipeline" scene: the claim, one red Book a call button, and a canvas of 167 real audit outputs flowing through five stations (Prompt, Retrieve, Draft, Check, Ship). Most pass; some are caught at Check. It is the site's one signature moment and carries the first-ten-seconds job.

## Anatomy
`section.pipe.gut#pipeline[data-module="pipeline"]`:
- `.hero`: `.id`, `h1.display#h1` (the underlined phrase is `.mk > .ul`), `.hsub`, and a `.ctas` row (`.btn`, `.tl`, a mono note).
- `.scene`: a `canvas[role="img"]` described by `#pipe-text`, the station labels (buttons), the tray blocks (one per harness) and a probe.
- `ol.cards`: five station cards in the kit's readout-card grammar (`.card-top`, `h3`, `.ros > .ro`), the Check card also holding a per-group breakdown (`.bk`).
- A `.hud.phud` strip and a mobile line, a station `rail`, a Skip link (`a.chip.skipb`) and a hint chip.
- Outside the section, `.ins`: the bottom-panel trace inspector (a non-modal dialog) with the path of one output, its detail line and the key hints.
- `script#pipeline-data`: JSON from `pipelineHome`, read by `src/scripts/pipeline.ts`.

## Props
None. Copy from `pipelineHome` (scene, trace, stations, audit, totals) and `home` in `copy.ts`. Per-group counts come from `src/data/fig0-cells.ts`; the build throws if they drift from `pipelineHome.totals`.

## Variants
None. The inspector shows a passed or a caught output.

## Kit classes
`.display`, `.mk > .ul`, `.id`, `.btn`, `.tl`, `.ctas`, `.lab`, `.card` family (`.card-top`, `.no`, `.ros`, `.ro`, `.v`, `.u`, `.s`), `.hud` family, `.chip`, `.sr`. Own scene classes (`.scene`, `.slabel`, `.tblk`, `.rail`, `.ins`).

## Motion
GSAP through `src/scripts/ds.ts`. A short pinned scroll (about 2.3 viewport heights) walks the stations; Skip and the rail jump; the load sequence draws the track and snaps stations in, with the hero readable in about 0.6 s. Numbers swap whole, never count. The scene pauses when it is off screen or the tab is hidden. Skip is always visible and any wheel, key, pointer or touch ends the pinned sequence. A click (not scroll) opens the inspector; Left and Right step it, Escape closes it. Reduced motion and no-JS show the completed run as a still with all five cards.

## Accessibility
The canvas has a label and an `aria-describedby` text list (`#pipe-text`) with every station's numbers, so the figure is complete as text. Station labels and the rail are real buttons; the inspector is a labelled dialog (`aria-modal="false"`) with a polite live detail line and a close button. The skip link target is the next section.

## Light and dark
Canvas drawing reads `--scene-bg`, `--scene-ink` and `--scene-red` (RGB triplets) through `sceneRGB()` and redraws on the `ds:theme` event, so toggling the theme repaints the scene at once. Everything else uses colour roles; the light theme adjusts one lift tint.

## Used on
`/` (the hero).
