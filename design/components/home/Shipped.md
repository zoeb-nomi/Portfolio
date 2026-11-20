# home/Shipped

## Purpose
The home "Shipped" section: three before → after panels on a red spine (Instead run time, Keka Background Verification, CrossSource precision). Each panel is a left column of facts and a right-hand visual. It is the "numbers are the proof" screen.

## Anatomy
`section.sec.spined.shipped.gut#shipped`: `.spine`, `p.kick`, `h2.h2[data-split]`, then three `article.panel`:
- Left (`data-stagger`): `.ph` (index and source), `h3.pt`, `dl.how` (rows of key and value), `.srcl`.
- Right (`.viz[data-viz]`): `.v-vals` with `.v-val.v-before` (the struck `.v-num` and `.v-strike`), `.v-arrow`, `.v-val` and a `.v-cap`, then the panel's own figure: `instead` is a run-time bar plus a 15-minute dial, `keka` is a three-node integration flow with a tally of squares, `crosssource` is a precision gauge with an odometer figure.
Every visual is drawn in its final state in the HTML.

## Props
None. Copy from `pipelineHome.shipped` in `copy.ts`; geometry (dial, gauge ticks) is computed from the copy's own numbers.

## Variants
Panel key `instead`, `keka` or `crosssource`.

## Kit classes
`.sec.spined`, `.spine`, `.kick`, `.h2`, `.panel`, `.ph`, `.pt`, `.how`, `.srcl`, `.v-vals`, `.v-val`, `.v-before`, `.v-num`, `.v-strike`, `.v-arrow`, `.v-cap`, `.lab`. The before value is hollow and struck in red; the after value is filled.

## Motion
`src/scripts/shipped.ts` replays each panel as a latched scrub: it plays forward once as the panel scrolls in and never reverses. Numbers appear whole (opacity and a 6px rise); the CrossSource figure is an odometer, not a count-up. Ambient ticks (the dial hand, the flowing dashes) run only while their panel is on screen. With reduced motion the script does nothing and the finished page shows; nothing shifts when scripts load.

## Accessibility
The panel facts and the before and after values are text in `article`s labelled by their `h3`; the visuals are `aria-hidden`. The spine is decorative. The headline numbers do not depend on the animation.

## Light and dark
Roles only (SVG strokes and fills read `--color-*`), so the dial, gauge and flow redraw with the theme with no script. Red stays the single accent on both grounds.

## Used on
`/` (after the hero scene).
