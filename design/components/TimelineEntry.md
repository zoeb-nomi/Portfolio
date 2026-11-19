# TimelineEntry

## Purpose
One role on the About record: company, role, dates, a short standfirst and achievements with the canon metrics set in bold.

## Anatomy
- Margin column: optional logo (decorative, `alt=""`), date range, role, optional `MarginNote` from `note`, `margin` slot.
- Body column: company heading, descriptor, standfirst, `video` slot, achievements (optional kicker plus text), `record` slot (for a `RecordList`).
- Metrics: strings listed in `metrics` are wrapped in `<strong class="metric">` by `renderMetrics`, and only those; nothing is auto-detected.

## Props
| prop | type | notes |
|---|---|---|
| `company`, `role`, `dateRange` | `string` | |
| `descriptor`, `standfirst` | `string \| null?` | |
| `achievements` | `Achievement[]` | `kicker`, `text`, `metrics?` |
| `primary` | `boolean?` | larger company heading and body for the current role |
| `logo` | `{src, width, height} \| null?` | |
| `note` | `string \| null?` | margin note |
| `headingLevel` | `'h2' \| 'h3'` | default `h2`; About uses `h3` |
Slots: `margin`, `video`, `record`.

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`.
- Type: `--font-heading`, `--font-text`, `--font-data`, `--wght-head`, `--wdth-head`, `--track-wide`, `--t-h2`, `--t-display-xl`, `--t-body`, `--t-label`, `--lh-prose`, `--lh-label`, `--measure`.
- Space and lines: `--s-2` to `--s-11`, `--line-ink`, `--line-hair`.

## States and motion
Static: no script, no animation. Reduced motion changes nothing. Ink surface: roles re-point. Stacks at 899px and below.

## Accessibility
Configurable heading level; the logo is `aria-hidden`; the metric emphasis is bold text, not colour.

## Used on
Pages: `/about/`.
