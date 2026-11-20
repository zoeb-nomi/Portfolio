# UnitChart

## Purpose
A unit chart: one square per case, filled when the thing being counted happened. "3 of 40" is easier to feel as 3 filled squares in a field of 40 than as a percentage. The visible text carries the numbers; the squares are decoration.

## Anatomy
`.uc[data-fig="units"]` (`--cols` sets squares per line): one `.uc-row` per series with `.uc-head` (label and `.uc-value`, "3 of 40 · 8%") and `.uc-cells` (`aria-hidden`, `.uc-cell`, `.on` when filled), then `.uc-key` (a filled and an empty square with their meanings).

## Props
| prop | type | notes |
|---|---|---|
| `rows` | `Row[]` | `label`, `filled`, `of`, `text` (the printed value), optional `tone` (`'ink'` default, `'red'`) |
| `cols` | `number` | squares per line |
| `filledMeans`, `emptyMeans` | `string` | what a filled and an empty square mean (the key) |
| `emptyTone` | `'ink' \| 'red'` | draw empty squares in a red outline when the empties are the failure; default `ink` |

## Variants
`tone: 'red'` per row (the series under test or a failure); `emptyTone: 'red'` for the whole chart.

## Kit classes
Own `uc-*` classes; filled squares use `--color-text` or `--color-accent`, outlines `--line-strong`. Sits in an `EssayFigure`.

## Motion
Plays once as it scrolls into view: squares fade in by row and index (`scripts/figure-motion.ts`). Without the script or with reduced motion the final state is in the HTML. Replay is the figure's chip.

## Accessibility
Each row's text states the count, so the squares are `aria-hidden`. The key states the meaning in words, not only by fill.

## Light and dark
Roles only; ink squares invert with the theme and red keeps its contrast.

## Used on
`/writing/two-levers-that-did-not-move/`, `/writing/nobody-reports-the-misses/`, `/writing/eval-harness-at-my-own-reflection/`.
