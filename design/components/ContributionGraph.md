# ContributionGraph

`src/components/ContributionGraph.astro` · unchanged in v3

![ContributionGraph](../mocks/2026-11-12-v3/components/ContributionGraph.jpg)

## What it is

A month-labelled GitHub-style contribution heatmap. Server-renders the
committed snapshot (src/data/contributions.json) so it works with JS off
and never disappears; a small inline script then tries /api/contributions
and re-renders with live data on success, updating the caption to match.

Monochrome by design (§6 tokens in tokens.css): never GitHub green.
Place each day into a Sun-Sat week grid: row = weekday (0=Sun..6=Sat),
column = weeks elapsed since the Sunday on/before the first day.
Month labels: one per column where the month changes from the previous
labelled column, with a minimum 3-column gap so short months don't crowd.

## Props

None.

## Used on

- `/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
