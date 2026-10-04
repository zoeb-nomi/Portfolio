# zoebnomi.com — portfolio site

Source of [zoebnomi.com](https://zoebnomi.com/?utm_source=github&utm_medium=readme&utm_campaign=portfolio), the personal site of **Zoeb Nomi** — AI Product Manager focused on eval-driven LLM/RAG output quality.

Built with Astro 5. All copy, meta, JSON-LD and llms.txt live in `src/data/copy.ts`. `scripts/geo-gate.mjs` gates the site against canon (74 required strings, 11 banned) — run it after every edit.

Keystone project: [CrossSource](https://github.com/zoeb-nomi/crosssource) — eval methodology for RAG citation quality (precision 0.981 → 0.994, ~95% golden-set citation accuracy, 270K-record corpus).

## Deploy & rollback

Hosted on Cloudflare Pages. Build command `npm run build`, output directory `dist/`. Node version is pinned in `.nvmrc` (22; `engines` allows >= 20).

- **Production** — every commit to `main` builds and auto-deploys. There is no staging environment.
- **Previews** — commits on any other branch get their own preview deployment at a generated URL. Previews send `X-Robots-Tag: noindex`.
- **Rollback** — Cloudflare Pages → the project → **Deployments** → find the last good build → **Rollback to this deployment**. This repoints production immediately without a rebuild. Alternatively revert the offending commit on `main` and let the normal build redeploy.
- **Which project?** At the time of writing two Cloudflare Pages projects (`zoebnomi` and `portfolio`) are connected to this repo and both post a preview on every PR. Check in the dashboard which one owns the `zoebnomi.com` domain before following the rollback steps.

**Publish rule** — `main` is live and only Zoeb merges to it. Zoeb commits via the GitHub web UI; Claude does not push to `main` or merge, and does not push at all unless Zoeb explicitly asks in that session, in which case it pushes a feature branch and opens a **draft** PR for him to review. Every change goes through a branch and PR, and CI (`.github/workflows/ci.yml`) must be green first.

Run `node scripts/geo-gate.mjs` against `dist/` before deploying — it is the last gate between an edit and production.

## Checks

All of these run in CI, in this order (`.github/workflows/ci.yml`): `npm ci`, `npm run build`, `npm run gate`, `npm run check`, then `npm run qa` and `npm run tokens` against a running preview.

- `npm run check` — `astro check` (types).
- `npm run gate` — `scripts/geo-gate.mjs` against `dist/` (run `npm run build` first).
- `npm run qa` — `scripts/qa-sweep.mjs`: Playwright sweep of every page for horizontal overflow (360–1920px), axe violations (at 390 and 1440), font-weight > 500, off-scale font sizes (warn only), console errors and 4xx/5xx requests. Needs a running site (`npx astro preview --host 127.0.0.1 --port 4321`, or set `BASE_URL`); report written to `.astro/qa-report.json`.
- `npm run tokens` — `scripts/tokens-audit.mjs`: the rendered site against the design tokens, at 1440 and 390. **Fails** on font-weight > 500 and on any text or background colour outside the palette; **warns** on font sizes outside the type tokens, line styles other than {1px ink, 1px rule, 2px red}, and border-radius other than 0. Same running-site requirement; report in `.astro/tokens-report.json`.

**Both sweeps use a hard-coded list of pages** (`PAGES` at the top of `scripts/qa-sweep.mjs` and `scripts/tokens-audit.mjs`). A new page is not checked until it is added to both.

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
3. **Index** — add the entry to `posts` in `src/pages/writing/index.astro`, newest first.
4. **llms.txt** — add the essay to the list in `src/pages/llms.txt.ts`.
5. **Sitemap** — add the URL to `src/data/lastmod.json` (and bump `/writing/`). A route with no entry gets no `lastmod`; the build date is never used.
6. **OG card** — add an entry to `scripts/generate-og.mjs` and run `node scripts/generate-og.mjs`. It re-renders every card with tiny byte differences, so commit only the PNGs you meant to change (`git checkout -- public/og/<other>.png`).
7. **Checks** — add the URL to `PAGES` in `scripts/qa-sweep.mjs` and `scripts/tokens-audit.mjs` (see above), then run build, gate, check, qa and tokens.

**Figures.** `EssayFigure` (a numbered, captioned frame with a source line) wraps `UnitChart` (one square per case), `BarList` (label / bar / value rows), `OwnershipGap` (a chain-of-ownership illustration), or the existing `DataTable`. They are built from HTML and hairlines, not SVG, so type stays on the token scale and above the 11px floor; the numbers in them come from the site's own harness pages and each figure links its source. For a wide text table on phones, render a stacked-card version below 900px (see Table 1 in `nobody-reports-the-misses.astro`).

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
