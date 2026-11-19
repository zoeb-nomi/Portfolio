# LiveAudit

The home hero's object (Red Pen 5). A sheet with a prompt and a model answer; the answer
streams in, then the pen checks each claim: a tick for a claim that holds, a strike and a
caret with the correction above for a wrong fact, a circle for an invented citation. Each
mark has a leader line (wide screens) to its verdict in the margin, set in mono as
`check_name` and a short note. A tally closes the sheet; "Run it again" replays it.

- **Copy:** `home.v5.audit` in `src/data/copy.ts`. The answer is a list of segments; a
  segment with `mark` is a claim (`tick`, `strike` + `insert`, or `circle`) with its
  `check`, `note` and `verdict`. Every claim must be checkable against public record; the
  comment above the copy says what each was checked against.
- **Final state:** the marked-up sheet is the HTML. Without JS, CSS fallbacks draw a plain
  outline, a line-through and a ✓. Reduced motion: all marks drawn at once.
- **Motion:** stream (tokens in uneven bursts), mark, leader, stamp, tally. About 8 s.
- **Phones:** verdicts stack under the answer, no leaders.
- **Uses:** `src/scripts/pen.ts`.
