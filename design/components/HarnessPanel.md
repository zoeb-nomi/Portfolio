# HarnessPanel

## Purpose
A small dashboard of Zoeb's agent harness on the home page: four tiles and a bar per recent item, on the ink surface. It shows work he hands to a system, with the numbers readable as text.

## Anatomy
- Bar: a status line (dot plus snapshot or live label) and a "more" link.
- Tiles (`<dl>`): value with optional unit (`data-tally`) and label, from `shipping.tiles`.
- Items figure: a caption, an ordered list of bars (kind, track scaled to the largest, agent minutes; each row is focusable with the full detail in `data-detail`) and an `aria-live` readout line showing the hint or the focused row's detail.
- Data: the committed snapshot (`shipping` in `copy.ts`) is the HTML. On load a script fetches `home.v5.harness.liveUrl` and swaps in tile values and the label if the file parses; a failed fetch leaves the snapshot.

## Props
None. Content from `home.v5.harness` and `shipping` in `src/data/copy.ts`.

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-surface`, `--color-accent`, `-accent-text`, `--color-pending`.
- Type: `--font-heading`, `--font-data`, `--wght-claim`, `--wdth-tight`, `--track-display`, `--t-num`, `--t-small`, `--t-label`, `--lh-snug`.
- Space and lines: `--s-2` to `--s-8`, `--line-hair`, `--line-object`, `--hit-touch`, `--hit-min`, `--underline-offset`. Motion: `--dur-fast`, `--ease-draw`.

## States and motion
- It is `.surface-ink` itself, so the roles resolve to the ink-surface values.
- Hover or focus on a row turns its bar fill to `--color-accent` and writes its detail into the readout; leaving restores the hint.
- Live state: the status dot pulses (`hp-pulse`, 1200 ms alternating) only after live data loads. Tiles tally (`data-tally`, motion layer) to the HTML value.
- Under 900px it restacks. Reduced motion: the global rule in `src/styles/base.css` collapses the pulse and transitions; the numbers are already final.

## Accessibility
Bars are list items with `tabindex="0"` and a visible `:focus-visible`; the readout is `aria-live="polite"`. Every number is text; the fetch never hides content while it waits.

## Used on
Pages: `/`, `/design/components/`.
