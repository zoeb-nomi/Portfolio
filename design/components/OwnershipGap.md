# OwnershipGap

## Purpose
An illustration, not data: the ownership chart from the KYB example. It reads as complete because nothing on it is wrong; the red dashed node is what never made it onto the page. It is built from boxes and hairlines so the type stays on the site's scale.

## Anatomy
`ol.og` of `li.og-node` (label, optional mono `.og-mark`); a node with `missing` is the red dashed one.

## Props
| prop | type | notes |
|---|---|---|
| `nodes` | `{label, mark?, missing?}[]` | in reading order |

## Variants
`missing: true` on one node.

## Kit classes
Own `og-*` classes only; borders are `--line-strong`, the missing node uses `--line-accent` and the accent for its text. Sits in an `EssayFigure`.

## Motion
None. No script.

## Accessibility
The visible text carries the meaning (the missing node says it is missing), so nothing depends on colour or dashes. A real ordered list.

## Light and dark
Roles only; the red dashed node reads on both grounds.

## Used on
`/writing/nobody-reports-the-misses/`.
