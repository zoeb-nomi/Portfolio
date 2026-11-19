Status: unused on the site (kept for reference)

# Readings

## Purpose
Headline numbers as readings: every number carries its datum, change, n and source (README principle 4). The home page currently builds this section inline, not with this component.

## Anatomy
A `<ul>`; each tile sits under a Heavy top bar and holds: kicker, numeral (with optional unit and a verdict word), a dimension figure (`aria-hidden`: a hollow datum mark, a filled value mark, a line between, an optional datum band, scale labels, optional zoom note), a datum line ("Datum, change, n"), the label and the source.

## Props
| prop | type | notes |
|---|---|---|
| `items` | `typeof home.readings` | default: `home.readings` in `src/data/copy.ts` |
| `compact` | `boolean?` | drop the kicker and datum line; default false |

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-surface`, `-accent-text` (verdict).
- Track fill: `--heat-0` (a token, not a role).
- Type: `--font-heading`, `--font-data`, `--wght-head`, `--wdth-head`, `--track-display`, `--t-stat`, `--t-small`, `--t-label`, `--lh-tight`, `--lh-snug`.
- Space and lines: `--s-1` to `--s-9`, `--line-heavy`, `--line-hair`, `--line-object`.

## States and motion
- The numeral in the HTML is always the final value. The motion layer draws the dimension line from the datum to the value (`data-draw`) and pops the value mark (`data-pop`) once in view; the numeral is not counted up by this component.
- Reduced motion or no script: final state. At 899px and below the tiles restack.
- Ink surface: roles re-point; `--heat-0` does not.

## Accessibility
The figure is `aria-hidden`; datum, change and n are printed as text. The verdict span has `aria-label="passed"`.

## Used on
No page imports it.
