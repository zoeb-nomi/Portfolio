# BarList

## Purpose
Horizontal bars for a short list of values on one scale. Each row is "label, bar, value" in a real list, so the numbers are text first and the bar is decoration. An optional note annotates a row.

## Anatomy
Optional `.bl-heading` (mono label), then `ul.bl-list`. Each `li.bl-row`: label, `.bl-track` with `.bl-fill` (`aria-hidden`), `.bl-value`, optional `.bl-note` under the bar.

## Props
| prop | type | notes |
|---|---|---|
| `rows` | `Row[]` | `label`, `value` (number), `text` (the printed value), optional `note`, optional `tone` (`'ink'` default, `'red'`) |
| `max` | `number` | the value that fills the whole track; fills are clamped to 100% |
| `heading` | `string?` | small caps label above the list |

## Variants
`tone: 'red'` fills that row's bar with the accent: a failure or the series under test. Red once per list.

## Kit classes
`.lab`-style heading (own `.bl-heading`), `.tabular`. The component carries its own scoped CSS for the grid.

## Motion
None: no script, no transition. Reduced motion changes nothing.

## Accessibility
A real `<ul>`; every value is visible text so the bar can be `aria-hidden`. Under 599px the row stacks: label and value on one line, the bar full width below.

## Light and dark
Roles only: ink fill on `--color-surface-sunk` track with a `--line-strong` outline; red rows use `--color-accent`. Reads in both themes unchanged.

## Used on
`/writing/nobody-reports-the-misses/`.
