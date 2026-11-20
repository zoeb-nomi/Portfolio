# EssayFigure

## Purpose
The captioned figure for essays and notes (kit `.fig`). The body sits in `.fig-frame` on the sunk surface; the caption below opens with a red "Fig. N", then the title, then a mono source line. The body is a slot, so charts, diagrams, images and tables share one frame.

## Anatomy
`figure.fig.ef`: `div.fig-frame.ef-body` (the slot, plus an optional Replay chip), then `figcaption` with `span.fno`, the title and an optional `span.fsrc` (source text and an optional link).

## Props
| prop | type | notes |
|---|---|---|
| `n` | `number` | the figure number, printed "Fig. N" |
| `title` | `string` | caption text |
| `source` | `string?` | where the numbers come from, in words |
| `href`, `hrefLabel` | `string?` | a link appended to the source line |
| `replay` | `boolean` | show the Replay chip; set it when the figure animates; default `false` |

## Variants
With or without `replay`.

## Kit classes
`.fig`, `.fig-frame`, `.fno`, `.fsrc`, `.chip` (the Replay control). The figure grammar: sunk ground, red number, hairlines, mono labels.

## Motion
None of its own. The Replay chip is `hidden` in the HTML and `scripts/figure-motion.ts` reveals and wires it only when motion is allowed, for the animated figures inside (`Dumbbell`, `ForestPlot`, `UnitChart`, `ParserCompare`).

## Accessibility
A real `<figure>` with `<figcaption>`. The Replay control is a native button. The Replay label is typed in the component, not in `copy.ts` (a small exception to the copy rule).

## Light and dark
Roles only (`--color-surface-sunk` frame, `--line-hair` border, accent number). Both themes work unchanged.

## Used on
All essays and `/notes/[slug]/`: `the-bus-stop-nobody-notices`, `eval-harness-at-my-own-reflection`, `two-levers-that-did-not-move`, `nobody-reports-the-misses`, `the-judge-caught-a-bug`, `decisions-api-legal-quiz`.
