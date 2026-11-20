# Section

## Purpose
One prose section of a long-form page: a heading carrying the red § mark, then the body. Consecutive Sections read as one article (a note or an essay built on this template); the red reading spine runs down their left edge and ends under the last one.

## Anatomy
`section.rs.gut[data-section] > .in > .rs-in`: optionally `.rs-head` (the `h2.rs-h` with `span.sec-no` and `span.label`, a mono `.rs-sub`, and an `aside` rail holding a `MarginNote` and the `margin` slot), then the default slot.

## Props
| prop | type | notes |
|---|---|---|
| `mark` | `string` | the § mark |
| `label` | `string` | heading text; empty renders no heading (an unlabelled opening, before section 1) |
| `note` | `string?` | a margin note beside the heading (rail at 1100px and up, under it below) |
| `sub` | `string?` | a small mono line under the heading |
| `as` | `'section' \| 'div'` | default `section` |
| `narrId`, `anchorId` | `string?` | read-along cue and explicit id; the id defaults to `sec-<slug>` |
| `wide` | `boolean` | children may use the full shell instead of the reading measure |
| `class` | `string?` | |
| `grid` | `boolean` | accepted for old call sites; ignored |

Slots: default and `margin`.

## Variants
Labelled, unlabelled, with or without a rail, `wide`.

## Kit classes
`.rs`, `.rs-h`, `.sec-no`, `.lab`, `.margin-note` (through `MarginNote`), `.gut`, `.in`. Layout in `src/styles/layout.css` and `reading.css`.

## Motion
None of its own. The spine (`scripts/reading.ts`, switched on by `Masthead` or `EssayShell`) grows with scroll and ticks at each `.rs-h`.

## Accessibility
Each section is a landmark-free `section` with an `h2` and a stable id; the mark is `aria-hidden`; the rail is a labelled `aside` ("Notes: <label>") and the nested note is a `div`.

## Light and dark
Roles only; the mark is `--color-accent`.

## Used on
`/notes/[slug]/` and `/writing/decisions-api-legal-quiz/`.
