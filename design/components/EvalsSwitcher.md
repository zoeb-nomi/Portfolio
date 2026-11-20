# EvalsSwitcher

## Purpose
A small switcher for the three eval case studies: a row of kit tags, the current one red. It lets a reader jump between CrossSource, mirror-eval and screener-eval. The case-study pages now use `CaseTabs`; this one is reachable only through `Masthead`'s `switcher` prop.

## Anatomy
`nav.evals-switch` (labelled) with a `.lab` and `ul.tags`: each item is `a.tag`, and the current one is `span.tag.red[aria-current="page"]`.

## Props
| prop | type | notes |
|---|---|---|
| `current` | `'CrossSource' \| 'mirror-eval' \| 'screener-eval'` | the page being read |

Names, links and the nav label come from `evalsSwitcher` and `evalsSwitcherLabel` in `copy.ts`.

## Variants
None.

## Kit classes
`.lab`, `.tags`, `.tag`, `.tag.red`.

## Motion
None. Hover fades the border and text; no script.

## Accessibility
A labelled `<nav>`; the current item is not a link and carries `aria-current="page"`.

## Light and dark
Roles only; the red tag uses `--color-accent` for border and text.

## Used on
`Masthead` (when `switcher` is passed). No page passes it at the time of writing.
