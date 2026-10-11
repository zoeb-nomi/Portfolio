# zoebnomi.com design system: "The Red Pen"

The one reference for how anything under Zoeb's name should look, on the site
and off it (video, social images, charts, decks). `src/styles/tokens.css` is
the source of truth for values; this file is the source of truth for rules.
If the two disagree, fix one of them, do not work around it. Last reconciled
2026-10-08 against tokens.css, README.md and the components in src/components.

## 1. The idea

Paper, ink and one red pen. The page reads like a typeset document a reviewer
has marked up. Red is the reviewer: it annotates and points, it never speaks
in the body voice. Everything is square, light, and set in three faces.

## 2. Tokens

Colour (light theme only; the tokens audit fails on any other text or
background colour):

| token | value | use |
|---|---|---|
| `--paper` | #f4f1ea | page background |
| `--paper-raised` | #faf8f3 | cards, raised panels |
| `--ink` | #191713 | headings, display numerals, strong rules |
| `--ink-body` | #3b362e | running text |
| `--ink-muted` | #6d675e | labels, captions, bylines, secondary data |
| `--rule` | #b8b1a0 | secondary dividers, grid lines, faded marks |
| `--red` | #be241f (oklch(0.52 0.19 28) where supported) | annotation and action: links, CTAs, reviewer marks, focus, the 2px accent rule, "wrong" |
| `--red-ink` | #a91515 | red text that must pass contrast (text links) |
| `--red-tint` | #be241f at 18% | tinted fills behind annotation |
| `--on-red` / `--on-red-muted` | #f4f1ea / #fceeec | text on a red surface |
| `--heat-0` to `--heat-4` | #d5cfc2 to ink, via color-mix | the contributions graph only |

There is no green, no blue, no yellow and no "success" colour. State is never
carried by colour alone: a wrong item is red AND labelled wrong.

Type (self-hosted woff2 in public/fonts; no Google Fonts):

| role | face | weights | token |
|---|---|---|---|
| display: h1, h2, h3, proof numerals, pull quotes | Instrument Serif | 400, 400 italic | `--font-display` |
| body: running text, UI | IBM Plex Sans | 400, 500 | `--font-body` |
| mono: kickers, labels, captions, data, source lines | IBM Plex Mono | 400, 500 | `--font-mono` |

Sizes come only from `--t-*` tokens. Floors: mono 11px, sans 12px, serif 20px.
Weight never above 500. Body is `--t-body` clamp(15.5px, 1.5vw, 17px) at
line-height 1.55; prose at 1.6 to 1.62. Mono caps labels use `--track-caps`
(.12em) and uppercase. Headings use `--track-tight`.

Space: the 4px scale `--s-1` (4px) to `--s-13` (96px). Nothing off the scale.

Shape: `--radius: 0`. Everything is square. No shadows.

Lines, three tiers only: 1px `--rule-strong` (ink) for structural boundaries,
1px `--rule` for secondary dividers, 2px `--red` for annotation. At most one
strong rule between two adjacent blocks.

Layout: `--shell-max` 1200px with 1px rule borders left and right;
`--measure` 56ch caps prose, figures and tables; `--margin-col` 240px (200px
below 1100px, stacked below 900px); `--gutter` 44/28/20px. Breakpoints are
599px, 899px and 1099px only. The header is sticky from 900px.

Motion: `--dur-fast` 120ms, `--dur-base` 200ms, `--dur-slow` 600ms. The
default CSS is the final state: a figure is complete with no script and under
reduced motion.

Hit areas: 24px minimum for standalone links and controls, 44px for a primary
action. Inline links in running text are exempt.

## 3. Voice and copy rules

- First person, plain, specific. Counted, not scored. Findings stated with
  their limits in the same breath.
- Straight quotes and apostrophes. No em dashes in running text; the one
  exception is the table caption convention "Table 1 — Title". No exclamation
  marks.
- Red is never a heading, body text or a proof numeral, OG cards included.
- One h1 per page, no skipped heading levels.
- Every number on the site traces to its source. Figure source lines are
  factual and in words ("CrossSource, strict configuration, 25-question golden
  set.") followed by a link ("Method and data →"). An illustration says so:
  "Illustration, not data:".
- Numbers are not typed twice. On harness pages `src/lib/figureData.ts` reads
  them out of the tables; an essay about an external run links the file the
  numbers come from (metrics.json, a CSV) rather than re-deriving them.
- Table captions read "Table 1 — The six at a glance". Figure captions read
  "Fig. 1 title" in mono caps, from `EssayFigure`.
- Meta titles 60 characters or fewer, descriptions 155 or fewer.
- The geo-gate bans a few literal strings in dist (among them "85%", "$800K",
  "1,200+"). If a true number collides with one, write it as a count
  ("85 of 100") instead.

## 4. Components (use these; do not add new ones for one page)

Page shell: `Base` (title, description, path, ogImage, ogType, noindex,
includeSoftwareSourceCode), `Masthead` (kicker, h1, standfirst, h1Max,
`narr`, byline slot, switcher/spec for case studies), `Section` (mark "§N",
label, anchorId, narrId, note), `CTASlab`, `MarginNote`, `PullQuote`
(rule="red"|"ink").

Data: `DataTable` (caption, columns, rows of {label, cells:[{text}]}, nowrap),
`ProofStrip` (a row of counts), `HarnessLedger` (the evals ledger rows),
`EssayFigure` (n, title, source, href, hrefLabel, replay; wraps any figure
body), `UnitChart`, `BarList`, `Dumbbell`, `ForestPlot`, `ParserCompare`,
`OwnershipGap`, `FailureOwners`, `EvidenceStack`, `CareerTimeline`,
`EssayThumb` (kind per essay for the Writing index).

Media: `AudioPlayer` (audio json, articleId), `ReadAlongDemo`,
`PlayerStepper`, `VideoEmbed` (YouTube only, lite facade, extensionless poster
with .webp and .jpg). A self-hosted mp4 goes inside `EssayFigure` as a plain
`<video autoplay muted loop playsinline preload="none" poster=...>`, width
100%, no `controls` attribute, with a one-sentence caption that is also
narrated. An inline script plays it through an IntersectionObserver when at
least 35% of the figure is on screen and pauses it when it leaves. Under
`prefers-reduced-motion` the script removes `autoplay` and the `<source>`, so
the poster is all that shows and nothing downloads. A plain Pause / Play
`<button type="button">` sits right-aligned above the caption (mono, `--t-note`,
ink, 1px `--rule` border, `--hit-min` high) and holds the video paused until
pressed again.

Figures are HTML and hairlines, not SVG, and chart labels are HTML so they
never fall under the 11px floor. Chart positions are unitless CSS variables
(`--x`, `--l`, `--w`), not inline percentages.

## 5. Page patterns

Essay (`src/pages/writing/<slug>.astro`): all copy lives in `src/data/copy.ts`
as `writing<Name>` plus `meta.writing<Name>`; the .astro file is a renderer.
Order: JSON-LD (articleJsonLd), Masthead with `narr`, byline (date · N min
read), optional AudioPlayer and read-along line, intro paragraphs
(`data-narr="s0-pK"`), then Sections (`narrId="sN-cue"`, paragraphs
`data-narr="sN-pK"`), figures injected after chosen paragraphs, optional
CTASlab or related writing.

Registering an essay (README "Writing" steps; eight places):

1. Copy: the `writing<Name>` object and `meta.writing<Name>` in
   `src/data/copy.ts`.
2. Page: `src/pages/writing/<slug>.astro`.
3. Index: the `essays` array in `src/pages/writing/index.astro`, with an
   `EssayThumb` kind.
4. llms.txt: the `essays` array in `src/pages/llms.txt.ts`. It is the source;
   the hand-written `- Writing:` lines in the llmsTxt template are stripped,
   so do not add one.
5. Sitemap: `src/data/lastmod.json` (add the path, bump /writing/).
6. OG card: `scripts/generate-og.mjs` (paper, 10px red top border,
   Instrument Serif title at 116px, Plex Mono sub at 28px, `\n` in the sub
   breaks the line); run it, then `git checkout -- public/og/` for the cards
   you did not mean to touch.
7. Checks: nothing to register, `qa` and `tokens` read the sitemap. Run build,
   gate, check, lint, qa and tokens.
8. Audio (optional): narration via `scripts/audio/pages.json`.

Case study (`/crosssource/`, `/mirror-eval/`, `/screener-eval/`): Masthead
with switcher and spec, `case-study.css`, a repo link, and a row in
`evalsLedger`. The evals page copy and the gate hard-code "Three harnesses,
one method"; adding a harness means updating both.

## 6. Off-site: applying the system outside the browser

Anything seen next to the site uses the same tokens and faces, and the social
kit in the content-engine repo is the reference implementation. It turns one
`figure.json` into a still, a video, a GIF and a PDF carousel. The canvas is
built for a phone feed: one counted finding, one figure, one red group. The
kit's `kit/social.css` holds the values; this section holds the rules. Colour,
faces, square corners and no shadows are as in section 2.

Formats:

| output | spec |
|---|---|
| still | PNG, 1080x1350, under 5 MB |
| video | MP4, H.264, 30 fps, 15 to 45 s |
| GIF | 15 fps, under 5 MB, one cycle |
| carousel | PDF, 5 to 8 pages at 1080x1350; the cover equals the still |
| OG card | 1200x630, unchanged (section 5, step 6) |

Scale rule. A phone shows the 1080px canvas at 360 CSS px, about 3 device px
per CSS px, so every site floor is multiplied by three: mono 11 becomes 33,
sans 12 becomes 36, serif 20 becomes 60, a 1px hairline becomes 3px, an 8px
mark becomes 24px. A figure that does not fit its zone gets a different
primitive, never a smaller font.

Anatomy, top to bottom, all left-aligned, each zone a fixed height:

1. Kicker: mono caps, ink-muted, one line.
2. Title: Instrument Serif, the hook, two lines at most.
3. Figure: one primitive, 498px tall.
4. Finding line: Instrument Serif, one line, ink.
5. Method: IBM Plex Sans, ink-body, two lines at most.
6. Footer: IBM Plex Sans, ink-muted, states the limit, two lines at most.

Margins are 72px left and right, 72px top and 96px bottom (the bottom clears
platform video controls). Red is reserved for the one finding. There is no
URL, logo, handle or other chrome on the canvas; the link goes in the post.

Floors and marks, in px at 1080 wide:

| item | floor |
|---|---|
| kicker | 33 |
| title | 100 |
| finding line | 64 |
| method | 36 |
| footer | 36 |
| labels and values inside a figure | 33 (values 40) |
| the one big numeral (stat tile only) | 200 |
| mark | 24, or 32 in grids, with an 8 gap |
| hairline | 3 |
| marks in a figure | 100 at most |

Weight stays at 500 or below and the radius stays 0. A mark never overlaps
another mark.

Mark states:

| state | look |
|---|---|
| the finding | `--red`, only inside `[data-finding]` |
| counted | `--ink`, filled |
| excluded | outline in `--rule` |
| text, secondary | `--ink-muted` |

There is one `[data-finding]` group per canvas. The big numeral is never red;
a stat tile marks its finding with a 6px red rule above the numeral.

Primitives (`kit/primitives`; the build throws when a cap is broken):

| primitive | cap |
|---|---|
| unit strip | at most 100 squares in one block |
| dumbbell | 1 to 5 rows, from and to on one axis |
| bar list | 1 to 6 rows on one scale; row notes need 5 or fewer |
| waterfall | 3 to 5 steps, start then drops then end, end equals start minus drops |
| stat tile | one numeral, with an optional second smaller one |
| compare table | at most 5 rows and 3 columns, row pitch 84 or more |
| answer sheet | binned to at most 100 squares, the red group last |

Copy budgets live in the content-engine CLAUDE.md. Row labels in bar lists
and dumbbells are 10 characters or fewer.

Motion. Frame 0 equals the still. Then hold 1 s, cut to the pre state in
120 ms, hold the pre state briefly, and build: each mark or bar draws over
600 ms, staggered. Red enters last, the finding line fades in over 200 ms,
and the final hold is at least 1.5 s so the last frame equals frame 0. The
MP4 plays two cycles; the GIF plays one.

Carousel. 5 to 8 pages, each a full canvas with its own kicker ("1 of 3"),
title, figure, finding, method and footer. Page 1 is the still. One idea per
page, one red group per page, and every page passes the same lint.

Alt text. One factual sentence with the numbers and the limit. Never "image
of" or "picture of", no URL, 20 to 1000 characters.

Renderer. HTML plus Playwright at deviceScaleFactor 1; frames go through
ffmpeg and the PDF through Playwright. The woff2 files are Latin subsets, so
write "0.9 or more", not a symbol. `design-lint` in the content-engine repo
enforces all of this: zones, floors, margins, palette, red scope, marks,
text, line counts, PNG size and alt text. A render that fails it is not done.

## 7. Checks that enforce this

`npm run lint` (raw hex, raw line-heights, off-grid media queries outside
tokens.css), `npm run gate` (required and banned strings in dist),
`npm run check` (astro check), `npm run tokens` (colours, sizes, lines,
radius on the rendered site), `npm run qa` (overflow at 14 widths, axe,
weights above 500, console errors, 4xx/5xx), `npm run audio:check` (narration
still matches the page). For social output the check is `design-lint` in the
content-engine repo (section 6). CI runs all of them; main is live and only Zoeb
merges.
