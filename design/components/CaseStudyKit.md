# CaseStudyKit (the `Cs*` family)

One page for the twelve small components the three case-study pages share (`/crosssource/`, `/mirror-eval/`, `/screener-eval/`). Keep their output identical across the three pages; the styles are the `.cs-` template in `src/styles/case-study.css` (imported by those pages only). `CaseTabs` is documented on its own page.

## Purpose
Each case study is the same template: tabs, a head with a finding and a spec strip, numbered sections, figures, a method strip, limits and rules, link rows and a closing contact. The `Cs*` components hold that template so a page contains only its own copy and figures.

## Components
| component | what it is | props | kit classes it renders |
|---|---|---|---|
| `CsHead` | page head: kicker, h1, the finding sentence, optional readouts, the HUD spec strip, a `find` slot under the finding and a default slot under the HUD (the audio player) | `kick`, `h1`, `find: Part[]`, `stats?: {v,u,s}[]`, `hud: {label, v, small?, red?}[]` | `.page-head`, `.kick`, `.display.split`, `.stats > .ro` (a before → after value gets a red `.ar2`), `.hud` |
| `CsSection` | a section: kicker and h2 left, an optional dek right (`dek` slot), then the body | `id`, `kick`, `h2`, `wide?` (the dek carries a whole paragraph) | `.sec`, `.kick`, `.h2.split` |
| `CsFig` | the figure shell: a header (number and title, plus a `top` slot for controls), a body, a two-part foot | `no`, `title`, `foot?: string[]`, `id?`, `gap?` | `.fno`, `figure.cs-fig` |
| `CsLegend` | a key of squares and labels | `items: {k, t}[]`, `below?` (a block key under a figure instead of the header chip) | `.cs-legend` |
| `CsTable` | a booktabs table, the first `textCols` columns text and the rest numeric | `caption`, `columns`, `rows: {cells, win?}[]`, `textCols?` (default 1) | `.tbl-wrap`, `.tbl`, `td.n`, `td.win` |
| `CsStrip` | the method strip: numbered stages joined by arrows, one packet running along a rail | `steps: {h, t, m}[]` (`m` are the bold marks inside `t`) | `.cs-strip`, `data-reveal` |
| `CsSpecList` | the method in full: every term and its sentence in a spec grid | `items: {dt, parts}[]`, `label` | `dl.cs-spec-list`, `data-stagger` |
| `CsList` | numbered limits (two columns) or rules (large type) | `kind: 'lim' \| 'rules'`, `items: Part[][]` | `ol.cs-lim`, `ol.cs-rules`, `data-stagger` |
| `CsCall` | the finding callout: a red rule, a red label and the finding | `label`, `long?` | `.cs-call`, `.lab.red`, `data-reveal` |
| `CsLinks` | link rows (name, kind, value, arrow); external rows open in a new tab | `links: {bn, bk, bv, href}[]`, `sub?` | `ol.blist`, `a.build` (`.bn`, `.bk2`, `.bv`, `.ba`), `data-stagger` |
| `CsContact` | the closing contact block: kicker, heading, a red Email button and text links | none (copy from `home` and `cta`) | `.sec`, `.kick`, `.h2`, `.ctas`, `.btn`, `.tl` |
| `CsParts` | inline text runs: plain, bold or code | `parts: Part[]` | `<b>`, `<code>` |

`Part` is `{ text?, b?, code? }` from `src/lib/caseStudy.ts`. `rich(text, marks)` builds parts from a sentence and the phrases to bold; a missing phrase fails the build, so the page and its copy cannot drift. All visible strings come from `crosssource`, `mirrorEval`, `screenerEval` and `pipelineCaseStudies` in `copy.ts`.

## Variants
`CsSection` `wide`; `CsFig` `gap`; `CsLegend` `below`; `CsLinks` `sub`; `CsList` `lim` and `rules`; `CsCall` `long`; `CsHead` with or without `stats`.

## Motion
Quiet: `data-reveal` blocks fade up 8 to 10px once; `data-stagger` children fade up in sequence; the h1 and h2 use `.split` (one fade). Numbers appear whole (`data-num`), never counted. `CsStrip` adds one 7px red packet that runs along its rail on a loop; under reduced motion the packet is hidden and the strip is complete without it. Nothing is added by `CsParts`, `CsTable` or `CsLegend`.

## Accessibility
Real headings and lists throughout (`ol` for numbered limits and the strip, `dl` for the spec). `CsTable` has a caption and header cells. `CsStrip` stages are focusable (`tabindex="0"`) so the horizontal strip can be read by keyboard. `CsLinks` external rows use `rel="noopener noreferrer"`. The HUD spec strip is readable as text; a finding that matters is in `CsCall`, not in colour alone.

## Light and dark
Roles only; red (`--color-accent`) marks the finding label, the packet and the after value. The strip scrolls sideways on narrow screens in both themes.

## Used on
`/crosssource/`, `/mirror-eval/`, `/screener-eval/` (all twelve; `CsFig` is used by `/crosssource/` and `/mirror-eval/` only). `CsParts` is also used inside `CsHead`, `CsStrip`, `CsList` and `CsSpecList`.
