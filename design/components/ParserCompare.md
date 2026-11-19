# ParserCompare

## Purpose
Two résumé versions, one row of squares each, per parser. Both are shown at rest; two checkboxes grey a version out so the other can be read alone. Squares are grouped by outcome, not field order.

## Anatomy
- "Show" group with a checkbox per version (v1 in ink, v2 in red, the reviewer's colour for "after").
- Per parser: a name with sub line, then two lines (version tag, `aria-hidden` squares, a text line "n ok · n missing · n wrong · n garbled").
- A key (`aria-hidden`) for ok, missing, wrong, garbled.

## Props
| prop | type | notes |
|---|---|---|
| `rows` | `Row[]` | `label`, `sub`, `v1`, `v2` (counts: ok, missing, wrong, garbled) |
| `v1Label`, `v2Label` | `string?` | defaults "Résumé v4.1" and "Résumé v4.2" |

## Tokens it reads
- Colour roles: `--color-text`, `-text-muted`, `-surface`, `-accent` (v2 squares), `-accent-text` (v2 version tag).
- Type and space: `--font-data`, `--t-micro`, `--t-data`, `--s-1` to `--s-9`, `--hit-min`. Motion: `--dur-base`.

## States and motion
- Toggling a box sets `data-v1` or `data-v2` to `off` on the root, which greys that version's cells and tag.
- Reveal: squares fill in line by line once at 35% in view (`mountFigures`). Without script or with reduced motion the final state shows.
- Ink surface: roles re-point.

## Accessibility
Every count is also written as text, so nothing depends on colour. The checkbox group has `role="group"` and a label; targets use `--hit-min`.

## Used on
Pages: `/screener-eval/`, `/writing/two-levers-that-did-not-move/`.
