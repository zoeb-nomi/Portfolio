# DataTable

## Purpose
A booktabs table for numbers and ids: Heavy rule above and below, Ink under the head, Hair between rows. The winning cell is marked in red text.

## Anatomy
- Visible caption `<p>` (aria-hidden) above a focusable scroll region; the real `<caption>` is visually hidden.
- `<thead>` with column headers; first header labels the row-label column. Rows start with `<th scope="row">`.
- A "scroll" hint and a paper edge fade on the right while the table overflows.

## Props
| prop | type | notes |
|---|---|---|
| `caption` | `string` | also the region's `aria-label` |
| `columns` | `string[]` | first is the row-label header |
| `rows` | `Row[]` | `label`, `cells: {text, win?}[]` |
| `nowrap` | `boolean?` | keep each data cell on one line; wide tables scroll sideways. Default false |
| `stack` | `boolean?` | at 599px and below, restack into label/value rows instead of scrolling. Default true |

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-surface`, `-surface-raised`, `-accent-text` (winning cells).
- Type and space: `--font-data`, `--t-data`, `--t-label`, `--t-micro`, `--track-wide`, `--s-1` to `--s-12`.
- Lines: `--line-heavy`, `--line-ink`, `--line-hair`. Motion: `--dur-fast`, `--ease-draw`.

## States and motion
- Scroll cue: edge fade and hint are driven by the wrap's scroll position (`animation-timeline`, only where supported) and fade out at the far end. No motion verb applies; it is a scroll-linked opacity change.
- A small script makes the region a tab stop only while it actually scrolls.
- Stacked mode shows each cell's column name via `data-l`.
- Ink surface: roles re-point, unchanged.

## Accessibility
Real table semantics (`scope`, caption). The region is `role="region"` with a label and `tabindex="0"` while scrollable. The winning cell is marked by colour and weight only, so say it in the caption or copy as well.

## Used on
Pages: `/builds/`, `/crosssource/`, `/design/components/`, `/mirror-eval/`, `/screener-eval/`, `/writing/decisions-api-legal-quiz/`, `/writing/nobody-reports-the-misses/`, `/writing/the-bus-stop-nobody-notices/`.
