# StatTiles

## Purpose
The proof tile without a figure: a Heavy top bar, a numeral, a label and an optional mono source.

## Anatomy
A `<ul>` of tiles; each holds the value (with a small unit), the label and an optional source line.

## Props
| prop | type | notes |
|---|---|---|
| `tiles` | `Tile[]` | `value`, `unit?`, `label`, `source?` |

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`.
- Type: `--font-heading`, `--font-data`, `--wght-head`, `--wdth-head`, `--track-display`, `--t-stat`, `--t-small`, `--t-label`, `--lh-tight`, `--lh-snug`.
- Space and lines: `--s-2`, `--s-3`, `--s-8`, `--line-heavy`.

## States and motion
Static. The numeral renders final and nothing counts (no tally here). Reduced motion and ink surface change nothing beyond the role re-point.

## Accessibility
Real list; each number sits beside its label and source as text.

## Used on
Pages: `/builds/`, `/design/components/`.
