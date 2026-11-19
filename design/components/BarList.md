# BarList

## Purpose
Horizontal bars for a short list of values on one scale. The numbers are real text in a list;
the bar is decoration. An optional note is a reviewer's annotation on that row.

## Anatomy
Optional `heading`, then a list. Each row: label, track with bar (`aria-hidden`), value text, optional note.

## Props
| prop | type | notes |
|---|---|---|
| `rows` | `Row[]` | `label`, `value`, `text` (the printed value), optional `note` |
| `max` | `number` | the value that fills the whole track |
| `heading` | `string?` | optional |

## Tokens it reads
- Colour roles: `--color-text`, `--color-text-muted`, `--color-accent-text` (note).
- Type and space: `--font-data`, `--t-micro`, `--t-data`, `--track-wide`, `--s-1`, `--s-3`, `--s-4`, `--s-6`.
- Other: `--line-object`.

## States and motion
Static: no motion of its own and no script. Reduced motion changes nothing. On the ink surface the roles re-point and it works unchanged.

## Accessibility
Real `<ul>`; the value is text in each row, so the bar can be `aria-hidden`.

## Used on
Pages: `/writing/nobody-reports-the-misses/`.
