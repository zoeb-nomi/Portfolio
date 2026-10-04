# zoebnomi.com — portfolio site

Source of [zoebnomi.com](https://zoebnomi.com/?utm_source=github&utm_medium=readme&utm_campaign=portfolio), the personal site of **Zoeb Nomi** — AI Product Manager focused on eval-driven LLM/RAG output quality.

Built with Astro 5. All copy, meta, JSON-LD and llms.txt live in `src/data/copy.ts`. `scripts/geo-gate.mjs` gates the site against canon (74 required strings, 11 banned) — run it after every edit.

Keystone project: [CrossSource](https://github.com/zoeb-nomi/crosssource) — eval methodology for RAG citation quality (precision 0.981 → 0.994, ~95% golden-set citation accuracy, 270K-record corpus).

## Deploy & rollback

Hosted on Cloudflare Pages. Build command `npm run build`, output directory `dist/`. Node version is pinned in `.nvmrc` (22; `engines` allows >= 20).

- **Production** — every commit to `main` builds and auto-deploys. There is no staging environment.
- **Previews** — commits on any other branch get their own preview deployment at a generated URL. Previews send `X-Robots-Tag: noindex`.
- **Rollback** — Cloudflare Pages → the project → **Deployments** → find the last good build → **Rollback to this deployment**. This repoints production immediately without a rebuild. Alternatively revert on `main` and let the normal build redeploy. PRs land as merge commits, so use the **Revert** button on the merged PR, or `git revert -m 1 <merge commit>`; each PR reverts on its own.
- **Which project?** At the time of writing two Cloudflare Pages projects (`zoebnomi` and `portfolio`) are connected to this repo and both post a preview on every PR. Check in the dashboard which one owns the `zoebnomi.com` domain before following the rollback steps.

**Publish rule** — `main` is live and only Zoeb merges to it. Zoeb commits via the GitHub web UI; Claude does not push to `main` or merge, and does not push at all unless Zoeb explicitly asks in that session, in which case it pushes a feature branch and opens a **draft** PR for him to review. Every change goes through a branch and PR, and CI (`.github/workflows/ci.yml`) must be green first.

Run `node scripts/geo-gate.mjs` against `dist/` before deploying — it is the last gate between an edit and production.

## Checks

All of these run in CI, in this order (`.github/workflows/ci.yml`): `npm ci`, `npm run build`, `npm run gate`, `npm run check`, `npm run lint`, then `npm run qa` and `npm run tokens` against a running preview, then `npm run audio:check`.

- `npm run check` — `astro check` (types).
- `npm run gate` — `scripts/geo-gate.mjs` against `dist/` (run `npm run build` first).
- `npm run lint` — `scripts/lint-source.mjs`: reads `src/**/*.{astro,css}` and fails on a media query off the 599/600, 899/900, 1099/1100 grid, a raw colour outside `tokens.css`, or a raw line-height, underline offset, hit-area height or font-size that has a token. Needs no build and no dependencies.
- `npm run qa` — `scripts/qa-sweep.mjs`: Playwright sweep of every page for horizontal overflow (14 widths from 360 to 1920px, including both sides of each breakpoint), axe violations (at 390, 768, 1024 and 1440), font-weight > 500, off-scale font sizes (warn only), console errors and 4xx/5xx requests. Needs a running site (`npx astro preview --host 127.0.0.1 --port 4321`, or set `BASE_URL`); report written to `.astro/qa-report.json`.
- `npm run tokens` — `scripts/tokens-audit.mjs`: the rendered site against the design tokens, at 1440, 1024 and 390. **Fails** on font-weight > 500 and on any text or background colour outside the palette; **warns** on font sizes outside the type tokens, line styles other than {1px ink, 1px rule, 2px red}, and border-radius other than 0. Same running-site requirement; report in `.astro/tokens-report.json`.

**Both sweeps read their page list from the build** (`dist/sitemap-0.xml`, plus `/404.html`, via `scripts/lib/pages.mjs`), so a new page is checked as soon as it is in the sitemap. A page left out of the sitemap is not swept. They need a local `npm run build` even when `BASE_URL` points at a remote site.

## Local setup

```bash
nvm use                            # Node 22, from .nvmrc
npm ci
npx playwright install chromium    # once: qa, tokens and generate-og drive a real browser
npm run build
npx astro preview --host 127.0.0.1 --port 4321    # then: npm run qa, npm run tokens
```

`npm run build` runs `prebuild` first, which fetches live GitHub data and rewrites the tracked `src/data/contributions.json`. Unless you meant to refresh the heatmap, run `git checkout -- src/data/contributions.json` before committing.

## Writing (essays)

Essays are hand-built `.astro` pages in `src/pages/writing/`, not Markdown and not a content collection. The newer ones keep their copy in `src/data/copy.ts` and render through `Base` → `Masthead` → `Section`. To add one:

1. **Copy** — add a `meta.<key>` entry (`title`, `description`) and an essay object (`kicker`, `title`, `dek`, `date` as ISO `YYYY-MM-DD`, `readingTime`, sections) to `src/data/copy.ts`. `Base` uses one `title` for both `<title>` and `og:title`, so keep it at 60 characters or fewer; keep the description at 155 or fewer. Use straight quotes and apostrophes.
2. **Page** — `src/pages/writing/<slug>.astro`. Give each `Section` an `anchorId` for a stable, human deep link (`#kyb`); without one its heading gets `sec-<label>`. Each section heading is an `h2`, so the page has one `h1` (the masthead) and no skipped levels.
3. **Index** — add the essay to the `essays` array in `src/pages/writing/index.astro`. The list is sorted by date, and each card's title, dek, date, reading time and narration length come from the essay's own data object, so there is no second copy to keep in step.
4. **llms.txt** — add the essay to the list in `src/pages/llms.txt.ts`.
5. **Sitemap** — add the URL to `src/data/lastmod.json` (and bump `/writing/`). A route with no entry gets no `lastmod`; the build date is never used.
6. **OG card** — add an entry to `scripts/generate-og.mjs` and run `node scripts/generate-og.mjs`. It re-renders every card with tiny byte differences, so commit only the PNGs you meant to change (`git checkout -- public/og/<other>.png`).
7. **Checks** — nothing to register: `qa` and `tokens` pick the page up from the sitemap (see above). Run build, gate, check, lint, qa and tokens.
8. **Audio (optional)** — see "Narration audio" below.

**Figures.** `EssayFigure` (a numbered, captioned frame with a source line) wraps `UnitChart` (one square per case), `BarList` (label / bar / value rows), `OwnershipGap` (a chain-of-ownership illustration), or the existing `DataTable`. They are built from HTML and hairlines, not SVG, so type stays on the token scale and above the 11px floor; the numbers in them come from the site's own harness pages and each figure links its source. For a wide text table on phones, render a stacked-card version below 900px (see Table 1 in `nobody-reports-the-misses.astro`).

**Animated figures.** The data figures move: `ForestPlot` (confidence intervals around zero, with the screener gap on the same scale), `Dumbbell` (a hollow start marker and a filled end marker that slides out), `UnitChart` (squares fill in), `ParserCompare` (two résumé versions, tick boxes grey one out), `FailureOwners`, `EvidenceStack` (3D sheets on /mirror-eval/, flat with reduced motion), `PlayerStepper` (a media-player explainer; its transcript is the figure when JavaScript is off), `ProofStrip` (counts up on the home page and /evals/), and `CareerTimeline` on /about/. The rules:

- The default CSS is the final state, so a figure is complete with no script and with reduced motion. `src/scripts/figure-motion.ts` puts a figure in its start frame (`data-state="pre"`) and plays it once when 35% of it is on screen; pass `replay` to `EssayFigure` to get the small Replay link.
- Numbers are not typed twice. `src/lib/figureData.ts` reads them out of the case-study tables and paragraphs, and the build fails, naming the figure, if the wording changes so a number can no longer be read.
- Chart positions are unitless CSS variables (`--x`, `--l`, `--w`), not inline percentages: the geo-gate bans the string `85%` anywhere in the HTML, and a chart can land on it by chance.
- Lines are 1px ink, 1px rule or 2px red, filled squares carry no border, and everything stays on the type tokens; `npm run tokens` and `npm run lint` check it.

## Design system ("The Red Pen") and accessibility conventions

`src/styles/tokens.css` is the single source for colour, type, space, lines and breakpoints; `scripts/tokens-audit.mjs` checks the rendered result.

- **Colour** — red (`--red`, `--red-ink`) is for annotation and action only: text links, CTAs, reviewer marks, focus. Never headings or body text, and never a proof numeral (OG cards included).
- **Shape and type** — radius 0 everywhere; font weights of 500 or less; type only from the `--t-*` tokens (floors: mono 11px, sans 12px, serif 20px); spacing from the 4px `--s-*` scale.
- **Lines** — three tiers only: 1px `--rule-strong` (ink) for structural boundaries, 1px `--rule` for secondary dividers, 2px red for annotation. At most one strong rule between two adjacent blocks.
- **Breakpoints** — 599px, 899px and 1099px only (the header is sticky from 900px). Light theme only.

Accessibility conventions that came out of the 2026-10 UX audit (the written report is in the HQ docs folder; each finding is a row in the Notion Findings Ledger):

- Standalone links and controls have a 24px minimum hit area (44px for a primary action). Inline links in running text are exempt.
- One `h1` per page and no skipped heading levels. `Section` renders its margin column as a plain `div`: use `aside` only for a real note (`MarginNote`) or a spec block, never to lay out a column. `html` has `scroll-padding-top` from 900px, and `Section` headings have `scroll-margin-top`, so anchors land below the sticky header.
- Text drawn inside an SVG scales with the figure and can fall below the 11px floor on phones, and `qa-sweep` and `tokens-audit` skip SVG text. Prefer HTML for chart labels, or step the sizes up below 600px as the bus-stop chart does.
- Colour alone never carries state: the current page keeps its underline, focus rings are drawn inside clipping frames (`outline-offset`), and a failed audio load says so.
- The floating audio control parks below the heading it follows (never on top of it), and hides while the CTA slab or footer is on screen.

## Narration audio

An essay can have a narrated, read-along audio file. It is generated **locally** by `scripts/audio` (a Kokoro voice running on this machine; nothing is sent anywhere), not by the site build, and the result is committed: `public/audio/<slug>.mp3`, `public/audio/<slug>.vtt` (captions) and `src/data/audio/<slug>.json` (duration, chapters, per-paragraph read-along cues, and provenance: engine, voice, loudness, model hash, per-paragraph text hashes).

```bash
npm run audio:install                        # once: isolated deps in scripts/audio/node_modules (~400 MB; not part of the site's install or CI)
npm run build                                # the narration is read from the built page
npm run audio:build -- <slug> --dry-run      # read the spoken script first; no model needed
npm run audio:build -- <slug>                # voice (first run downloads the ~330 MB model into .audio-cache/), mix, mp3
npm run audio:verify -- <slug>               # optional: transcribe it back with Whisper and compare, sentence by sentence
npm run audio:check                          # is the audio still true to the page? (after npm run build)
npm run audio:test                           # unit tests; no model, no network
```

- **Anchors.** The page is the script: every element with `data-narr` is narrated, in document order. `Masthead narr` anchors the title and standfirst, `Section narrId="sN-cue"` the section headings, and `data-narr="sN-pK"` each paragraph. Tables, lists and figures cannot be read verbatim: extraction stops and names the anchors until `scripts/audio/pages.json` supplies a spoken version of each in `overrides` (`/crosssource/` has six; review them like copy). `moveAfter` changes the spoken order when the markup order is wrong for the ear (the margin spec block comes after the standfirst).
- **Register the page** in `scripts/audio/pages.json` (slug, path, title, optional `chapterTitles`), then wire the generated data in like `nobody-reports-the-misses` does: an `audio` object in `src/data/copy.ts`, `<AudioPlayer />` in the Masthead slot, and the `AudioObject` in the page's JSON-LD.
- **Pronunciation** lives in `scripts/audio/lexicon.json`. Add a line when `audio:verify` (or your ears) catches a mispronounced word; only the sentences that change are re-synthesised.
- **Keeping it honest.** `audio:check` fails when the page text changes after the audio was built and names the anchors that changed. It runs in CI after the QA sweep (it reads `dist/` and the committed manifests, and needs no model), but only for the pages listed in `scripts/audio/pages.json`. The older narrated essays use hand-uploaded mp3s with no manifest, so nothing checks them: re-listen after editing one.
- **What it can't tell you** is whether it sounds good: `audio:verify` measures intelligibility and cue alignment, not taste. Listen before merging.

How the pipeline works, and its quality gates, are in [`scripts/audio/README.md`](scripts/audio/README.md).

## Contributions graph

`ContributionGraph.astro` renders a monochrome GitHub-style contribution heatmap. It has three layers, in order of trust:

1. **Committed snapshot** — `src/data/contributions.json` is server-rendered into the page at build time, so the graph is a complete, correct picture with JS off and never disappears. It's regenerated automatically by the `prebuild` npm script (`scripts/fetch-contributions.mjs`), which runs before every `npm run build`.
2. **Live Function** — `functions/api/contributions.ts` is a Cloudflare Pages Function at `GET /api/contributions`. It fetches GitHub's public, unauthenticated, undocumented HTML endpoint (`https://github.com/users/zoeb-nomi/contributions` — the same markup a logged-out browser gets, no token, no cookies), parses it, and returns `{ source: "live", fetched_at, total_last_year, days }`. A small inline script on the page calls this on load and, if it succeeds, re-renders the cells and caption over the snapshot.
3. **Fallback** — if the live fetch or parse fails, the Function returns `503 { source: "unavailable" }` and the page just keeps showing the snapshot with an "as of \<date\>" caption. The client script never crashes or blanks the graph on a failed fetch.

Both the Function and the prebuild script share one parser: `functions/_lib/parse-contributions.mjs`. It's dependency-free — regex over GitHub's `<td class="ContributionCalendar-day" data-date data-level id>` cells and the matching `<tool-tip for="...">N contributions on Month Dth.</tool-tip>` elements, plus the "N contributions in the last year" total. `scripts/test-parse-contributions.mjs` (`npm test`) runs it against the real fixture at `tests/fixtures/contributions.html`.

**Caching**: the Function caches successful responses at Cloudflare's edge (`caches.default`, keyed on the request URL) and sets `Cache-Control: public, max-age=3600, s-maxage=21600` — a 1h browser cache, 6h edge cache. A `503` is cached for only 60s, so a transient GitHub outage doesn't wedge the "unavailable" response in for hours.

**Refreshing the snapshot**: `npm run build` does this automatically. To refresh it standalone, run `node scripts/fetch-contributions.mjs` — it writes `src/data/contributions.json` on success and, on any failure, prints a warning and leaves the existing file untouched (it never fails the build).

**Known risk**: this endpoint is public but **undocumented and unversioned** — GitHub can change the contribution-calendar markup at any time with no notice. If the parser starts throwing (both the Function's 503 rate and `npm test` failing are the signal), the fix is in `functions/_lib/parse-contributions.mjs`: re-capture `tests/fixtures/contributions.html` from a real page load and update the regexes to match the new shape.

**Auth note**: the endpoint's contribution count differs by viewer — an authenticated request (e.g. viewing your own profile logged in) includes private contributions; this Function's anonymous, cookie-free fetch only ever sees public ones, and that's the number the graph shows. Don't be surprised if it's lower than what you see logged into github.com yourself.
