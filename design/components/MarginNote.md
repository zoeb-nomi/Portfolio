# MarginNote

## Purpose
A reviewer's annotation in the margin column. It never carries a fact that exists nowhere else.

## Anatomy
An `<aside>` (default) or `<div>` holding one `<p>` from the slot, with a pen-weight rule on its left edge. Pass `as="div"` when it would nest inside another `<aside>`.

## Props
| prop | type | notes |
|---|---|---|
| `label` | `string?` | `aria-label` for the aside; default "Reviewer's note". Ignored for `div` |
| `as` | `'aside' \| 'div'` | default `aside` |

## Tokens it reads
- Colour roles: `--color-accent-text` (note text).
- Type and space: `--font-data`, `--t-note`, `--lh-body`, `--s-3`, `--s-6`.
- Lines: `--line-pen` (left rule).

## States and motion
Static. No script, no reduced-motion rule needed. Ink surface: the role re-points to the glow.

## Accessibility
As an `<aside>` it is a labelled landmark; avoid nesting landmarks (use `as="div"`).

## Used on
Also via: `Section`, `TimelineEntry`.
Its callers are `Section` (the `note` prop) and `TimelineEntry` (the `note` prop).
