# HarnessPanel

## Purpose
Zoeb's agent harness, counted as it runs, on the home page and on the ink surface. Live activity and outcomes are
kept visibly apart, and a 14-day unit grid shows every task as a square. The numbers come from the agent ledger
(hq `00_infra/agent-ledger`), which every place an agent runs pushes a signed event to.

## Anatomy
- Bar: status. "Live, last event <time IST>" with a solid dot in the text colour, or "Last updated <date>" with a
  hollow dot in graphite once the newest event is more than 3 hours old.
- Today (`<dl>`): agent runs, subagent runs, a step smaller (`--t-h3`) than the outcomes.
- Outcomes: one line saying what "closed" means (done, or for harness work the PR opened), then a `<dl>`: closed in 7
  days (sub: total since 10 Nov), caught in 7 days (sub: total), all-in per task (sub: API only), review wait (sub:
  on time x/y and "to 19 Nov", because both are harness records, not live).
- Grid (`<figure>`): caption, an ordered list of 14 day columns (IST), ticks ("from 10 Nov" under the first day of
  data while it is in the window, "today" under the last), and an `aria-live` readout that shows the 14-day totals,
  or the selected day's counts. Squares: closed in the body text colour, caught in the pen (annotation only), the last
  7 columns on `--color-surface-raised`, days before the ledger starts as a short graphite line.
- "How these count": a closed disclosure with the definitions (outside home's copy budget), including that Claude
  app work counts only when its task closes.

## Data
`src/data/ledger-snapshot.json` is the HTML. `scripts/fetch-ledger.mjs` refreshes it in `prebuild` (timestamps
rounded to the hour; on any error it keeps the committed file). On load the script reads `${ledgerUrl}/v1/summary`
and, on zoebnomi.com only (the ledger refuses other origins), holds the WebSocket `/v1/live`; the ledger pushes a
summary on connect and on every event. Off the socket it polls once a minute while the tab is visible, at most 30
times, and stops polling as soon as a socket frame arrives. A refusal (429, 5xx, network) pauses all requests for 10
minutes. Returning to the tab refetches at most once per 30 s, which also rolls "today" over. Every value is
validated and the grid is rebuilt with `createElement`, never `innerHTML`; any error leaves what is on screen.

## Props
None. Content from `home.v5.harness` in `src/data/copy.ts` and the snapshot JSON.

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-surface-raised`, `--color-accent`, `-accent-text`,
  `--color-pending`.
- Type: `--font-heading`, `--font-data`, `--wght-claim`, `--wdth-tight`, `--track-display`, `--t-num`, `--t-h3`,
  `--t-small`, `--t-label`, `--lh-snug`.
- Space and lines: `--s-1` to `--s-13`, `--line-hair`, `--line-object`, `--hit-min`, `--hit-touch`,
  `--underline-offset`.

## States and motion
- It is `.surface-ink` itself, so the roles resolve to the ink-surface values.
- No motion: no count-up (the tally captures its value at load and would rewind a live number) and no pulse (red is
  the only thing that moves on its own, and only to mark).
- Hover or focus on a day lifts its closed squares to `--color-text` and writes its counts into the readout.
- The grid reserves its height from the snapshot's busiest day, so live data rarely moves the page.
- Squares: 8px at 1100+, 6px from 900, 5px (two per row) under 900.

## Accessibility
Every number is text. The grid is one tab stop (roving `tabindex`); Left, Right, Home and End move between days, each
with an `aria-label` ("17 Nov: 32 closed, 8 caught"). The readout is `aria-live="polite"`. Squares are `aria-hidden`.

## Used on
Pages: `/`, `/design/components/`.
