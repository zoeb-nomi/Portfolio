# zoebnomi.com design system: The Pipeline

This is the one place the design system lives. `design/tokens.css` holds every value;
`src/styles/ds.css` holds the shared kit (every class a page uses); `src/scripts/ds.ts` is the
runtime; this page holds the rules; `design/components/` has one page per component;
`design/mocks/` keeps dated before/after shots. hq and Notion point here and copy nothing.
The live catalogue is `/design/` (rules and history) and `/design/components/` (the kit, rendered).

**History.** v3 (12 Nov 2026) was the editorial Red Pen: paper, ink, a red pen as a colour.
v4 (19 Nov 2026) cut its volume and was rejected. Red Pen 5, "Live Ink" (19 Nov 2026), made
the pen an actor on paper. **The Pipeline** (20 Nov 2026) replaces it: Zoeb picked it from a
round of live prototypes, then refined it in two review rounds (prototype:
claude.ai/artifact/4CpATa2PfQCkeoHYjgonQX). It keeps the seed (ink, paper, one red) and
inverts the ground: black graphite by default, paper as an opt-in light theme.

## 0. First principles

The site has one job: show, inside ten seconds, that Zoeb ships LLM workflows with the checks
that catch quiet failures. Three facts shape it.

1. **The subject is the pipeline, not the pen.** Output flows Prompt → Retrieve → Draft →
   Check → Ship; most of it passes, some is caught. The home page shows that flow live.
2. **Numbers are the proof.** Every claim on the site is a reading with a unit and a source,
   revealed whole. Labels over sentences.
3. **One red line.** Red is the reviewer's line: the CTA, the rule that opens a block, the
   arrow from before to after, a failure, the reading spine. Never body text, never a whole heading.

## 1. Principles

1. **Calm, then exact.** Motion is a quiet fade; the exactness is in the numbers and the alignment.
2. **Show the system, not a claim about it.** Prefer a live artifact (the pipeline scene, the harness
   band, a before → after panel) over a sentence describing it.
3. **Every number is a reading.** Value, unit, datum, n and source in mono beside it.
4. **Dark first, light on request.** Both themes are complete; nothing is designed for one only.
5. **The final state is in the HTML.** No script, slow script or reduced motion loses nothing.
6. **Your words stay whole.** Long text is not cut; it moves to the page that holds it
   (Builds, About, the case studies). Home carries one claim per screen.
7. **No scroll-jacking.** Nothing pins the page for more than about two screens, and any pinned
   sequence has a visible Skip. A click, not vertical scroll, drives an inspector.

## 2. Colour (meaning, not just value)

Primitives (declared once in `tokens.css`, dark values first, light values under
`:root[data-theme="light"]`, print uses the light values):

| primitive | dark | light | means |
|---|---|---|---|
| `--bg` | near-black graphite | warm paper | the page |
| `--bg-2` | a step up | a step down | a figure's ground, a well |
| `--raise` | two steps up | two steps down | hover fill on rows |
| `--panel` | graphite at 95% | paper at 96% | cards, the trace inspector |
| `--ink`, `--ink-2`, `--ink-3` | paper tones | ink tones | headings and values / body / labels and sources |
| `--rule`, `--rule-2` | | | hair rules / stronger rules and outlines |
| `--red` | warm red | deeper red (AA on paper) | the one accent |
| `--glass`, `--glass-2`, `--chip-bg`, `--code-bg` | translucent fills | | header bar, HUD strip, chips, inline code |

**Two tiers: primitives and roles.** Components never read a primitive. Every colour in `src/`
reads a role, and `npm run check` fails on a primitive read (design-check):

| role | reads | means |
|---|---|---|
| `--color-surface`, `-surface-sunk`, `-surface-raised` | bg, bg-2, raise | the page; a figure ground; a hover fill |
| `--color-panel`, `-glass`, `-glass-strong`, `-chip`, `-code` | panel, glass, glass-2, chip-bg, code-bg | cards and translucent bars |
| `--color-text`, `-text-body`, `-text-muted` | ink, ink-2, ink-3 | headings and numerals; running text; labels and sources |
| `--color-line`, `-line-strong` | rule, rule-2 | hair rules; outlines and strong rules |
| `--color-accent`, `-accent-text`, `-accent-tint`, `-on-accent`, `-accent-hover` | red | the red line; red text; a red wash; text on red; the primary button on hover |
| `--color-link`, `-pending` | ink, ink-3 | prose links (red underline); not yet checked |
| `--color-state-pass`, `-fail`, `-warn`, `-na` | ink, red, ink-3, rule-2 | a check's verdict |
| `--color-series-1` to `-6` | red, ink, ink-3, then mixes | chart series; red is the series under test |
| `--scene-bg`, `--scene-ink`, `--scene-red` | "r,g,b" triplets | canvas drawing; scripts read them and redraw on `ds:theme` |

**Theming.** The header toggle sets `data-theme` on `<html>`, stores it per viewer
(`localStorage` key `ds-theme`, read before first paint in `Base.astro`) and fires a `ds:theme`
event. Overriding primitives on `:root` reaches every role because both resolve on `<html>`.
A derived theme overrides primitives the same way and never declares a component colour.

## 3. Lines

Every border reads a token (`npm run lint` fails on a raw `1px solid ...`):
`--line-hair` (rows, rules), `--line-strong` (outlines: cards, chips, the header action),
`--line-ink` and `--line-heavy` (booktabs: 1px under a table head, 2px top and bottom),
`--line-pen` and `--line-accent` (the red line: a blockquote, a margin note, a figure's
open), `--line-object`, `--line-propose` (dashed: proposed, not yet decided).
Side rules are allowed (cards, the HUD's cells). No rounded corners (`--radius: 0`), no shadows.

## 4. Type

Two families, both self-hosted from Fontsource with their OFL licences (`public/fonts/`):
**Archivo** (variable: width 62 to 125, weight 100 to 900) for headings, numbers and body;
**IBM Plex Mono** 400/500 for labels, data, sources and the interface. Labels are mono,
uppercase, tracked `--track-caps`. Each heading role is a size, a width and a weight:

| role | size token | wdth / wght | used for |
|---|---|---|---|
| display (h1) | `--t-display` 34 → 70 | 88 / 800 | page titles, the home claim |
| h2 | `--t-h2` 34 → 76 | 84 / 800 | section heads |
| h3 | `--t-h3` 24 → 36 | 84 / 760 | card and block heads |
| h4 | `--t-h4` 19 → 23 | 90 / 700 | small heads |
| readout | `--t-num` 20 → 27 | 90 / 780 | a value in a card or the HUD |
| prose | `--t-prose` 17 → 19 | 100 / 420 | essays, notes, case studies |
| body | `--t-body` 16 | 100 / 420 | interface text |
| label | `--t-label` 11, `--t-label-lg` 12 | mono | labels, kickers, sources |

Weight carries emphasis; there is no italic display. Numerals are tabular wherever they line up.

## 5. Space and grid

4px scale `--s-1` (4) to `--s-12` (128). Shell `--shell-max` 1360px with safe-area gutters
(`.gut` reads `--gutter-l/-r`, 16px minimum). Reading measure `--measure` 64ch. Header
`--header-h` 60px, sticky glass. Breakpoints 599 / 899 / 1099 only. Spined sections
(`.sec.spined`) indent their content 22 to 48px from the red spine, and every block in a section
starts on that same left edge.

## 6. Components (the kit, `src/styles/ds.css`)

| component | markup |
|---|---|
| Page shell | `Base.astro`: `.site` header (brand, `.nav > .nl`, `.theme-t`, `.hcta`), `main#main`, one-line `.foot` |
| Section | `section.sec.gut > .in`; `.spined` + `<div class="spine">` for the red line |
| Heads | `.kick` (red dash + mono label) · `h1.display` · `h2.h2` · `.h3` · `.h4` · `.id` · `.lab` (`.lab.red`) · `.mk > .ul` red underline |
| Heading fade | `.split` or `data-split` on a `.display`/`.h2`: the line fades up 10px once |
| Page head | `section.page-head` · `.byline` · `.stats > .ro` |
| Buttons | `.btn > .mi + .ar` (still; only the arrow nudges 3px) · `.btn.ghost` · `.tl` text link · `.ctas` row |
| Readout card | `.card > .card-top (.no) + h3 + .ros[.n2] > .ro > .v + .u + .s` in a `.cards` grid |
| Before → after | `article.panel`: left `.ph`, `.pt`, `dl.how`, `.srcl`; right `.v-vals > .v-val.v-before (.v-num + .v-strike)`, `.v-arrow`, `.v-val`, `.v-cap` |
| Verbs row | `ul.verb-row > li.verb > .vn + h3 + .vp`: labels, not links; no hover, no focus stop |
| List rows | `ol.blist > li > a.build > .bn + .bk2 + .bv + .ba` (Builds, Writing) |
| HUD strip | `.hud > .hud-in > .hud-c > span + b (.r)`; live values change through `swap()` |
| Table | `.tbl-wrap > table.tbl` (booktabs) · `td.n` numeric · `td.win` red |
| Figure | `figure.fig > .fig-frame + figcaption (.fno, text, .fsrc)` |
| Prose | `.article > .prose + aside (.margin-note)` · `.sec-no` in h2 · `sup a` · `.footnotes` |
| Tags | `.tags > .tag` (`.red`, `.solid`) · `.chip` (a button) |
| Audio player | `AudioPlayer.astro`: play/pause, red scrubber (`role=slider`, arrows seek 10s), time, speed 1 / 1.25 / 1.5, captions from the cue file |

Astro components wrap these classes; `design/components/<Name>.md` documents each one.
**Figure grammar:** a figure sits on `--color-surface-sunk`, opens with its red number
(`.fno`), uses hairlines and mono labels, and gives red only to the series under test, the
failure or the after value. Hollow = before, filled = after; dashed = proposes, solid = decides.

## 7. The red line

Red marks one thing per block: the CTA, the rule that opens a card (`.card::before`), the
arrow between before and after, a struck before-value (`.v-strike`), a failure square, the
active nav underline, and the **spine**: a 2px line down a spined section or an essay that
grows as you read and ends in a small red square at the footnotes. It never runs past the
content it belongs to.

## 8. Motion

One signature moment per page; everything else is a quiet reveal. `src/scripts/ds.ts`:

| hook | motion |
|---|---|
| `.split` / `[data-split]` | the heading fades up 10px, once (no per-word or per-letter motion) |
| `[data-reveal]`, `[data-stagger]` | a block, or its children in sequence, fade up 8 to 10px |
| `[data-num]` | a number appears whole: opacity and a 6px rise, never a count |
| `.spine` | scales down its section with scroll, latched (never shrinks) |
| `.verb-row` | one time-based variable-weight wave when the row arrives, settling at 620 |
| `swap(el, v)` | a live digit changes instantly with a 220ms opacity tick |

Rules:
1. Entrances use `--ease-out` (expo out); exits are short (about 220ms) and finish before the next element enters.
2. Animate transform, opacity, clip-path or font-variation only. Canvas for more than about 100
   moving things; pause loops off-screen.
3. Numbers are revealed whole. Never count up, never show an intermediate value.
4. No scroll-jacking: a pinned sequence is short and has a visible Skip. Interactive inspection
   (the trace) is driven by clicks and arrow keys, not by scroll.
5. Reduced motion: the final composed state, no movement. Without JS every word is visible.
6. The kit hooks above run on IntersectionObserver and the Web Animations API, so a plain page ships no animation
   library. Page scripts that need timelines or pinning (the home scene, Shipped, About, Builds, Design) import
   GSAP 3.12.5 + ScrollTrigger from `src/scripts/gsap.ts` (npm, pinned). No smooth-scroll library.

## 9. Do and don't

| do | don't |
|---|---|
| Put a number next to its unit and source | Leave a headline number alone |
| Give red to one thing per block | Set body text or a whole heading in red |
| Use mono uppercase for labels | Set a label in the display face |
| Keep Zoeb's long text on its own page | Cut his copy to fit a budget |
| Write copy in `src/data/copy.ts` | Type a string into an `.astro` file |
| Use a colon or comma | Use an em dash (the geo-gate fails the build) |
| Check both themes | Ship a figure that only reads on dark |
| Fade calmly | Pop words in, bounce buttons, count numbers up |

### 9a. Copy budgets

`npm run budget` counts rendered words in `<main>`. Home is enforced at 750 (the approved Pipeline home, 740 at port; the stage cards and harness labels are data, not prose). Every other page
is report-only: its text is Zoeb's and stays whole. Hero 12 words, headlines 8, cards a title
plus 2 or 3 readouts.

## 10. Adding a component

1. Check the kit and the catalogue first; extend a class before adding a component for one page.
2. Write it in `src/components/`, with a header comment saying what it is, its variants and its motion.
3. Values only from `design/tokens.css`, colours only from roles, lines only from `--line-*`, copy
   from `copy.ts`. Motion through the `ds.ts` hooks; anything page-specific stays in that page's module script.
4. Add `design/components/<Name>.md` and a screenshot in `design/mocks/<date>/components/`.
5. Run `npm run check` (astro check + design-check), `lint`, `gate`, `a11y`, `links`, `lhci`.

## 11. Page patterns

| page | order |
|---|---|
| Home | hero claim and pipeline scene (Skip, trace inspector) → Shipped before → after panels in a spined section → verbs row → harness band (live) → Builds list → About → contact |
| Builds | `.page-head` with `.stats` → `.blist` of all builds → a panel per featured build → method (`#method`) |
| Writing | `.page-head` → essays `.blist` → notes `.blist` (`#notes`) |
| Essay / note | `.page-head` with `.byline` → audio → `.article` (`.prose` + aside) → `.footnotes` → related `.blist` |
| Case study | `.page-head` + `.hud` spec strip → headline `.panel` → `.prose` sections with `.tbl` and `.fig` → method verbs → repo CTA |
| About | `.page-head` with headshot → vertical career track → record (`#record`) → video → CTA |
| Design | these rules rendered, previous versions; `/design/components/` renders the kit |

**Essay** (`src/pages/writing/<slug>.astro`): copy as `writing<Name>` + `meta.writing<Name>`
in `copy.ts`; Masthead with byline, optional AudioPlayer, intro paragraphs
(`data-narr="s0-pK"`), Sections (`narrId="sN-cue"`), figures after chosen paragraphs, the
CTA row. Register it in eight places: copy, page, the `essays` list and
`writingIndex.numbers` in `copy.ts`, `src/pages/llms.txt.ts`, `src/data/lastmod.json`, an
`ogCards` entry (then `npm run og`), checks, and narration via `scripts/audio/pages.json` if it
has audio.

**Note**: an entry in `src/data/notes.ts` with a `group` (tradeframe, cheap-tier,
decisions-api, crosssource, screener-eval, mirror-eval, other); it appears on
`/writing/#notes` under its group.

**Build**: a `buildsLedger` row in `copy.ts`. `kind: 'agent'` requires `guarded`,
`measured.scorerCheck`, a repo and a case study. A row with no number says why.

**Case study**: page head with the spec strip, a result-first panel, the audio, sections; a row in `buildsLedger`.

## 12. Off-site (social images, video, decks)

The same roles and faces apply off the site. The social kit in the content-engine repo
(`kit/social.css`, `kit/tokens.css`) still carries Red Pen and is due to move to The Pipeline;
until it does, new social canvases follow this page: graphite ground, paper ink, one red group
per canvas, Archivo and Plex Mono, every floor tripled for a 1080px canvas. OG cards
(1200×630) are generated by `scripts/generate-og.mjs` from `ogCards` in `copy.ts` and colours
from `design/tokens.css`.

## 13. Checks that enforce this

`npm run check` (astro check + `scripts/design-check.mjs`: no palette hex or token
declaration outside `design/tokens.css`, no primitive read in `src/`), `npm run lint`
(breakpoints, raw colours, raw values that have tokens, borders through `--line-*`),
`npm run gate` (required and banned strings, em dashes included), `npm run a11y` (axe on every
route at 390/768/1024/1440, fails on serious or critical), `npm run links` (internal links,
fragments, redirect targets; `-- --external` for outbound), `npm run lhci` (home, /builds/, a
case study, /writing/; perf ≥ 90, a11y ≥ 95, SEO ≥ 95, CLS < 0.1, desktop and mobile),
`npm run floor` (every route at 375px: no visible text under 11px, SVG labels included), `npm run qa` and `npm run tokens`
(rendered sweeps), `npm run audio:check`, `npm run budget`. The build itself writes the Content-Security-Policy
(`scripts/csp.mjs`, postbuild: hashes of the inline scripts plus the allowed hosts).

In a cloud container whose Chromium differs from the pinned Playwright, pass
`CHROME=/opt/pw-browsers/chromium` to a11y, links, og and budget, and for lhci
`CHROME_PATH=/opt/pw-browsers/chromium npx lhci autorun --config=<file> --collect.settings.chromeFlags="--no-sandbox --headless=new"`.
