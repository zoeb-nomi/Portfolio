# CTASlab

## Purpose
The closing call to action: an ink-surface slab, edge to edge, with a margin note and one claim-sized sentence.

## Anatomy
- `.cta-slab.surface-ink.bleed` with a margin-column grid.
- Margin column: `marginLines`, one `<p>` each.
- Body column: the body sentence (Archivo, `--t-slab`), a primary `Button`, an optional `inverse` Button, and an optional mono note under them.

## Props
| prop | type | notes |
|---|---|---|
| `marginLines` | `string[]` | margin column lines |
| `body` | `string` | the sentence |
| `buttonLabel`, `buttonHref` | `string` | primary action |
| `secondaryLabel`, `secondaryHref` | `string?` | both needed for the second button |
| `buttonNote` | `string \| null?` | mono line; default is `cta.bookACallNote` when the href is Book a call, else none |

## Tokens it reads
- Colour roles: `--color-text`, `--color-text-muted` (resolved on the ink surface).
- Type and space: `--font-heading`, `--font-data`, `--wght-head`, `--wdth-head`, `--t-slab`, `--t-label`, `--lh-heading`, `--lh-label`, `--track-wide`, `--s-2`, `--s-4`, `--s-6`, `--s-7`.

## States and motion
Static; the buttons carry their own hover. Breakpoints 899 and 599 restack the grid. Reduced motion changes nothing. It is the ink surface by construction.

## Accessibility
Plain paragraphs and links; the primary Button and the inverse Button are both real anchors with 44px targets.

## Used on
Pages: `/about/`, `/builds/`, `/crosssource/`, `/mirror-eval/`, `/screener-eval/`, `/writing/decisions-api-legal-quiz/`, `/writing/eval-harness-at-my-own-reflection/`, `/writing/nobody-reports-the-misses/`, `/writing/the-judge-caught-a-bug/`, `/writing/two-levers-that-did-not-move/`.
