# ForestPlot

## Purpose
A forest plot: each lever drawn as a mean marker with its 95% interval on one shared axis, then the screener gap drawn on the same scale. The values are printed as text; the drawing is `aria-hidden`.

## Anatomy
`.fp[data-fig="forest"]`: one `.fp-group` per lever group (a title, `.fg-row` rows with `.fg-trk` holding the zero line, the interval `.fp-wh` and the mean `.fg-pt.is-fill`, a printed value "+0.07 (-0.02 to +0.16)", and a verdict line), then `.fp-gap` (the gap bar and the largest mark), then the tick axis and its label.

## Props
| prop | type | notes |
|---|---|---|
| `groups` | `Group[]` | `title` and `rows` (`label`, `sub?`, `mean`, `lo`, `hi`) |
| `gap` | `Gap` | `label`, `sub`, `mean`, `max`, `note` |
| `min`, `max` | `number` | the axis range |
| `ticks` | `number[]` | tick values |
| `axisLabel` | `string` | axis caption |

The verdict ("Both intervals include zero: ...") is computed from the data, not typed.

## Variants
None.

## Kit classes
The shared `.fg-*` pieces in `src/styles/figures.css` plus `.fp-*`; sits inside an `EssayFigure`. Red is the series under test; ink is the data.

## Motion
Plays once as it scrolls into view: the lever intervals, then the screener bar, fade in (`scripts/figure-motion.ts`). It has no controls of its own; the Replay chip is the figure's. Without the script or with reduced motion the final state shows.

## Accessibility
Every value and interval is text; the verdict line says what the intervals mean in words. The drawing carries no information the text lacks.

## Light and dark
Roles only (accent, muted text, `--line-strong`). Works on both grounds.

## Used on
`/writing/two-levers-that-did-not-move/`.
