# BuildsLedger

## Purpose
One row per build, set as a booktabs table: Heavy rule above and below, Ink under the head, Hair
between rows. Red text only on the tag, links, the replay control and the hovered/open row name.

## Anatomy
- `full` (/builds/): index, build (name, tag, one line), Guarded, Measured, Shipped at 1100px and up; below that each row stacks into label/value pairs.
- `compact`: index, build, Measured; shows entries with `compact: true` and prefers `homeLine`.
- `feature`: an `<article>` per entry: head, the `TradeFrameFlow` decision path, then a Guarded / Measured / Shipped `<dl>`.
- Rows are native `<details>`: the summary is the row, the panel holds the result figure, guard, ship date and case-study action.
- A `strip` TradeFrameFlow stands in as the Measured cell for entries with `figure.kind === 'flow'`.

## Props
| prop | type | notes |
|---|---|---|
| `variant` | `'full' \| 'compact' \| 'feature'` | default `full` |
| `entries` | `BuildEntry[]?` | default: `buildsLedger` (compact: only `compact: true` rows) |
| `start` | `number?` | number shown for the first row, default 1 |

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-accent`, `-accent-text`, `--color-link` (links).
- Type: `--font-heading`, `--font-data`, `--wght-head`, `--wdth-head`, `--track-tight`, `--t-label`, `--t-small`, `--t-body`, `--t-num`, `--t-h2`, `--t-h3`, `--lh-*`.
- Lines and space: `--line-heavy`, `--line-ink`, `--line-hair`, `--line-object`, `--line-object-muted`, `--s-1` to `--s-8`, `--hit-touch`, `--hit-min`.
- Motion: `--dur-fast`, `--dur-base`, `--ease-draw`.

## States and motion
- Hover or open row: name turns `--color-accent-text`, the plus toggle gets an `--color-accent` border and rotates when open.
- Reveal: rows under `[data-ledger]` fade in as the ledger enters view (`.motion` pre-state in `src/styles/motion.css`, `motion.ts`). The panel height animates on click or tap only (no hover-open).
- Reduced motion or no script: all rows visible, panels open and close natively.
- Ink surface: roles re-point, no change needed.

## Accessibility
- `<details>/<summary>` gives keyboard and screen-reader behaviour with no script; summary has a visible `:focus-visible` style.
- Row links use `aria-describedby` to the build name; external links open with `rel="noopener noreferrer"`.
- The replay button is `hidden` until script runs and has `aria-controls`.

## Used on
Pages: `/builds/`.
Only the `feature` and `full` variants are used; `compact` has no caller.
