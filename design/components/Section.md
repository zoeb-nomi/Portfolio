# Section

## Purpose
A page section: the mark and label in the margin column, the body in the body column, closed by an Ink rule. A short pen-weight tick sits on the top rule at the margin column's x.

## Anatomy
- `tick` (`aria-hidden`, `data-tick`): the red mark on the top rule.
- Margin column: `<h2>` with the mark (mono, red text) and the label (Archivo); optional `sub` (a small line); the `margin` slot; optional `MarginNote` from `note`.
- Body column: optional `refLine` lead-in, the default slot, optional `next` link.
- `grid`: a faint drafting grid behind the section.

## Props
| prop | type | notes |
|---|---|---|
| `mark` | `string` | the section mark in the margin |
| `label` | `string` | heading text; its slug makes the id `sec-<slug>` unless `anchorId` is set |
| `note` | `string?` | rendered as a `MarginNote` |
| `sub` | `string?` | small line under the label, no rule |
| `as` | `'section' \| 'div'` | default `section` |
| `narrId` | `string?` | read-along `data-narr` on the heading |
| `anchorId` | `string?` | overrides the heading id |
| `refLine` | `{strong, text}?` | bold lead-in paragraph |
| `next` | `{label, href}?` | link that ends the section, with a down arrow |
| `grid` | `boolean?` | drafting grid; `/builds/` only |
| `class` | `string?` | |
Slots: default, `margin`.

## Tokens it reads
- Colour roles: `--color-text`, `-text-muted`, `-accent-text` (mark), `--color-link`.
- Type: `--font-heading`, `--font-data`, `--wght-head`, `--wdth-head`, `--t-h3`, `--t-small`, `--t-label`, `--track-tight`, `--lh-*`.
- Space and lines: `--s-1` to `--s-11`, `--gutter`, `--header-h`, `--hit-touch`, `--line-ink` (closing rule), `--line-pen` (tick). Grid: `--grid-ink`, `--grid-step`. Motion: `--dur-base`, `--ease-draw`.

## States and motion
- The tick grows when the section enters view (`data-tick`, with `animation-timeline: view()` on pages without the motion module, and `motion.ts` on pages with it; `src/styles/motion.css`). Final state is in CSS.
- Reduced motion: the tick is shown fully drawn. Ink surface: roles re-point.
- The next-link arrow nudges on hover.

## Accessibility
One `<h2>` per section with a stable id; the mark is `aria-hidden`. `MarginNote` sits in a `div` margin column, so its aside is not nested.

## Used on
Pages: `/about/`, `/builds/`, `/crosssource/`, `/design/`, `/design/components/`, `/mirror-eval/`, `/notes/[slug]/`, `/screener-eval/`, `/writing/`, `/writing/decisions-api-legal-quiz/`, `/writing/eval-harness-at-my-own-reflection/`, `/writing/nobody-reports-the-misses/`, `/writing/the-bus-stop-nobody-notices/`, `/writing/the-judge-caught-a-bug/`, `/writing/two-levers-that-did-not-move/`.
