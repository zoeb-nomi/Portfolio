# zoebnomi.com design system: The Red Pen v3

This is the one place the design system lives. `design/tokens.css` holds every value;
this page holds the rules; `design/components/` has one page per component;
`design/mocks/` keeps the approved mocks and the dated before/after shots. hq and Notion
point here and copy nothing. v3 is Hybrid 1 (12 Nov 2026): Take A's bones (DESIGN_V3
D-01 to D-18, I-01 to I-10), Take B's story (Fig. 0, readings, back-references), and a
motion layer on top.

## 1. Principles

1. **Paper, ink, one red.** Red is the editor's pen. It marks only what an editor marks:
   verdicts (`[judged]`, a ✓), § and Fig. numbers, links and the one action. Never a
   heading, body text or a numeral.
2. **A ledger, not a brochure.** Records open and close the same way (booktabs). Rules
   run horizontally. Boxes go only around objects (buttons, diagram nodes, the memo in
   Fig. 0, the audio player), never around text.
3. **Every number is a reading.** Value, datum (what it is measured from), change, n and
   source. Hollow = before, filled = after.
4. **The page tells one argument.** Home is Fig. 0 expanded: each section says which step
   of Fig. 0 it proves ("Fig. 0, step n"), ends with a "Next:" line, and the page closes on
   "Back to Fig. 0".
5. **Motion explains, then gets out of the way.** The HTML is the final state. Motion
   never hides content from someone who has no script, a slow script or reduced motion.

## 2. Colour tokens (meaning, not just value)

Values live only in `design/tokens.css`; this table says what each colour means.

| token | means | never |
|---|---|---|
| `--paper` | the page | |
| `--paper-raised` | an object's fill (the memo in Fig. 0, code) | a card around text |
| `--ink` | headings, numerals, Ink and Heavy rules | |
| `--ink-body` | running text | |
| `--ink-muted` | labels, captions, sources | body copy |
| `--rule` | Hair rules, empty tracks | text |
| `--red` / `--red-ink` | the pen: action, verdict, § and Fig. marks, links (`--red-ink` for text) | headings, numerals, lateness |
| `--red-tint` | highlight behind a sentence; a lit step in a figure | |
| `--grid-ink` | the drafting grid, behind the hero and the Builds ledger only | site-wide texture |
| `--heat-0..4` | the contribution heatmap only | |

No dark mode in v3 (D-18). No green, blue or amber; state is never colour alone.

## 3. The four line tiers (horizontals only)

| tier | token | spec | use | never |
|---|---|---|---|---|
| Hair | `--line-hair` | 1px rule | rows inside a block | block boundaries |
| Ink | `--line-ink` | 1px ink | block boundaries: header, section, table head | rows |
| Heavy | `--line-heavy` | 2px ink | opens and closes a table, ledger or list of record; the top bar of a tile, step, figure | sections |
| Pen | `--line-pen` | 2px red | margin note, pull quote, the stamp | anything structural |

Objects use `--line-object` (1px ink box), `--line-object-muted` and `--line-propose`
(1px dashed: "proposes only" in a diagram). One rule per boundary: a Heavy rule that
closes a ledger replaces the Hair under its last row. The one exception is the H1
underline under "quietly." (0.03em, the pen at display scale). `lint-source` rejects raw
border widths and vertical structural rules outside figure and object components.

## 4. Type

Instrument Serif (display), IBM Plex Sans (body), IBM Plex Mono (labels and data). Weights
400/500 only, self-hosted. Floor 12px everywhere.

| role | token | 390 → 1440 | face |
|---|---|---|---|
| home H1 line 1 | `--t-display` | 56 → 136 | serif, -0.025em |
| home H1 line 2 | `--t-answer` | 28 → 50 | serif italic |
| page H1 | `--t-page` | 42 → 74 | serif |
| tile numeral | `--t-stat` | 56 → 84 | serif |
| H2 | `--t-h2` | 30 → 46 | serif |
| ledger numeral | `--t-num` | 30 → 38 | serif |
| H3 / row name | `--t-h3` | 24 → 30 | serif |
| quote / CTA | `--t-quote` / `--t-slab` | 22–28 / 28–40 | serif |
| body | `--t-body` | 16 → 17.5 | sans |
| small | `--t-small` | 15 | sans |
| data | `--t-data` | 13 | mono |
| nav, buttons | `--t-nav` | 12.5 | mono caps .12em |
| label, caption | `--t-label` | 12 | mono caps .12em |

Numbers inside sentences are sans 500 with tabular figures; mono is for data cells, labels
and sources only.

## 5. Space and grid

4px scale `--s-1`…`--s-13`. Shell 1200px, no side edges. Margin column 240px (200 at
≤1099), gutters 44/28/20, body inset 40. Breakpoints 599 / 899 / 1099 only. Sections pad
40px on desktop; on phones the margin column is a bare "§n LABEL" with no rule under it.
Prose stops at 60ch; ledgers, tables and tiles use the full body width. Tables stack into
label/value rows at ≤599px instead of scrolling (D-14).

## 6. Figure grammar

- A figure opens with a Heavy rule and a caption: **Fig. n** (or **Table n.**) in red-ink
  mono caps, then the title in mono. Source line under it, in words.
- Hollow square = before (datum). Filled square = after (value). A 2px ink line joins them.
- A zoomed axis says "axis zoomed". A range datum is a light band.
- Agreement is drawn as ink bars; the only red is the verdict tag at the row end.
- Dashed node = proposes only; solid node = decides.
- Figures are HTML and hairlines (labels stay ≥12px). SVG only for marks and icons.

## 7. Motion

**Library: anime.js v4** (MIT), modular imports only (`animejs/animation`, `/timeline`,
`/utils`). Chosen over Motion (motion.dev, about 23 KB gzipped for `animate` + `inView`
with JS-value tweens) and GSAP 3 + ScrollTrigger (about 45 KB): anime's documented API
covers DOM, SVG stroke and plain-object count-ups plus timelines at about 15 KB gzipped
(17.2 KB with our layer, `src/scripts/motion.ts`). Loaded only by pages that render
`<Motion />` (Base `motion` prop): home, /builds/, the three case studies, /writing/.

Rules:
1. The final state is in the HTML. Pre-reveal states live in `src/styles/motion.css` under
   `.motion`, which the head script sets only when JS runs, IntersectionObserver exists
   and reduced motion is off, and removes again if the module has not booted in 4 s.
2. The H1 text never animates. Only its underline draws.
3. No layout shift: transforms, clip-path wipes, stroke offsets and opacity only.
   Numbers never tween: a numeral always shows its final value (no intermediate, wrong
   values on screen); only lines, bars and marks animate.
4. Text is revealed with clip-path wipes, not fades, where it is above the fold (Fig. 0), so
   no frame ever renders text at a failing contrast.
5. Durations: fast 120, base 200, slow 600 (line draws), Fig. 0 story 3.2 s.

| element | motion | trigger |
|---|---|---|
| Fig. 0 | steps wipe in, stems grow, the red cloud draws, "Released" stamps at 3.2 s; Replay | load |
| H1 underline | draws left to right | load |
| Readings | the dimension line draws from the datum; the numeral is final from the start (numbers never tween) | 50% in view |
| Ledger rows | settle 10px, 70 ms apart; click, tap or Enter opens the panel (native details) and draws its figure | in view / click |
| TradeFrame path | lights propose → validate → confirm → execute and record, then clears; Replay | 60% in view |
| Case-study Fig. 1, Fig. 2 | bars and dumbbells draw | 60% in view |
| Section ticks | the red tick grows on the top rule | in view (CSS scroll-driven on pages without the library) |
| Pages | native cross-document view transitions; header holds still; eval switcher marker slides | navigation |

## 8. Component catalogue

One page each in `design/components/` (props, variants, pages, screenshot). New in v3:
**Fig0, Readings, BuildsLedger (full / compact / feature), TradeFrameFlow (full / strip),
MiniFigure, StatTiles, Motion, Moved**. Changed: SiteHeader, SiteFooter, Section,
Masthead (breadcrumb, case-study fold), CTASlab, Headshot, DataTable (booktabs, stacking),
TimelineEntry, PullQuote, EvalsSwitcher, PlayerStepper, ReadAlongDemo, RecordList.
Unchanged figure and media components: AudioPlayer, BarList, Button, CareerTimeline,
ContributionGraph, Dumbbell, EssayFigure, EvidenceStack, FailureOwners, ForestPlot,
MarginNote, OwnershipGap, ParserCompare, StatRow, UnitChart, VideoEmbed. Removed in v3:
MobileNav, HarnessLedger, ProofStrip, EmbedCard, EssayThumb, Figure, employer logos.

| | | |
|---|---|---|
| ![Fig0](mocks/2026-11-12-v3/components/Fig0.jpg) Fig0 | ![Readings](mocks/2026-11-12-v3/components/Readings.jpg) Readings | ![BuildsLedger](mocks/2026-11-12-v3/components/BuildsLedger-compact.jpg) BuildsLedger |
| ![TradeFrameFlow](mocks/2026-11-12-v3/components/TradeFrameFlow.jpg) TradeFrameFlow | ![MiniFigure](mocks/2026-11-12-v3/components/MiniFigure.jpg) MiniFigure | ![StatTiles](mocks/2026-11-12-v3/components/StatTiles.jpg) StatTiles |
| ![SiteHeader](mocks/2026-11-12-v3/components/SiteHeader.jpg) SiteHeader | ![Section](mocks/2026-11-12-v3/components/Section.jpg) Section | ![CTASlab](mocks/2026-11-12-v3/components/CTASlab.jpg) CTASlab |

## 9. Do and don't

| do | don't |
|---|---|
| Put a number next to its datum, n and source | Leave a headline number alone |
| Close every record with a Heavy rule | Draw a vertical rule or a box around text |
| Use red for a verdict, a § mark or the action | Colour lateness, headings or numerals red |
| Stack a table into label/value rows on phones | Make a phone reader scroll sideways |
| Write copy in `src/data/copy.ts` | Type a string into an `.astro` file |
| Use a colon or comma | Use an em dash (the geo-gate fails the build) |
| Reveal with a wipe or a draw, from the final state | Hide content until a script runs |
| One portrait, greyscale, multiplied into the paper | Frames, shadows, employer logos |

## 10. Adding a component

1. Check the catalogue first; extend a variant before adding a component for one page.
2. Write it in `src/components/`, with a header comment saying what it is, its variants and
   its motion (the component page is generated from that comment and the Props interface).
3. Values only from `design/tokens.css`; lines only from the four tiers; copy from
   `copy.ts`. Animated parts: final state in CSS, pre-state under `.motion` in
   `src/styles/motion.css`, behaviour in `src/scripts/motion.ts`.
4. Add `design/components/<Name>.md` and a screenshot in `design/mocks/<date>/components/`.
5. Run `npm run check` (astro check + design-check), `lint`, `gate`, `a11y`, `links`, `lhci`.

## 11. Page patterns (from v2, still current)

**Essay** (`src/pages/writing/<slug>.astro`): copy as `writing<Name>` + `meta.writing<Name>`
in `copy.ts`; Masthead with `narr`, byline, optional AudioPlayer, intro paragraphs
(`data-narr="s0-pK"`), Sections (`narrId="sN-cue"`), figures after chosen paragraphs, the
CTA slab (off-topic essays end on "More writing →" instead). Register it in eight places:
copy, page, the `essays` list and `writingIndex.numbers` in `src/pages/writing/index.astro`
/ `copy.ts`, `src/pages/llms.txt.ts`, `src/data/lastmod.json`, an `ogCards` entry (then
`npm run og`), checks, and narration via `scripts/audio/pages.json` if it has audio.

**Note**: an entry in `src/data/notes.ts` with a `group` (tradeframe, cheap-tier,
decisions-api, crosssource, screener-eval, mirror-eval, other); it appears on
`/writing/#notes` under its group.

**Build**: a `buildsLedger` row in `copy.ts` (SPEC v3 §3a). `kind: 'agent'` requires
`guarded`, `measured.scorerCheck`, a repo and a case study. A row with no number says why.
Rows started after 10 Nov 2026 get planned vs actual from `public/data/velocity-public.json`.

**Case study**: Masthead with `crumbs`, `spec`, `switcher`, repo; a result-first standfirst;
Fig. 1 in the masthead slot before the audio; a row in `buildsLedger` and `evalsLedger`.

## 12. Off-site (social images, video, decks)

The same tokens and faces apply off the site; the social kit in the content-engine repo is
the reference (`kit/social.css`). A 1080px canvas is read at about 360 CSS px, so every
floor triples (mono 12 → 36, hairline 1 → 3). One finding, one figure, one red group per
canvas; no logo, URL or handle on the canvas; frame 0 equals the still. `design-lint` in
that repo enforces it. OG cards (1200×630) are generated by `scripts/generate-og.mjs` from
`ogCards` in `copy.ts` and colours from `design/tokens.css`.

## 13. Checks that enforce this

`npm run check` (astro check + `scripts/design-check.mjs`: no palette hex or token
declaration outside `design/tokens.css`), `npm run lint` (breakpoints, raw values, line
tiers), `npm run gate` (required and banned strings, em dashes included), `npm run a11y`
(axe on every route at 390/768/1024/1440, fails on serious or critical), `npm run links`
(internal links, fragments, redirect targets; `-- --external` for outbound), `npm run lhci`
(home, /builds/, a case study, /writing/; perf ≥ 90, a11y ≥ 95, SEO ≥ 95, CLS < 0.1, desktop
and mobile), `npm run qa` and `npm run tokens` (rendered sweeps), `npm run audio:check`.
