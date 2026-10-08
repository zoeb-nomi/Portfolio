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
- Straight quotes and apostrophes. No em dashes. No exclamation marks.
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
`<video controls preload="none" playsinline poster=...>`, width 100%, with a
one-sentence caption that is also narrated.

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

Registering an essay (README "Writing" steps): copy.ts object and meta;
the page; the `essays` array in `src/pages/writing/index.astro` (with an
`EssayThumb` kind); `src/pages/llms.txt.ts` and the `- Writing:` line in the
llmsTxt template; `src/data/lastmod.json` (add the path, bump /writing/);
the OG card in `scripts/generate-og.mjs` (paper, 10px red top border,
Instrument Serif title at 116px, Plex Mono sub at 28px; run it, then
`git checkout -- public/og/` for the cards you did not mean to touch);
optional narration via `scripts/audio/pages.json`.

Case study (`/crosssource/`, `/mirror-eval/`, `/screener-eval/`): Masthead
with switcher and spec, `case-study.css`, a repo link, and a row in
`evalsLedger`. The evals page copy and the gate hard-code "Three harnesses,
one method"; adding a harness means updating both.

## 6. Off-site: applying the system outside the browser

Use the same tokens and faces for anything that will be seen next to the site.

- Video and stills (1080x1080 social, 1200x630 OG): background `--paper`,
  text `--ink`, secondary `--ink-muted`, grid and faded marks `--rule`, the
  one accent `--red`. Wrong/miss/annotation = red; correct/neutral = ink-muted.
  No green, ever. Headline and large numerals in Instrument Serif; labels,
  axis ticks and footers in IBM Plex Mono uppercase; any running sentence in
  IBM Plex Sans. Square corners, no drop shadows, no logos.
- matplotlib: convert public/fonts/*.woff2 to .ttf with fonttools, register
  them with `font_manager.fontManager.addfont`, and set the figure facecolor
  to paper. The site's woff2 files are Latin subsets, so avoid "≥" and other
  symbols that would fall back to another face; write "0.9 or more".
- Phone legibility at 1080px: counters 44pt or larger, headline 26pt or
  larger, axis labels 16pt or larger.
- Reference implementation: `animate.py` and `plot.py` in the
  openai_decisions repo (fonts in media/fonts).

## 7. Checks that enforce this

`npm run lint` (raw hex, raw line-heights, off-grid media queries outside
tokens.css), `npm run gate` (required and banned strings in dist),
`npm run check` (astro check), `npm run tokens` (colours, sizes, lines,
radius on the rendered site), `npm run qa` (overflow at 14 widths, axe,
weights above 500, console errors, 4xx/5xx), `npm run audio:check` (narration
still matches the page). CI runs all of them; main is live and only Zoeb
merges.
