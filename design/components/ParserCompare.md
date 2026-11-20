# ParserCompare

## Purpose
Two resume versions, one row of 29 squares each, per parser. Both are shown at rest; two checkboxes grey a version out so the other can be read alone. v4.1 is drawn in ink and v4.2 in red (the "after" series). Squares are grouped by outcome, not by field order, and every count is also written as text.

## Anatomy
`.pc[data-fig="parser"]` (carries `data-v1` and `data-v2`, `on` or `off`): a `.pc-show` group of two labelled checkboxes, then per parser a `.pc-parser` with `.pc-name` and two `.pc-line` rows (`.pc-ver`, `.pc-cells` of `.pc-cell.is-ok | is-missing | is-wrong | is-garbled`, `.pc-text` "21 ok · 3 missing · 4 wrong · 1 garbled"), then a key.

## Props
| prop | type | notes |
|---|---|---|
| `rows` | `Row[]` | `label`, `sub`, and `v1`, `v2` as four counts `[ok, missing, wrong, garbled]` |
| `v1Label`, `v2Label` | `string` | default "Résumé v4.1" and "Résumé v4.2" |

## Variants
Per-version visibility (`data-v1` / `data-v2`). Outcome shapes: ok is filled, missing is empty, wrong is crossed, garbled is hatched, so the key never relies on colour.

## Kit classes
Own `pc-*` classes; colours `--color-text-body` (v4.1) and `--color-accent` (v4.2) on `--color-surface-sunk`. Sits in an `EssayFigure`.

## Motion
Plays once as it scrolls into view (squares fade in by line, `scripts/figure-motion.ts`); toggling a version fades its row to 20%. Final state without the script or with reduced motion.

## Accessibility
Real checkboxes in a labelled group, at least the minimum hit size; the squares are `aria-hidden` and the counts are text. Unchecking a version only dims it, never removes its text.

## Light and dark
Roles only; ink and red swap value with the theme and keep their contrast.

## Used on
`/writing/two-levers-that-did-not-move/` (Fig. 3).
