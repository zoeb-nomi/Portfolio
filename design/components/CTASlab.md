# CTASlab

## Purpose
The closing call to action at the foot of an essay or note: a kicker, a heading, one red button and text links. The name is kept from the old slab; it is now a plain kit section.

## Anatomy
`section.sec.gut[data-cta] > .in`: `p.kick`, `h2.h2`, `.ctas` row (one primary `Button`, an optional link `Button`, then `links`), and an optional mono `.lab` note under the row.

## Props
| prop | type | notes |
|---|---|---|
| `body` | `string` | the heading text |
| `buttonLabel`, `buttonHref` | `string` | the one red button |
| `secondaryLabel`, `secondaryHref` | `string?` | a text link after it |
| `links` | `{label, href}[]` | more text links (LinkedIn, GitHub, X); default none |
| `kicker` | `string?` | label above the heading; default `pipelineWriting.contact.kick` |
| `buttonNote` | `string \| null` | mono line under the row; default is "30 min · intro call" when the button is Book a call, else none |
| `marginLines` | `string[]?` | accepted for old call sites, not drawn |

## Variants
None. Red appears once, on the button.

## Kit classes
`.sec`, `.gut`, `.in`, `.kick`, `.h2`, `.ctas`, `.lab`, `.btn`, `.tl` (via `Button`).

## Motion
None of its own; the `.h2` is a normal heading. No script.

## Accessibility
Semantic section with an `h2`; all controls are native links through `Button`. External links open in a new tab with `rel`.

## Light and dark
Roles only; both themes work unchanged.

## Used on
`/writing/`, `/notes/[slug]/`, and the essays `decisions-api-legal-quiz`, `eval-harness-at-my-own-reflection`, `two-levers-that-did-not-move`, `nobody-reports-the-misses`, `the-judge-caught-a-bug`.
