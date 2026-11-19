# MiniFigure

## Purpose
The small before-to-after mark on ledger rows and case-study Fig. 1 and Fig. 2. HTML and hairlines, not SVG, so every label stays at or above the 12px floor.

## Anatomy
A `role="img"` wrapper with an `aria-label` summary; the inside is `aria-hidden`. Rows (optionally with a row label) each hold one of:
- `dumbbell`: hollow square = before, filled square = after, joined by a 2px ink line; scale labels, an "axis zoomed" note when `zoomed`, and from/to end labels.
- `ratio`: n of N as a filled share of one track.
- `bars`: a few ink bars on one scale; a bar with `mark` gets its value in red text.

## Props
| prop | type | notes |
|---|---|---|
| `fig` | `Fig?` | one figure (`BuildFigure` except `flow`) |
| `rows` | `{label?, fig}[]?` | several labelled dumbbells sharing a frame |
| `size` | `'mini' \| 'wide'` | default `mini` |
| `label` | `string` | accessible summary, required |

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-surface`, `-accent-text` (marked bar value).
- Empty-track fill: `--heat-0` (a token, not a role).
- Type and space: `--font-data`, `--t-label`, `--s-1` to `--s-4`.
- Lines: `--line-object`, `--line-heavy`, `--line-hair`.

## States and motion
- Reveal: `data-draw` elements (join line, fills) draw from zero and `data-pop` markers pop in once when the figure enters view, or when its ledger panel opens (`src/scripts/motion.ts`). The final state is in the HTML.
- Reduced motion or no script: final state, no drawing.
- Ink surface: roles re-point; the `--heat-0` track does not (see the report).

## Accessibility
The figure is one image with a text summary (`label`); every number should also appear in the surrounding row text.

## Used on
Pages: `/about/`, `/crosssource/`, `/screener-eval/`.
Also via: `BuildsLedger`.
