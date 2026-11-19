# PullQuote

## Purpose
A single claim set large (Zoeb's voice, Archivo) under a rule. Used for the line a page wants remembered.

## Anatomy
A `<blockquote>`: an optional kicker in the margin column (mono, red text) and the quote in the body column. Without a kicker the quote stands alone, capped at 46ch.

## Props
| prop | type | notes |
|---|---|---|
| `kicker` | `string?` | margin-column label; also switches on the margin grid |
| `rule` | `'ink' \| 'red'` | top rule: Ink tier (default) or the Pen tier |
Slot: the quote text.

## Tokens it reads
- Colour roles: `--color-text` (quote), `--color-accent-text` (kicker).
- Type: `--font-heading`, `--font-data`, `--wght-head`, `--wdth-head`, `--t-quote`, `--t-label`, `--track-tight`, `--lh-label`.
- Space and lines: `--s-3`, `--s-6`, `--s-7`, `--line-ink`, `--line-pen`.

## States and motion
Static: no script, no animation. Reduced motion changes nothing. Ink surface: roles re-point. At 899px and below the margin column stacks above the quote.

## Accessibility
Real `<blockquote>`. The kicker is text, not a heading.

## Used on
Pages: `/builds/`, `/crosssource/`, `/design/components/`, `/mirror-eval/`, `/screener-eval/`, `/writing/eval-harness-at-my-own-reflection/`, `/writing/nobody-reports-the-misses/`, `/writing/the-bus-stop-nobody-notices/`, `/writing/the-judge-caught-a-bug/`.
