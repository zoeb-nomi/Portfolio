# ContributionGraph

## Purpose
A month-labelled, GitHub-style contribution heatmap, drawn in the ink ramp and never in green. It renders the committed snapshot so it works with JS off, then tries live data.

## Anatomy
`.cg[data-contrib-graph]`: `.cg-kicker`, a scrollable region (`.cg-scroll`, tabbable) holding a weekday column and `.cg-grid` (`role="img"`, a month-label row and one `.cg-cell` per day, `data-level` 0 to 4, `title` "N contributions on <date>"), then `.cg-footer` with the caption (a reserved-width total plus the snapshot or live note) and a Less / More legend.

## Props
None. Data from `src/data/contributions.json` (refreshed by `scripts/fetch-contributions.mjs`) and the `contributions` copy block.

## Variants
None.

## Kit classes
Own `cg-*` classes; colour comes from the heat ramp `--heat-0` to `--heat-4` (derived from the ink and rule primitives in `tokens.css`), `--color-text-muted` and `--color-surface`. No rounded corners (`--radius`).

## Motion
Static. The script scrolls the grid to the most recent weeks on narrow screens and, if `/api/contributions` answers, updates the cell levels and caption in place without moving the layout. A `.cg-pulse` outline on the latest week is defined in the CSS but nothing currently adds the class.

## Accessibility
The grid is `role="img"` with a one-line summary label; cells carry titles. The scroll region is focusable and labelled. The total has a reserved width so the caption never shifts.

## Light and dark
The heat ramp is mixed from the ink and background primitives, so it inverts with the theme: more contribution is more ink in both.

## Used on
Not imported by any page or component at the time of writing. Its data script and copy still exist.
