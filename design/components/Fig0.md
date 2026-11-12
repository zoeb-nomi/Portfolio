# Fig. 0 · AuditSheet

`src/components/AuditSheet.astro` · new in v3.3 (replaces `Fig0.astro`, the step figure of v3.0 to v3.2)

## What it is

The home hero's figure: one isometric sheet of 167 squares, ten across, one square per real model output that
a check read in the three public harnesses, drawn in three bands (CrossSource, mirror-eval, screener-eval) of
two groups each. A failed output is a red square lifted 7px off the paper with a short shadow back onto it; a
passed one is an outlined square. A second sheet sits under the first, set back and offset, carrying the drop
shadow, so the paper reads as a pad with thickness and the tilt has depth to move against.
The counts, the one-sentence summary for screen readers, the caption and the ledger strip under the H1 all
come from `src/data/fig0-cells.ts`, which reads them out of the case-study copy in `src/data/copy.ts` (the
same sentences and tables the case-study pages render) and fails the build if a sentence changes so a count
can no longer be read.

| group | squares | red | read from |
|---|---|---|---|
| CrossSource v0.1 · judge verdicts, hand-graded blind | 15 | 0 | `crosssource.s4.statQuote` "(15/15)" |
| CrossSource v0.3 · model labels under adjudication | 30 | 3 | `crosssource.s2.rows` "Adjudication": "27 of 30 matched the recommended label" |
| mirror-eval · Claude judge vs 40 blind human labels | 40 | 37 | `mirrorEval.s4.para1` "matched the exact tag set on 3" |
| mirror-eval · Gemini judge vs 40 blind human labels | 40 | 28 | `mirrorEval.s4.para1` "the Gemini judge on 12" |
| screener-eval · claude-haiku-4-5, verdict per posting over 5 runs | 21 | 6 | `screenerEval.s3.table2` "flipped" row, "6 of 21" |
| screener-eval · gpt-5-mini, verdict per posting over 5 runs | 21 | 12 | `screenerEval.s3.table2` "flipped" row, "12 of 21" |
| **total** | **167** | **86** | |

Only aggregates exist in the repo, so squares are grouped by outcome inside each group (failed squares last
in reading order) and the caption says so, as Fig. 1 on `/mirror-eval/` does. The sheet is ten columns wide, so every
group reads as a tally in tens (15 is a row and a half, 30 three rows, 40 four, 21 two and one) and a square is
at least 20px wide on a 390px phone.

## The strip

Under the H1, in the Readings style (Heavy top bar, kicker, numeral, datum line, source):
"Fig. 0 · The count · **86** of 167 outputs failed a check. All 86 caught before anything was published."
It lives in `src/pages/index.astro` (`.strip`, `data-fig0-strip`) and reads `strip` from `fig0-cells.ts`.

## Motion (`src/scripts/motion.ts`, Fig. 0)

1. Under `.motion` and before the figure has run, every square is paper-white: quiet failures look fine.
2. On load one 2px red scan line sweeps the sheet left to right in 1.1 s (`SWEEP` in motion.ts equals
   `--sweep` in the component). Each failed square flips red and lifts as the line reaches its column: a CSS
   transition delayed by `(column + 0.5) × --sweep / --cols`, so the line and the flips share one clock.
3. At 1.18 s the strip wipes in (clip-path, never a fade).
4. Replay, in the caption row, runs 1 to 3 again. It is `visibility: hidden` until `.motion` is set, so it
   keeps its box and nothing shifts.
5. The H1 text never animates. Reduced motion and no-JS show the final state (red squares, strip) at once.

## Interaction (in the component, works without the motion library)

- Tilt: the sheet follows a hovering, fine pointer (±14° about x, ±18° about z, clamped from the pointer's
  offset in the stage); never on touch, never under reduced motion.
- Readout: hovering a square, or arrowing to one from the single focusable group (role="group", tabindex=0;
  Arrow keys, Home, End, Escape), writes "harness · what it was · the check: outcome (count)" into the
  `aria-live` line under the sheet. The squares themselves are `aria-hidden`; the group's `aria-label` is the
  one-sentence summary. No square is a tab stop.

## Props

None.

## Used on

- `/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`). Red
  marks only the failed squares, the scan line, the Fig. number and Replay.
- Copy comes from `src/data/copy.ts` (frame labels) and `src/data/fig0-cells.ts` (everything with a number
  in it); nothing is typed into the component.
- Geometry: `--rx 52deg / --rz -10deg / --w 68%` from 900 up (the sheet fills the column; its band tags hang
  up to ~40px into the column gap, beside the short end of the H1 line), `48 / -8 / min(70%, 460px)` from 600
  to 899 with a 110px tag gutter on the left, `46 / -5 / 77%` under 600 (tags hidden; the sheet spans the
  viewport minus the gutters). The drawn sheet sits lower than its layout box because the far half recedes,
  so the sheet carries `margin-block: -26% -12%` and the stage stays tight. Measured at 390, 600, 768, 900,
  1024, 1200 and 1440: no horizontal overflow, no tag over text. Change one value, re-measure.
- The stage reserves its box (the sheet's layout box sets it; no JS changes its height); the readout reserves
  three lines. CLS on home is 0.
- Shadows: the design tokens say "no shadows"; Fig. 0 is the one exception, by decision (12 Nov 2026), for the
  under-sheet and the lifted red squares, both ink at 38–42% via `color-mix`, no new token.
