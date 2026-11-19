# EssayFigure

## Purpose
The frame for any figure in an essay or case study: a caption with "Fig. N" and a title above, the body in a slot, a source line below.

## Anatomy
`<figure>` with a `<figcaption>` (number in red text, title, optional Replay button), `.ef-body` slot, and an optional `.ef-source` line with an optional link.

## Props
| prop | type | notes |
|---|---|---|
| `n` | `number` | figure number |
| `title` | `string` | |
| `source` | `string?` | where the numbers come from, in words |
| `href`, `hrefLabel` | `string?` | link after the source |
| `replay` | `boolean?` | show a Replay button when the figure animates (revealed by `figure-motion.ts` only when motion is allowed). Default false |

## Tokens it reads
- Colour roles: `--color-text-muted`, `--color-accent-text` ("Fig. N"), `--color-link` (source link).
- Type and space: `--font-text`, `--font-data`, `--t-note`, `--t-label`, `--lh-snug`, `--lh-label`, `--measure`, `--s-1` to `--s-8`, `--hit-min`, `--underline-offset`, `--line-hair`.

## States and motion
The frame is static. The Replay button is `hidden` until the script shows it; reduced motion keeps it hidden. Ink surface: roles re-point.

## Accessibility
Semantic `<figure>`/`<figcaption>`. Replay is a real button with a `--hit-min` target.

## Used on
Pages: `/crosssource/`, `/mirror-eval/`, `/notes/[slug]/`, `/screener-eval/`, `/writing/decisions-api-legal-quiz/`, `/writing/eval-harness-at-my-own-reflection/`, `/writing/nobody-reports-the-misses/`, `/writing/the-judge-caught-a-bug/`, `/writing/two-levers-that-did-not-move/`.
