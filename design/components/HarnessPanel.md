# HarnessPanel

## Purpose
Zoeb's agent harness, counted as it runs, on the home page and on the ink surface. Live activity and outcomes are
kept visibly apart, and a 14-day unit grid shows every task as a square. The numbers come from the agent ledger
(hq `00_infra/agent-ledger`), which every place an agent runs pushes a signed event to.

## Anatomy
- Bar: status (dot plus "Live, last event <time IST>", or "Last updated <date>" in graphite when the newest event is
  more than 3 hours old) and a "more" link.
- Running today (`<dl>`): agent runs today, subagent runs today.
- Outcomes (`<dl>`): tasks closed in the last 7 days (sub: total since 10 Nov), caught before merge in the last 7 days
  (sub: total), all-in cost per closed task, median wait for Zoeb's review. A note line carries API-only cost and
  on-time (x of y).
- Grid (`<figure>`): caption and key, an ordered list of 14 day columns (IST), each a stack of 6px squares: closed in
  the body text colour, caught in the pen (annotation only). Each column is focusable; its detail ("20 Nov: 4 closed,
  0 caught") goes to an `aria-live` readout and is also its `aria-label`. First and last dates under the axis.
- App note: Claude app work counts only when its Notion task closes.

## Data
The committed snapshot `src/data/ledger-snapshot.json` (a copy of the ledger's `/v1/summary`) is the HTML. On load
the script reads `${ledgerUrl}/v1/summary`, then holds the WebSocket `/v1/live`; the ledger pushes a summary on
connect and on every event. If the socket cannot open or drops, it polls the summary once a minute while the tab is
visible, and refetches when the tab becomes visible (so "today" rolls over). Every value is validated (finite,
non-negative numbers, ISO dates) and the grid is rebuilt with `createElement`, never `innerHTML`. Any error leaves
what is on screen. `home.v5.harness.ledgerUrl` empty = no fetch.

## Props
None. Content from `home.v5.harness` in `src/data/copy.ts` and the snapshot JSON.

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `--color-accent`, `-accent-text`, `--color-pending`.
- Type: `--font-heading`, `--font-data`, `--wght-claim`, `--wdth-tight`, `--track-display`, `--t-num`, `--t-small`,
  `--t-label`, `--lh-snug`.
- Space and lines: `--s-1` to `--s-13`, `--line-hair`, `--line-object`, `--hit-touch`, `--underline-offset`.
  Motion: `--ease-draw`.

## States and motion
- It is `.surface-ink` itself, so the roles resolve to the ink-surface values.
- Live: the status dot pulses (`hp-pulse`, 1200 ms alternating) only while the newest event is recent.
- No count-up (`data-tally`): the tally captures its final value at page load and would rewind a live number.
- Hover or focus on a day lifts its closed squares to `--color-text` and writes its detail into the readout.
- Under 900px the tiles go two across and the squares shrink to 5px, two per row.

## Accessibility
Every number is text. Day columns are list items with `tabindex="0"`, a visible `:focus-visible` and an
`aria-label`; the readout is `aria-live="polite"`. Squares are `aria-hidden`. Nothing is hidden while data loads.

## Used on
Pages: `/`, `/design/components/`.
