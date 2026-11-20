# StatRow

## Purpose
One readout in the kit's `.ro` grammar: a big whole number, what it counts, and where it comes from. Place several in a `.stats` row or a `.ros` grid.

## Anatomy
`div.ro.stat-row`: `p.v[data-num]` (the value, with an optional red `verdict` and a muted `sub`), `p.u` (the label) and an optional `p.s` (provenance, mono).

## Props
| prop | type | notes |
|---|---|---|
| `value` | `string` | the number, printed whole |
| `label` | `string` | what it counts |
| `verdict` | `string \| null` | a short word after the value (`aria-hidden`); default none |
| `sub` | `string \| null` | a small suffix on the value line; default none |
| `provenance` | `string \| null` | the source line; default none |

## Variants
With or without verdict, sub and provenance.

## Kit classes
`.ro`, `.v`, `.u`, `.s`, `.tabular`; the verdict is `--color-accent`, the sub is muted mono. Parent `.stats` or `.ros` sets the grid.

## Motion
`data-num`: the number appears whole (opacity and a 6px rise), never counted up. Reduced motion or no script shows it in place.

## Accessibility
Every part is text. The verdict is `aria-hidden`, so put anything essential in `label` or `provenance`.

## Light and dark
Roles only; the provenance is `--color-text-muted` on both grounds.

## Used on
`/writing/the-bus-stop-nobody-notices/`.
