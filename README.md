# zoebnomi.com — portfolio site

Source of [zoebnomi.com](https://zoebnomi.com/?utm_source=github&utm_medium=readme&utm_campaign=portfolio), the personal site of **Zoeb Nomi** — AI Product Manager focused on eval-driven LLM/RAG output quality.

Built with Astro 5. All copy, meta, JSON-LD and llms.txt live in `src/data/copy.ts`. `scripts/geo-gate.mjs` gates the site against canon (46 required strings, 6 banned) — run it after every edit.

Keystone project: [CrossSource](https://github.com/zoeb-nomi/crosssource) — eval methodology for RAG citation quality (precision 0.981 → 0.994, ~95% golden-set citation accuracy, 270K-record corpus).

## Deploy & rollback

Hosted on Cloudflare Pages. Build command `npm run build`, output directory `dist/`. Requires Node >= 20 (see `.nvmrc`).

- **Production** — every commit to `main` builds and auto-deploys. There is no staging environment.
- **Previews** — commits on any other branch get their own preview deployment at a generated URL.
- **Rollback** — Cloudflare Pages → the project → **Deployments** → find the last good build → **Rollback to this deployment**. This repoints production immediately without a rebuild. Alternatively revert the offending commit on `main` and let the normal build redeploy.

Run `node scripts/geo-gate.mjs` against `dist/` before deploying — it is the last gate between an edit and production.

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
