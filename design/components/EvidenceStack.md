# EvidenceStack

## Purpose
One sheet per search engine, 63 squares per sheet (the probes): which answers cited the site or repo in Wave 1, which Wave 2 added, which it lost.

## Anatomy
- Stage (`aria-hidden`): tilted stack of sheets, each a 9-column grid of cells plus an upright label ("name from → to").
- Legend list (`<ul>`): every engine's numbers as text.
- Key (`aria-hidden`): cited in the first wave, new in the second, no owned citation.
- Cell kinds: base (dark), add (red fill), lost (dashed outline), none (empty).

## Props
| prop | type | notes |
|---|---|---|
| `engines` | `Engine[]` | `label`, `from`, `to` |
| `of` | `number` | cells per sheet |
| `fromLabel`, `toLabel` | `string` | key text |

## Tokens it reads
- Colour roles: `--color-text`, `-text-muted`, `-surface`, `-accent` (added squares).
- Type and space: `--font-data`, `--t-micro`, `--t-note`, `--lh-snug`, `--s-1` to `--s-6`.
- Lines: `--line-object`, `--line-object-muted`, `--line-hair`, `--line-pen-dashed`. Motion: `--dur-base`, `--ease-draw`.

## States and motion
- Reveal: starts at `data-state="pre"` and plays once at 35% in view: sheets slide apart, base squares fill, then added squares fill in red.
- On hover-capable pointers, a small tilt follows the pointer and the labels counter-rotate; the script does this only when motion is allowed.
- Reduced motion: no perspective, no tilt, sheets lie flat in a two-column grid with the final fills.
- Ink surface: roles re-point, unchanged.

## Accessibility
The drawing is `aria-hidden`; the legend list carries every number.

## Used on
Pages: `/mirror-eval/`.
