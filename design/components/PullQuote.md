# PullQuote

## Purpose
A pull quote: the kit's prose blockquote (red rule, medium weight), set a little larger than the text, with an optional small red mono label above.

## Anatomy
`blockquote.pq`: optional `p.pq-kick.lab.red`, then `p.pq-text` (the slot).

## Props
| prop | type | notes |
|---|---|---|
| `kicker` | `string?` | the mono label above |
| `rule` | `'ink' \| 'red'` | accepted for old call sites and ignored: the rule is always the red line |

## Variants
None.

## Kit classes
`.lab.red` for the kicker; the rule reads `--line-pen` (the red line) and the text `--color-text`, `--t-quote`, a 92 width and 520 weight.

## Motion
None.

## Accessibility
A real `blockquote`; the kicker is text, not decoration. Text wraps balanced.

## Light and dark
Roles only; the red rule is the theme's accent.

## Used on
Not imported by any page or component at the time of writing (only mentioned by copy and a lint script).
