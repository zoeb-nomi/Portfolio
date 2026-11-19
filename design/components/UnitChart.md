# UnitChart

## Purpose
One square per case, filled when the thing counted happened: "3 of 40" felt as three filled squares in a field of 40.

## Anatomy
A row per item: a head (label and value text, tabular) and a grid of squares (`aria-hidden`). A key below names what filled and empty squares mean.

## Props
| prop | type | notes |
|---|---|---|
| `rows` | `Row[]` | `label`, `filled`, `of`, `text` (the visible value, for example "3 of 40 · 8%") |
| `cols` | `number` | squares per line |
| `filledMeans`, `emptyMeans` | `string` | key text |

## Tokens it reads
- Colour roles: `--color-text`, `--color-text-muted`.
- Type and space: `--font-data`, `--t-micro`, `--t-data`, `--s-1` to `--s-5`.
- Lines: `--line-object`. Motion: `--dur-base`.

## States and motion
Reveal: when motion is allowed, filled squares start empty (`data-state="pre"`) and fill in order once at 35% in view (`mountFigures`); the `EssayFigure` Replay link plays it again. Without script or with reduced motion the final fill is the HTML. Ink surface: roles re-point.

## Accessibility
The squares are decoration; the row's visible text carries the numbers.

## Used on
Pages: `/design/components/`, `/mirror-eval/`, `/screener-eval/`, `/writing/eval-harness-at-my-own-reflection/`, `/writing/nobody-reports-the-misses/`, `/writing/two-levers-that-did-not-move/`.
