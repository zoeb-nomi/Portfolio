# DataTable

## Purpose
A table of numbers in the kit's booktabs grammar (`.tbl`: a heavy rule top and bottom, a hairline under the head). It guesses which columns are numeric and sets them right-aligned in the mono face.

## Anatomy
`div.tbl-wrap.dt` (focusable, `role="region"`, labelled by the caption) > `table.tbl`: `caption`, a `thead` with column headers, and a `tbody` whose first cell per row is a `th scope="row"`. Cells carry `data-l` (the column header) for the stacked layout.

## Props
| prop | type | notes |
|---|---|---|
| `caption` | `string` | required; also the region's accessible name |
| `columns` | `string[]` | the first entry is the row-label header |
| `rows` | `Row[]` | `label` and `cells: { text, win? }[]`; `win` makes that cell the one red cell |
| `numeric` | `boolean[]?` | per data column override; default guessed from the cells (23, 0.894, 87 of 100, 83.2%, +0.07) |
| `stack` | `boolean` | at 599px and below, stack rows into label and value pairs instead of scrolling; default `false` |
| `totalRow` | `boolean` | set the last row heavier |
| `nowrap` | `boolean` | accepted for old call sites; ignored |

## Variants
Default (scrolls sideways inside its box on phones), `stack`, `totalRow`.

## Kit classes
`.tbl-wrap`, `.tbl`, `td.n`, `th.n`, `td.win`. Own `.dt`, `.dt--stack`, `.dt-total`.

## Motion
None. Rows tint with `--color-surface-raised` on hover (a kit rule). No script.

## Accessibility
A labelled, focusable scroll region so keyboard users can pan; real `caption`, `th scope` and `td`. In `stack` mode the thead is visually hidden, not removed, and each cell prints its column name from `data-l`.

## Light and dark
Roles only. Win cells use `--color-accent`; heavy rules use `--line-heavy`. Both themes work unchanged.

## Used on
`/writing/decisions-api-legal-quiz/`. For tables of words use `TextTable`.
