# TradeFrameFlow

## Purpose
"Who decides what runs": TradeFrame's decision path. A dashed node proposes only; a solid node decides.

## Anatomy
- `full`: a `<figure>` with caption, four numbered steps (propose, validate, confirm in the two books, execute and record), the base nodes (kill switch, ledger), a step-label line (`aria-hidden`) and a Replay button.
- `strip`: one line of the four step labels (the first is the dashed proposing step), with an optional Replay button.
- Every label is printed in the HTML; text comes from `builds.tradeframeFlow` in `src/data/copy.ts`.

## Props
| prop | type | notes |
|---|---|---|
| `variant` | `'full' \| 'strip'` | default `full` |
| `id` | `string?` | element id; Replay uses it for `aria-controls`. Default `tf-flow` |
| `replay` | `boolean?` | strip only: render its own Replay button (false inside a `<summary>`, where the row panel carries it). Default true |

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-surface`, `-accent-text`, `--color-accent-tint` (a lit step).
- Type: `--font-data`, `--t-label`, `--t-small`, `--lh-snug`.
- Space and lines: `--s-1` to `--s-5`, `--line-object`, `--line-propose` (dashed), `--line-heavy`, `--hit-touch`, `--underline-offset`. Motion: `--dur-base`, `--ease-draw`.

## States and motion
- Reveal: once at 60% in view, `motion.ts` lights the path step by step (propose, validate, confirm, execute and record), then clears. Replay plays it again; the button is `hidden` until script runs.
- A lit node takes the `--color-accent-tint` wash and its index and label turn red text.
- Without script or with reduced motion nothing is lit and all labels are readable.
- Ink surface: roles re-point (the tint becomes the glow wash).

## Accessibility
The figure is labelled by its caption; step numbers and arrows are `aria-hidden`; Replay has `aria-controls`.

## Used on
Also via: `BuildsLedger`.
