# OwnershipGap

## Purpose
An illustration (not data): the ownership chart from the KYB example. It reads as complete because nothing on it is wrong; the red node is what never made it onto the page.

## Anatomy
An ordered list of boxed nodes joined by hairlines. Each node has a label and an optional mono mark; a `missing` node is drawn in red text with a dashed outline. Built from boxes and lines, not SVG, so type stays on the site's scale.

## Props
| prop | type | notes |
|---|---|---|
| `nodes` | `{label, mark?, missing?}[]` | `missing` flags the absent node |

## Tokens it reads
- Colour roles: `--color-text`, `--color-text-muted`, `--color-accent-text` (missing node).
- Type and space: `--font-data`, `--t-micro`, `--t-data`, `--track-wide`, `--s-1`, `--s-3`, `--s-4`, `--s-6`.
- Lines: `--line-object`, `--line-ink`, `--line-pen-dashed`.

## States and motion
Static: no script, no animation. Reduced motion and ink surface change nothing (roles re-point).

## Accessibility
A real `<ol>`; the visible text carries the meaning, so the missing node is also identified in the surrounding copy, not by colour alone.

## Used on
Pages: `/writing/nobody-reports-the-misses/`.
