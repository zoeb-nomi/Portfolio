# EssayHeading

## Purpose
A numbered section heading inside an essay: "§1" in red mono, then the title. It is the lighter sibling of `Section`, used when the essay lays out its own sections inside `EssayShell`.

## Anatomy
`h2.rs-h` with `id` (the deep link), `data-narr` (the read-along cue), `span.sec-no` (the mark, `aria-hidden`) and `span.label`.

## Props
| prop | type | notes |
|---|---|---|
| `mark` | `string` | the § mark |
| `label` | `string` | the heading text |
| `anchorId` | `string?` | explicit id; default derived from the label by `sectionId()` |
| `narrId` | `string?` | the narration cue id (`sN-cue`), for pages with audio |

## Variants
None.

## Kit classes
`.rs-h`, `.sec-no` (red mono mark, `ds.css` prose rule), the reading styles in `src/styles/reading.css`. The reading script (`scripts/reading.ts`) finds `.rs-h` to place tick marks on the red spine.

## Motion
None. The spine and its ticks are drawn by the reading script, not this component.

## Accessibility
A real `h2` with a stable id for links; the mark is hidden from assistive tech so the heading reads as its label alone.

## Light and dark
Roles only; the mark uses `--color-accent` (deeper red on paper).

## Used on
`eval-harness-at-my-own-reflection`, `the-judge-caught-a-bug`, `nobody-reports-the-misses`, `two-levers-that-did-not-move`, `the-bus-stop-nobody-notices`.
