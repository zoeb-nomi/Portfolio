# zoebnomi.com design system: Red Pen 5, "Live Ink"

This is the one place the design system lives. `design/tokens.css` holds every value;
this page holds the rules; `design/components/` has one page per component;
`design/mocks/` keeps dated before/after shots. hq and Notion point here and copy nothing.

**History.** v3 (12 Nov 2026) was the editorial Red Pen: paper, ink, a red pen as a colour.
v4 (19 Nov 2026) cut its volume and was rejected: it edited the page but did not evolve the
system. **Red Pen 5** (19 Nov 2026) starts again from first principles. It keeps the seed
(paper, ink, one red) and changes what the pen *is*: not a colour, an actor.

## 0. First principles

The site has one job: show, inside ten seconds, that Zoeb catches the failures other people
ship. Everything below follows from three facts about him.

1. **His subject is the quiet failure.** LLM output reads fine until something checks it.
   So the site does not describe checking; it performs it. The home page is a live audit.
2. **There are always three parties.** Zoeb (who decides), the model (whose output is on
   trial) and the check (which reads the output). The type system gives each its own voice.
3. **The pen is the only actor.** An editor's red pen moves only when it catches something.
   On this site red is the only thing that moves on its own, and it moves only to mark.

## 1. Principles

1. **Three voices, one actor.** Zoeb speaks in Archivo, the model in Source Serif 4, the
   check in IBM Plex Mono. The pen (red) acts on all three. Never set a voice in another's face.
2. **The pen marks; it never decorates.** Every red stroke is a proofreader's mark with a
   meaning: tick (checked, fine), strike + caret (wrong, corrected), circle (wrong,
   flagged), underline (stress), box (scoped). No red fills behind text, no red headings.
3. **Show the check, not the claim about it.** Prefer a live artifact (an answer being
   marked, a sheet of outputs) over a sentence saying what was measured.
4. **Every number is a reading.** Value, datum, change, n and source.
5. **Two surfaces.** Paper is where output lives. Ink is where checks run: the proof, the
   call to action and the footer. The ink surface is a token mode, not a second palette.
6. **The final state is in the HTML.** Motion starts from it and returns to it; no script,
   slow script or reduced motion loses nothing.
7. **Your words stay whole.** Long text is not cut; it moves to the page that holds it
   (Builds, About, the case studies). Home carries one claim per screen.
8. **The page never names its own parts.** No "Fig. 0, step n", no "Next:" lines.

## 2. Colour (meaning, not just value)

| token | means | never |
|---|---|---|
| `--paper`, `--paper-raised`, `--paper-sunk` | the page; an object on it (the audit sheet, a card you can press) | a box around text |
| `--ink`, `--ink-body`, `--ink-muted` | Zoeb's voice: headings, numerals / running text / labels and sources | |
| `--rule` | hair rules, empty cells | text |
| `--graphite` | the pencil: what is only proposed or pending (a passed check's leader line, a pending status) | a verdict |
| `--red` | the pen's stroke: marks, the scroll thread, failed cells | text on paper (3.9:1) |
| `--red-ink` | red text on paper (AA 4.5:1): verdicts, links, the primary button | headings, body |
| `--red-glow` | the pen on the ink surface | paper |
| `--surface-ink` + `--on-ink*` | the ink surface | paper sections |

**The ink surface is a mode.** `.surface-ink` (declared in `tokens.css`) swaps the paper
and ink roles and turns the pen to `--red-glow`, so any component that reads roles works on
it unchanged. Pair it with `.bleed` to run a section edge to edge.

**Semantic roles** (`--color-surface`, `-text`, `-accent`, `-pending` and the rest) are what
a side-project theme overrides; the primitives above sit under them.

## 3. Lines

Four tiers, horizontals only: Hair (`--line-hair`, rows), Ink (`--line-ink`, block
boundaries), Heavy (`--line-heavy`, opens and closes a record), Pen (`--line-pen`, a margin
note or a stamp). Objects use `--line-object`. Every hand-drawn mark comes from `pen.ts`,
never from a border.

**Objects cast a hard shadow.** An object you can act on (the audit sheet, a button on
hover) sits on the desk with a hard, unblurred offset shadow in ink. Nothing else has a
shadow, and no shadow is ever blurred.

## 4. Type: three voices

| voice | face | axes | used for |
|---|---|---|---|
| Zoeb | Archivo (variable) | weight 100 to 900, width 62 to 125% | claims, headings, body, interface |
| Model | Source Serif 4 (variable) | weight, optical size | model output on a sheet; case names and quoted record in italic |
| Check | IBM Plex Mono 400/500 | | verdicts, harness and check names, data, sources |

Archivo's two axes are part of the voice, set by tokens: claims are wide and heavy
(`--wdth-claim` 112, `--wght-claim` 820), headings a little wide (`--wdth-head` 106,
`--wght-head` 720), mega numerals narrow (`--wdth-tight` 88). `--wght-quiet` (250) is the
one light weight: it sets the word "quietly" in the home claim, which the motion layer
fades from heavy to quiet.

| role | token | 390 → 1440 |
|---|---|---|
| mega numeral (ink surface) | `--t-mega` | 88 → 232 |
| home claim | `--t-display` | 56 → 140 |
| page H1 (long titles step down) | `--t-page` | 44 → 92 |
| H2 | `--t-h2` | 32 → 62 |
| reading numeral | `--t-stat` | 56 → 96 |
| row name | `--t-num` | 34 → 48 |
| H3 / section label | `--t-h3` | 21 → 27 |
| lede | `--t-lede` | 20 → 26 |
| model output | `--t-model` | 18 → 21 |
| body | `--t-body` | 16 → 17.5 |
| label, mono | `--t-label` | 12 |

**Mono is never uppercase** and never tracked; caps labels are a stock trope (Krebs's slop
list). No italic in Archivo (none ships); italic means the model or the record, in serif.
All three families ship unmodified from Fontsource with their OFL licences
(`public/fonts/OFL-*.txt`).

## 5. Space and grid

4px scale `--s-1` to `--s-15` (136 and 184 are new for section rhythm). Shell 1320px;
`.bleed` sections run to the viewport edge with their content kept on the shell. Margin
column 240px (200 at ≤1099), gutters 48/28/20. Breakpoints 599 / 899 / 1099 only.
Asymmetry is the default on home: 4 + 8 columns, never three equal tiles in a row except
the readings.

## 6. Figure grammar

Unchanged from v3: a figure opens with a Heavy rule and its caption; hollow = before,
filled = after; dashed node = proposes, solid = decides; HTML and hairlines, SVG only for
marks.

## 7. The pen: marks

`src/scripts/pen.ts` draws every mark. Marks are generated from the target's box with a
seeded wobble: the same on every load and resize, but no two alike. Each is an SVG path in
one `svg.pen-layer` over its host, `aria-hidden`.

| mark | proofreading meaning | used for |
|---|---|---|
| tick | checked, fine | a claim that passed |
| strike + caret | delete, insert | a wrong fact and its correction |
| circle | query: this is wrong | an invented citation; a build name on hover |
| underline | stress | the claim's key word; a page title; a reading |
| box | scope | a verb (Trace) |
| leader | see the margin | from a mark to its verdict |

Any element can ask for a mark without a component: `data-pen="underline"` (drawn when it
scrolls into view), `data-pen-on="hover"` (drawn on pointer or focus), `data-pen-delay`,
`data-pen-heavy`, `data-pen-target` (mark a child, host on the parent). `pen-scroll.ts`
runs on every page from Base.

## 8. Motion: five verbs

Nothing moves unless it is one of these. Durations and curves are tokens.

| verb | what moves | token | where |
|---|---|---|---|
| **stream** | the model writes, token by token, with a caret | `--dur-char` | the live audit |
| **mark** | the pen draws (stroke-dashoffset only; duration scales with length) | `--dur-mark`, `--ease-pen` | every mark |
| **stamp** | a verdict lands: a small overshoot from 86% | `--dur-stamp`, `--ease-stamp` | margin verdicts, the insert, the tally |
| **tally** | a count settles from zero to its HTML value | `--dur-tally` | the mega numeral, readings |
| **reveal** | a block enters, or the audit sheet's scan line sweeps | `--dur-slow`, `--ease-draw` | Fig. 0, ledger rows |

Plus two ambient pieces, both CSS only: the **red thread** (scroll progress down the left
edge, `animation-timeline: scroll()`) and **go-quiet** (the claim's last word fades from
`--wght-claim` to `--wght-quiet` once on load).

Rules:
1. The final state is in the HTML; pre-states live under `.motion` (home) or are drawn by
   the script itself (marks). Reduced motion: every mark renders final at once, tallies do
   not run, the thread is hidden.
2. Only transforms, opacity, clip-path, stroke offsets and font-weight animate. No layout
   shift (CLS stays under 0.03).
3. A tally's element always holds the final number; the count-up only rewrites it while it
   runs.
4. The live audit replays only when asked ("Run it again").

| element | motion | trigger |
|---|---|---|
| Home claim | "quietly" goes quiet, then the pen underlines it | load |
| Live audit | stream, then per claim: mark, leader, stamp; then the tally stamps | fonts ready |
| Proof numeral | tally to 86 | in view |
| Fig. 0 audit sheet | the scan line sweeps (1.6 s), failed squares turn red | 35% in view |
| Readings | the pen underlines each numeral; numerals tally | in view |
| Build rows | the pen circles the name | hover, focus |
| Page titles | the pen underlines the last line | load |
| Scroll | the red thread grows down the left edge | scroll |

## 9. Do and don't

| do | don't |
|---|---|
| Let the pen catch something real | Draw a red line for decoration |
| Give the model's words the serif and the check's words mono | Set a quote, a claim and a verdict in the same face |
| Put a number next to its datum, n and source | Leave a headline number alone |
| Use the ink surface for proof and the call to action | Make a whole page dark |
| Keep Zoeb's long text on its own page | Cut his copy to fit a budget |
| Write copy in `src/data/copy.ts` | Type a string into an `.astro` file |
| Use a colon or comma | Use an em dash (the geo-gate fails the build) |
| Keep red text in `--red-ink` | Set body-size text in `--red` (3.9:1) |
| Sentence case everywhere | Uppercase mono labels |

### 9a. Copy budgets

`npm run budget` counts rendered words in `<main>`. Home is enforced at 450 (the live
audit's example answer, about 90 words, is an artifact on the page). Every other page is
report-only: its text is Zoeb's and stays whole.

## 10. Adding a component

1. Check the catalogue first; extend a variant before adding a component for one page.
2. Write it in `src/components/`, with a header comment saying what it is, its variants and
   its motion (the component page is generated from that comment and the Props interface).
3. Values only from `design/tokens.css`; lines only from the four tiers; copy from
   `copy.ts`. Animated parts: final state in CSS, pre-state under `.motion` in
   `src/styles/motion.css`, behaviour in `src/scripts/motion.ts`; pen marks via `data-pen` or `src/scripts/pen.ts`.
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
and mobile), `npm run qa` and `npm run tokens` (rendered sweeps), `npm run audio:check`,
`npm run budget` (home copy budget and the slop audit).

In a cloud container whose Chromium differs from the pinned Playwright, pass
`CHROME=/opt/pw-browsers/chromium` to a11y, links, og and budget, and for lhci
`CHROME_PATH=/opt/pw-browsers/chromium npx lhci autorun --config=<file> --collect.settings.chromeFlags="--no-sandbox --headless=new"`.
