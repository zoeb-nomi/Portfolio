# ForestPlot

## Purpose
Each lever as a mean marker with its 95% interval on one shared axis, then the screener gap drawn on the same scale. Values are text first; the drawing is decoration.

## Anatomy
- Groups: a title, then one row per lever (label, track, "mean (lo to hi)" text) and a computed verdict line ("Both intervals include zero..." or "At least one interval stays on one side of zero.").
- Gap group ("The screener that read the résumé"): zero line, bar to the mean, marker at the largest value, value text and a note.
- A shared tick axis with an axis label. Track and axis are `aria-hidden`. Shared figure styles are in `src/styles/figures.css`.

## Props
| prop | type | notes |
|---|---|---|
| `groups` | `Group[]` | `title`, `rows` (`label`, `sub?`, `mean`, `lo`, `hi`) |
| `gap` | `Gap` | `label`, `sub`, `mean`, `max`, `note` |
| `min`, `max` | `number` | axis range |
| `ticks` | `number[]` | axis labels |
| `axisLabel` | `string` | |

## Tokens it reads
- Colour roles: `--color-text-muted`, `--color-accent` (gap bar and marker), `--color-accent-text`; intervals and markers use `--color-text` and `--color-surface` through `figures.css`.
- Type and space: `--font-data`, `--t-micro`, `--track-wide`, `--s-1`, `--s-3`, `--s-6`.
- Lines: `--line-pen`, `--line-ink`. Motion: `--dur-base`, `--dur-slow`, `--ease-draw`.

## States and motion
- Reveal: plays once at 35% in view (zero line, the intervals, then the screener bar and marker) from `data-state="pre"`; no controls of its own. Without script or with reduced motion the final state is the HTML.
- Ink surface: roles re-point.

## Accessibility
Every mean and interval is printed as text; verdicts are sentences, not colour. The drawing is `aria-hidden`.

## Used on
Pages: `/screener-eval/`, `/writing/two-levers-that-did-not-move/`.
