# CareerTimeline

## Purpose
The About record as a vertical timeline, newest first. Dates left, a spine in the middle, organisation as the headline, then role and detail, then a source link if one exists.

## Anatomy
`<ol>` of items: `.tl-when` (year), `.tl-mark` (aria-hidden), and `.tl-what` with an `<h3>` organisation, a role line and an optional source link. A row with no source shows none: it is a claim on trust. Each `body` string is split on " · " and the first comma, so the copy stays one string.

## Props
| prop | type | notes |
|---|---|---|
| `items` | `Item[]` | `year` ("2019", "2021-2022", "2025-present"), `body`, `source` (`{label, href}` or null). A year that does not parse throws at build time |

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-surface`, `-accent`, `--color-link` (source links).
- Type and space: `--font-heading`, `--font-text`, `--font-data`, `--wght-head`, `--wdth-head`, `--t-h3`, `--t-body`, `--t-note`, `--t-label`, `--track-tight`, `--track-wide`, `--lh-*`, `--s-1` to `--s-9`, `--measure`, `--underline-offset`.
- Lines: `--line-hair` (spine), `--line-pen` (the filled spine), `--line-object` (marker).

## States and motion
- Without script: everything fully lit and still.
- With script (and motion allowed): `--p` scales the pen-weight spine from the top as you scroll; markers go from hollow to `--color-text` once reached; the current entry's marker is `--color-accent`; entries not yet reached are `--color-text-muted`.
- Reduced motion: `motionAllowed()` is false, so the live state is never set.
- Ink surface: roles re-point, unchanged.

## Accessibility
Real ordered list and `<h3>` per organisation; the markers are decorative. Source links open in a new tab with `rel="noopener noreferrer"`. At 899px and below the date column collapses.

## Used on
Pages: `/about/`.
