# TextTable

## Purpose
A table of words, not numbers, in the kit's `.tbl` grammar. On wide screens it is the table (and may run past the reading column into the margin rail); on phones each row becomes a labelled card, so a prose cell never has to scroll sideways. A cell with `win` is the one red cell.

## Anatomy
`div.tbl-wrap.tt` with two views of the same data: `table.tbl.tt-table` (`caption`, head, rows whose first cell is `td.tt-label`) and `div.tt-cards` (the caption, then `ul.tt-list` of `li.tt-card`: `p.tt-kind` and a `dl.tt-fields` of column name and value). Only one view is shown at a time by CSS.

## Props
| prop | type | notes |
|---|---|---|
| `caption` | `string` | required |
| `columns` | `string[]` | the first entry is the row-label header |
| `rows` | `Row[]` | `label` and `cells: (string \| { text, win? })[]` |
| `wide` | `boolean` | run past the reading column into the margin rail; default `false` |

## Variants
Default and `wide` (the `tt--wide` class, the reading width plus 306px).

## Kit classes
`.tbl-wrap`, `.tbl`, `td.win`, `--line-hair` and `--line-heavy` rules. Own `tt-*` classes for the card view. For numbers use `DataTable`.

## Motion
None. Rows tint on hover (a kit rule). No script.

## Accessibility
The table is a real `table` with a caption. Phone cards are a list with a description list per card, so each value keeps its column name. Both views are in the DOM; the hidden one is `display: none`, so assistive tech reads one.

## Light and dark
Roles only; win cells use `--color-accent`. Both themes work unchanged.

## Used on
`/writing/the-bus-stop-nobody-notices/` and `/writing/nobody-reports-the-misses/`.
