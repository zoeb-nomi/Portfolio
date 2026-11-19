Status: unused on the site (kept for reference)

# ContributionGraph

## Purpose
A month-labelled, monochrome contribution heatmap (never GitHub green). The committed snapshot renders on the server; a script may refresh it from `/api/contributions`.

## Anatomy
- Kicker, then a focusable scroll region holding weekday labels and a `role="img"` grid of cells (one per day, `data-level` 0 to 4, `title` per cell) with month labels above.
- Footer: caption with the total (`data-cg-total`, width reserved so a count-up never shifts it) and a Less/More legend.

## Props
None. Data comes from `src/data/contributions.json` (`days`, `total_last_year`, `fetched_at`); copy from `contributions` in `src/data/copy.ts`.

## Tokens it reads
- Colour roles: `--color-text-muted`, `--color-surface`.
- Heat scale: `--heat-0` to `--heat-4` (tokens, not roles).
- Type and space: `--font-data`, `--t-micro`, `--t-label`, `--s-1`, `--s-3`, `--s-4`, `--radius`, `--line-pen`, `--ease-draw`.

## States and motion
- Script fetches live data and re-renders levels and caption; on failure the snapshot stays.
- Narrow screens scroll to the latest ~26 weeks.
- Reveal and tally: cells wipe in under `[data-contrib-graph]` (`src/styles/motion.css`), the total counts up, and the latest week gets one pen-weight outline pulse (`cg-pulse`, 1200ms). Reduced motion renders the final state.
- Ink surface: the heat tokens do not re-point (see the report).

## Accessibility
The grid carries an `aria-label` summary; the scroll region is `tabindex="0"` with a label. Weekday labels and legend are `aria-hidden`.

## Used on
No page imports it.
