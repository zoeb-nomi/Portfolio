# zoebnomi.com: portfolio site

Source of [zoebnomi.com](https://zoebnomi.com/?utm_source=github&utm_medium=readme&utm_campaign=portfolio), the personal site of **Zoeb Nomi**, AI Product Manager: agents, workflows and evals.

Built with Astro 5. All copy, meta, JSON-LD and llms.txt live in `src/data/copy.ts`. `scripts/geo-gate.mjs` gates the site against canon (required and banned strings, em dashes included); run it after every edit. The design system is in [`design/`](design/README.md).

Keystone project: [CrossSource](https://github.com/zoeb-nomi/crosssource), an open benchmark for legal-RAG citation accuracy. [v0.3](https://github.com/zoeb-nomi/crosssource/releases/tag/v0.3) (20 Oct 2026): 150 items over 45 public US court opinions with full provenance, a written labelling protocol, two blind model raters (Cohen's kappa 0.98 / 0.84); items are model-drafted and model-checked. v0.1 (n = 25): citation-discipline prompting lifted precision 0.981 → 0.994. DOI [10.5281/zenodo.23493797](https://doi.org/10.5281/zenodo.23493797) (v0.3), [10.5281/zenodo.21969577](https://doi.org/10.5281/zenodo.21969577) (all versions).

## Deploy & rollback

Hosted on Cloudflare Pages. Build command `npm run build`, output directory `dist/`. Node version is pinned in `.nvmrc` (22; `engines` allows >= 20).

- **Production**: every commit to `main` builds and auto-deploys. There is no staging environment.
- **Previews**: commits on any other branch get their own preview deployment at a generated URL. Previews send `X-Robots-Tag: noindex`.
- **Redirects**: `public/_redirects` sends the v2 URLs (/evals/, /work/, /notes/, /shipping/) to their v3 homes as **302** during a two-week bake period after the v3 deploy; then flip all eight lines to 301.
- **Rollback**: Cloudflare Pages → the project → **Deployments** → find the last good build → **Rollback to this deployment**. This repoints production immediately without a rebuild. Alternatively revert on `main` and let the normal build redeploy. PRs land as merge commits, so use the **Revert** button on the merged PR, or `git revert -m 1 <merge commit>`; each PR reverts on its own.
- **Which project?** At the time of writing two Cloudflare Pages projects (`zoebnomi` and `portfolio`) are connected to this repo and both post a preview on every PR (`zoebnomi` at `*.zoebnomi.pages.dev`, `portfolio` at `*.portfolio-a5z.pages.dev`). Roll back `zoebnomi` first (verify once in the Cloudflare dashboard; the `portfolio` project is the second connected project).

**Changes** reach `main` through a branch and a pull request, and CI (`.github/workflows/ci.yml`) must be green first. `main` is live.

Run `node scripts/geo-gate.mjs` against `dist/` before deploying: it is the last gate between an edit and production.

## Checks

All of these run in CI, in this order (`.github/workflows/ci.yml`): `npm ci`, `npm run build`, `npm run gate`, `npm run check`, `npm run lint`, then `npm run qa` and `npm run tokens` against a running preview, then `npm run a11y`, `npm run floor`, `npm run links`, `npm run lhci`, and `npm run audio:check`. `npm run budget` (home copy budget) runs locally.

- `npm run check`: `astro check` (types), then `scripts/design-check.mjs` (no palette hex or token declaration outside `design/tokens.css`, and no primitive colour read in `src/`).
- `npm run a11y`: axe on every built route at 390/768/1024/1440; fails on serious or critical.
- `npm run floor`: `scripts/text-floor.mjs` renders every route at 375px and fails on any visible text under 11px, SVG labels included (an SVG scaled into a phone column shrinks its text).
- `npm run links`: internal links, fragments and `_redirects` targets over `dist/` (`-- --external` checks outbound links).
- `npm run lhci`: Lighthouse CI on home, /builds/, /crosssource/ and /writing/, desktop and mobile: perf ≥ 90, a11y ≥ 95, SEO ≥ 95, CLS < 0.1.
- `npm run gate`: `scripts/geo-gate.mjs` against `dist/` (run `npm run build` first).
- `npm run lint`: `scripts/lint-source.mjs` reads `src/**/*.{astro,css}` and fails on a media query off the 599/600, 899/900, 1099/1100 grid, a raw colour outside `design/tokens.css`, a raw border width or style instead of a `--line-*` token, or a raw line-height, underline offset, hit-area height or font-size that has a token. Needs no build and no dependencies.
- `npm run qa`: `scripts/qa-sweep.mjs`: Playwright sweep of every page for horizontal overflow (14 widths from 360 to 1920px, including both sides of each breakpoint), axe violations (at 390, 768, 1024 and 1440), font-weight > 500, off-scale font sizes (warn only), console errors and 4xx/5xx requests. Needs a running site (`npx astro preview --host 127.0.0.1 --port 4321`, or set `BASE_URL`); report written to `.astro/qa-report.json`.
- `npm run tokens`: `scripts/tokens-audit.mjs`: the rendered site against the design tokens, at 1440, 1024 and 390. **Fails** on font-weight > 500 and on any text or background colour outside the palette; **warns** on font sizes outside the type tokens, line styles other than {1px ink, 1px rule, 2px red}, and border-radius other than 0. Same running-site requirement; report in `.astro/tokens-report.json`.

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

The home heatmap has two data paths:
- **Build time:** `scripts/fetch-contributions.mjs` (the `prebuild` step) scrapes the GitHub contributions calendar into `src/data/contributions.json`. The page server-renders that snapshot with the caption "… as of <date>". Commit the refreshed file when you mean to update the fallback.
- **Request time:** `functions/api/contributions.ts`, a Cloudflare Pages Function cached for 6 h at the edge (1 h in the browser), returns the live calendar. The page swaps it in and the caption becomes "… live from GitHub". If the function fails, the committed snapshot stays.

## Writing (essays)

Essays are hand-built `.astro` pages in `src/pages/writing/`, not Markdown and not a content collection. They keep their copy in `src/data/copy.ts` and render through `Base` → `EssayShell` (page head, byline, audio, the reading spine and related rows) → `EssayHeading` per section; the decisions-api essay uses `Masthead` and `Section`, which share the same look and the same spine (`src/scripts/reading.ts`). To add one:

1. **Copy**: add a `meta.<key>` entry (`title`, `description`) and an essay object (`kicker`, `title`, `dek`, `date` as ISO `YYYY-MM-DD`, `readingTime`, sections) to `src/data/copy.ts`. `Base` uses one `title` for both `<title>` and `og:title`, so keep it at 60 characters or fewer; keep the description at 155 or fewer. Use straight quotes and apostrophes.
2. **Page**: `src/pages/writing/<slug>.astro`. Give each `Section` an `anchorId` for a stable, human deep link (`#kyb`); without one its heading gets `sec-<label>`. Each section heading is an `h2`, so the page has one `h1` (the masthead) and no skipped levels.
3. **Index**: add the essay to the `essays` array in `src/pages/writing/index.astro`. The list is sorted by date, and each card's title, dek, date, reading time and narration length come from the essay's own data object, so there is no second copy to keep in step.
4. **llms.txt**: add the essay to the list in `src/pages/llms.txt.ts`.
5. **Sitemap**: add the URL to `src/data/lastmod.json` (and bump `/writing/`). A route with no entry gets no `lastmod`; the build date is never used.
6. **OG card**: add an entry to `scripts/generate-og.mjs` and run `node scripts/generate-og.mjs`. It re-renders every card with tiny byte differences, so commit only the PNGs you meant to change (`git checkout -- public/og/<other>.png`).
7. **Checks**: nothing to register: `qa` and `tokens` pick the page up from the sitemap (see above). Run build, gate, check, lint, qa and tokens.
8. **Audio (optional)**: see "Narration audio" below.

**Figures.** `EssayFigure` (a numbered, captioned frame with a source line) wraps `UnitChart` (one square per case), `BarList` (label / bar / value rows), `OwnershipGap` (a chain-of-ownership illustration), or the existing `DataTable`. They are built from HTML and hairlines, not SVG, so type stays on the token scale and above the 11px floor; the numbers in them come from the site's own harness pages and each figure links its source. For a wide text table on phones, render a stacked-card version below 900px (see Table 1 in `nobody-reports-the-misses.astro`).

**Animated figures.** The data figures move, calmly and once: `ForestPlot` (confidence intervals around zero, with the screener gap on the same scale), `Dumbbell` (a hollow start marker and a filled end marker), `UnitChart` (squares fade in), `ParserCompare` (two résumé versions, tick boxes grey one out) and `PlayerStepper` (a media-player explainer; its transcript is the figure when JavaScript is off). The rules:

- The default CSS is the final state, so a figure is complete with no script and with reduced motion. `src/scripts/figure-motion.ts` puts a figure in its start frame (`data-state="pre"`) and plays it once when it is on screen; pass `replay` to `EssayFigure` to get the small Replay link.
- Numbers are not typed twice. `src/lib/figureData.ts` reads them out of the case-study tables and paragraphs, and the build fails, naming the figure, if the wording changes so a number can no longer be read.
- Chart positions are unitless CSS variables (`--x`, `--l`, `--w`), not inline percentages: the geo-gate bans the string `85%` anywhere in the HTML, and a chart can land on it by chance.
- Lines come from the `--line-*` tokens, filled squares carry no border, and everything stays on the type tokens; `npm run tokens` and `npm run lint` check it.

## Design system ("The Pipeline") and accessibility conventions

The rules are in [`design/README.md`](design/README.md). `design/tokens.css` is the single source for colour, type, space, lines and motion; `src/styles/ds.css` is the shared kit every page uses; `src/scripts/ds.ts` is the runtime (theme toggle, reveals, the red spine, the verbs wave), built on IntersectionObserver and the Web Animations API. GSAP 3.12.5 and ScrollTrigger come from npm through `src/scripts/gsap.ts`, so only the pages whose own scripts animate with it download it. `scripts/design-check.mjs`, `scripts/lint-source.mjs` and `scripts/tokens-audit.mjs` enforce the tokens.

- **Theme**: dark graphite by default, a paper light theme on request. The header toggle sets `data-theme` on `<html>` and remembers it per visitor (`localStorage` key `ds-theme`, read before first paint). Print uses the light values.
- **Colour**: components read `--color-*` roles, never primitives. Red is the one accent: a CTA, the rule that opens a block, the arrow from before to after, a failure, the reading spine. Never body text, never a whole heading. Text that sits on red uses `--color-accent-fill`, which keeps AA contrast.
- **Type**: Archivo (variable width and weight) and IBM Plex Mono, both self-hosted. Labels are mono, uppercase, tracked. Floor 11px everywhere, checked at phone width by `npm run floor`.
- **Lines**: every border reads a `--line-*` token. Radius 0, no shadows.
- **Motion**: calm fades; numbers appear whole, never counted up; nothing pins the page without a visible Skip. Reduced motion shows the final state, and every word is in the HTML without JavaScript.
- **Breakpoints**: 599px, 899px and 1099px only.

Accessibility conventions (each finding from the review gates is a row in the Notion Findings Ledger):

- Standalone links and controls have a 24px minimum hit area (44px for a primary action, and for text links on touch screens). Inline links in running text are exempt.
- One `h1` per page and no skipped heading levels. Anchors land below the sticky header.
- Text drawn inside an SVG scales with the figure; when it would fall under 11px on a phone, the figure steps its sizes up below 600px or swaps to an HTML layout (the TradeFrame flow on /builds/, the Keka flow on home). `npm run floor` catches what slips through.
- Colour alone never carries state: the current page keeps its underline, focus rings stay visible inside clipping frames, and a failed audio load says so.
- A table or diagram that scrolls sideways becomes a named, focusable region only while it overflows (`src/scripts/ds.ts`).

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

`ContributionGraph.astro` renders a monochrome GitHub-style contribution heatmap. No page renders it in The Pipeline (the home page shows the agent harness instead), but the component, the snapshot and the Function below still build and deploy. It has three layers, in order of trust:

1. **Committed snapshot**: `src/data/contributions.json` is server-rendered into the page at build time, so the graph is a complete, correct picture with JS off and never disappears. It's regenerated automatically by the `prebuild` npm script (`scripts/fetch-contributions.mjs`), which runs before every `npm run build`.
2. **Live Function**: `functions/api/contributions.ts` is a Cloudflare Pages Function at `GET /api/contributions`. It fetches GitHub's public, unauthenticated, undocumented HTML endpoint (`https://github.com/users/zoeb-nomi/contributions`: the same markup a logged-out browser gets, no token, no cookies), parses it, and returns `{ source: "live", fetched_at, total_last_year, days }`. A small inline script on the page calls this on load and, if it succeeds, re-renders the cells and caption over the snapshot.
3. **Fallback**: if the live fetch or parse fails, the Function returns `503 { source: "unavailable" }` and the page just keeps showing the snapshot with an "as of \<date\>" caption. The client script never crashes or blanks the graph on a failed fetch.

Both the Function and the prebuild script share one parser: `functions/_lib/parse-contributions.mjs`. It's dependency-free: regex over GitHub's `<td class="ContributionCalendar-day" data-date data-level id>` cells and the matching `<tool-tip for="...">N contributions on Month Dth.</tool-tip>` elements, plus the "N contributions in the last year" total. `scripts/test-parse-contributions.mjs` (`npm test`) runs it against the real fixture at `tests/fixtures/contributions.html`.

**Caching**: the Function caches successful responses at Cloudflare's edge (`caches.default`, keyed on the request URL) and sets `Cache-Control: public, max-age=3600, s-maxage=21600`: a 1h browser cache, 6h edge cache. A `503` is cached for only 60s, so a transient GitHub outage doesn't wedge the "unavailable" response in for hours.

**Refreshing the snapshot**: `npm run build` does this automatically. To refresh it standalone, run `node scripts/fetch-contributions.mjs`: it writes `src/data/contributions.json` on success and, on any failure, prints a warning and leaves the existing file untouched (it never fails the build).

**Known risk**: this endpoint is public but **undocumented and unversioned**: GitHub can change the contribution-calendar markup at any time with no notice. If the parser starts throwing (both the Function's 503 rate and `npm test` failing are the signal), the fix is in `functions/_lib/parse-contributions.mjs`: re-capture `tests/fixtures/contributions.html` from a real page load and update the regexes to match the new shape.

**Auth note**: the endpoint's contribution count differs by viewer: an authenticated request (e.g. viewing your own profile logged in) includes private contributions; this Function's anonymous, cookie-free fetch only ever sees public ones, and that's the number the graph shows. Don't be surprised if it's lower than what you see logged into github.com yourself.
