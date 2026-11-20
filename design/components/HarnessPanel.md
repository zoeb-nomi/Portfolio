# HarnessPanel

## Purpose
Zoeb's agent harness, counted as it runs: the home page's live band. It shows the task path (Filed, Agent runs, Checked, My review, Closed), what closed and what was caught, and a 14-day grid with one square per task. Numbers come from the agent ledger (hq `00_infra/agent-ledger`), which every place an agent runs pushes a signed event to. This is the rewritten Pipeline panel (`.hz`); the band around it (heading, ground) belongs to the page.

## Anatomy
- `.hz-bar`: status. "Live, last event <time IST>" with a red square, or "Last updated <date>" with a muted square once the newest event is more than 3 hours old.
- `ol.hz-flow`: five numbered steps (`.st`, a square node on a rail; Checked and My review have red nodes) and a dashed `.catch` branch, "caught before merge". Step 2 holds today's live agent runs, step 4 the median review wait, step 5 the closed total.
- `dl.hz-tiles`: closed in 7 days (sub: total since the start date), caught in 7 days (red, sub: total), all-in cost per task (sub: API only), on time x / y.
- `figure.hz-g`: caption (`.v-cap`), `ol.hz-days` of 14 day columns (IST), ticks ("from 10 Nov", "today") and an `aria-live` readout line showing the 14-day totals or the focused day's counts.
- `details.hz-how`: "How these count", closed by default, with the definitions.

## Data
`src/data/ledger-snapshot.json` is the HTML. `scripts/fetch-ledger.mjs` refreshes it in `prebuild` (on any error the committed file stays). On load the script reads `${ledgerUrl}/v1/summary` and, on zoebnomi.com only (the ledger refuses other origins), opens the WebSocket `/v1/live`. Elsewhere, or off the socket, it polls once a minute while the tab is visible, at most 30 times, and stops as soon as a socket frame arrives. A refusal pauses requests for 10 minutes; returning to the tab refetches at most once per 30 s, which also rolls "today" over. Every value is validated (finite, non-negative numbers; ISO dates) and the grid is rebuilt with `createElement`, never `innerHTML`; any error leaves what is on screen.

## Props
None. Copy from `home.v5.harness` and `pipelineHome.harness` in `src/data/copy.ts`, plus the snapshot JSON.

## Variants
None. Live or stale status; days before the ledger starts show a short line instead of squares.

## Kit classes
`.v-cap`, `.lab`, and the `hz-*` classes (own CSS). Squares: closed in `--color-text-body`, caught in `--color-accent`, the last 7 columns on a faint text tint, pre-ledger days a `--line-strong` dash.

## Motion
No count-up and no pulse. A changed digit goes through `swap()` in `ds.ts`: instant, with one 220ms opacity tick. Hover or focus on a day lifts its closed squares to `--color-text` and writes its counts into the readout. The grid reserves its height from the busiest day, so live data rarely moves the page. Each day stacks its squares two per row, 6px each (4px under 600px); under 900px the panel and the flow stack vertically.

## Accessibility
Every number is text. The grid is one tab stop (roving `tabindex`); Left, Right, Home and End move between days, each with an `aria-label` ("17 Nov: 32 closed, 8 caught"). The readout is `aria-live="polite"`. Squares are `aria-hidden`. The disclosure is a native `details`.

## Light and dark
Roles only, so both themes are complete: the red nodes, the caught squares and the live status take the theme's accent (a deeper red on paper); the week tint uses the text role at low opacity, so it works on both grounds.

## Used on
`/` (home band).
