# BuildsLedger

## Purpose
The Builds page list: one row per build, each a button that opens its panel in place. A row is the kit's `.build` (name, kind, headline value, a plus that turns to a cross). The panel holds a one-line description, the guard / measure / ship chain, a small figure and the links.

## Anatomy
`ol.bd-list[data-ledger] > li.bd-item#b-<id>`: `button.build.bd-row` (`aria-expanded`, `aria-controls`) and `div.bd-detail[role=region]`. Detail: `.bd-what`, optionally `TradeFrameFlow` (when `figure.kind === 'flow'`), `.bd-chain` (three `.bd-node`: guard, measured, shipped), a `figure.bd-fig` (bars or dumbbells) and `.bd-links` of `.tl` links.

## Props
| prop | type | notes |
|---|---|---|
| `entries` | `BuildEntry[]` | default `buildsLedger` from `copy.ts` |
| `openFirst` | `boolean` | open the first row on load; default `false` |

Headline values and figures come from `pipelineBuilds.rows[id]`. A `kind: 'agent'` row needs `guarded`, `measured.scorerCheck`, a repo and a case study.

## Variants
Open or closed per row (`.open`). The `eval harness` kind prints its tag next to the label.

## Kit classes
`.build` (`.bn`, `.bk2`, `.bv`, `.ba`), `.blist` grammar, `.lab.red`, `.tl`, `.fno`-style figure caption. Own `bd-*` classes for the panel.

## Motion
All panels are in the HTML: without script every panel is open and the page is complete. The open and close motion and the plus-to-cross sit in the page script (`src/pages/builds.astro`), not here. Hover and focus widen the name (variable font) and nudge the arrow, as on every `.build`.

## Accessibility
Each row is a real button with `aria-expanded`/`aria-controls`; the panel is a labelled region. Every figure value is text. External links open in a new tab with `rel="noopener noreferrer"` and show a small arrow.

## Light and dark
Roles only; the chain nodes use `--line-pen` rules and the accent for the "after" marks. Both themes work unchanged.

## Used on
`/builds/`. Renders `TradeFrameFlow`.
