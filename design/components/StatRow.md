# StatRow

## Purpose
One headline number on its own row, with its label and provenance: a reading in plain text.

## Anatomy
Two paragraphs: the figure (value in Archivo with an optional verdict word in red text and an optional sub line, tabular numerals) and the label (with optional provenance in the same line). Rows are separated by a Hair rule; the first has none.

## Props
| prop | type | notes |
|---|---|---|
| `value` | `string` | the numeral |
| `verdict` | `string \| null?` | red-text word beside it; `aria-hidden` |
| `sub` | `string \| null?` | small line within the figure |
| `label` | `string` | what the number is |
| `provenance` | `string \| null?` | datum, n and source, appended to the label |

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `--color-line-strong` (hover), `--color-accent-text` (verdict).
- Type: `--font-heading`, `--font-text`, `--font-data`, `--wght-head`, `--wdth-head`, `--track-tight`, `--track-normal`, `--t-stat`, `--t-quote`, `--t-small`, `--t-label-lg`, `--lh-snug`.
- Space and lines: `--s-1` to `--s-9`, `--line-hair`. Motion: `--dur-fast`, `--ease-draw`.

## States and motion
On hover-capable devices the row's top rule darkens to `--color-line-strong`. No tally or script in the component. The global reduced-motion rule in `src/styles/base.css` removes the transition. Ink surface: roles re-point. Stacks at 899px and below.

## Accessibility
The verdict is `aria-hidden`, so the label or provenance must say the outcome in words.

## Used on
Pages: `/writing/the-bus-stop-nobody-notices/`.
