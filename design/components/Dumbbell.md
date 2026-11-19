# Dumbbell

## Purpose
Before and after for several items on one scale: a hollow marker where it started, a filled marker where it ended, joined by a line. Values are text first; the drawing is decoration.

## Anatomy
Optional heading and a hollow/filled key; then one row per item: label (with optional `sub`), track (aria-hidden: line, hollow marker, filled marker), value text "from → to unit", optional note; a tick axis below. Shared figure styles live in `src/styles/figures.css`.

## Props
| prop | type | notes |
|---|---|---|
| `rows` | `Row[]` | `label`, `sub?`, `from`, `to`, `note?` |
| `max` | `number` | scale end |
| `ticks` | `number[]` | axis labels |
| `fromLabel`, `toLabel` | `string` | key text |
| `unit` | `string?` | appended to each value, for example "of 63" |
| `heading` | `string?` | |
| `showKey` | `boolean?` | default true; turn off for later groups in one figure |

## Tokens it reads
- Colour roles: `--color-text-muted` here; markers and line read `--color-surface` and `--color-text` through `figures.css`.
- Type and space: `--font-data`, `--t-micro`, `--track-wide`, `--s-1` to `--s-6`. Motion: `--ease-draw`.
- Hollow = before, filled = after (README section 6).

## States and motion
- Reveal: when motion is allowed the figure starts at `data-state="pre"` (filled marker on the hollow one, line collapsed) and plays once at 35% in view; the filled marker slides to its value. The `EssayFigure` Replay link plays it again.
- Without script or with reduced motion, the final state is the HTML.
- Ink surface: roles re-point, unchanged.

## Accessibility
Numbers are text in every row ("from → to"); the track and axis are `aria-hidden`.

## Used on
Pages: `/design/components/`, `/mirror-eval/`, `/writing/eval-harness-at-my-own-reflection/`.
