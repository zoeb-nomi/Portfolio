# MarginNote

## Purpose
A margin note (kit `.margin-note`): a red hairline, mono text, beside the paragraph it annotates. It never carries a fact that exists nowhere else.

## Anatomy
`<aside class="margin-note" aria-label>` (or a `div` when nested), an optional bold mono title, then the slot. Put it inside the `aside` of an `.article` row: it sits in the rail at 1100px and up and drops under its paragraph below that.

## Props
| prop | type | notes |
|---|---|---|
| `label` | `string` | accessible name of the aside; default "Margin note" |
| `as` | `'aside' \| 'div'` | default `aside`; use `div` inside another aside (Section's rail) |
| `title` | `string?` | a short mono heading ("The run") |

## Variants
`as="aside"` and `as="div"`.

## Kit classes
`.margin-note`, laid out by `.article` and its `aside` (`ds.css` §12).

## Motion
None.

## Accessibility
As an `aside` it is a landmark with an `aria-label`; nested it is a plain `div` so landmarks do not stack. The kit hides the rail under 1100px, but on reading pages (`src/styles/reading.css`) the note stays and sits under its paragraph, so phones still get it.

## Light and dark
Roles only: `--line-accent` rule and `--color-text-muted` text. Both themes work.

## Used on
`Section` (its `note` prop and `margin` slot) and `/writing/decisions-api-legal-quiz/`.
