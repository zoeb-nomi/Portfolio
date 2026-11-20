# Dumbbell

## Purpose
One row per item: a hollow marker where it started and a red marker where it ended, joined by a line. The before and after values are printed as text ("19 → 27 of 63"), and the drawing is `aria-hidden`.

## Anatomy
`.db[data-fig="dumbbell"]`: optional `.db-heading`, an optional key (hollow = from, red = to), then one `.fg-row` per item (`.fg-lab`, `.fg-trk` with `.db-link`, `.db-from`, `.db-to`, `.fg-val`, optional `.fg-note`), then a tick axis `.fg-axis`.

## Props
| prop | type | notes |
|---|---|---|
| `rows` | `Row[]` | `label`, `sub?`, `from`, `to`, `note?` |
| `max` | `number` | the axis maximum |
| `ticks` | `number[]` | axis tick values |
| `fromLabel`, `toLabel` | `string` | the key text |
| `unit` | `string?` | appended to each value, e.g. "of 63" |
| `heading` | `string?` | label above the figure |
| `showKey` | `boolean` | show the key; default `true` (leave off for later groups in one figure) |

## Variants
None. Several `Dumbbell`s in a row stack with spacing.

## Kit classes
The shared `.fg-*` pieces in `src/styles/figures.css` (`.fg-row`, `.fg-pt`, `.fg-line`, `.fg-axis`), sitting inside an `EssayFigure` (`.fig-frame`). Hollow means before, filled red means after.

## Motion
Plays once as the figure scrolls into view: the red marker and the line fade in, staggered by row (`scripts/figure-motion.ts`, start frame `data-state="pre"`). Without the script or with reduced motion the final state is what is in the HTML. The figure's Replay chip comes from `EssayFigure`.

## Accessibility
Values are text first; the drawing is hidden from assistive tech. Nothing relies on colour alone: the key and the "from → to" text carry the meaning.

## Light and dark
Roles only (muted text, accent marker, `--line-strong` outlines). Works on both grounds.

## Used on
`/writing/eval-harness-at-my-own-reflection/`.
