# EvalsSwitcher

## Purpose
A margin-column list that lets a reader of one case study jump to the others without going back through the nav.

## Anatomy
A label (`evalsSwitcherLabel`) and a list built from `evalsSwitcher` in `src/data/copy.ts`. The current study is a non-link marker with an arrow; the others are links.

## Props
| prop | type | notes |
|---|---|---|
| `current` | `'CrossSource' \| 'mirror-eval' \| 'screener-eval'` | the study being read; matched against each entry's `name` |

## Tokens it reads
- Colour roles: `--color-text-muted` (label), `--color-text-body` (links), `--color-link` (link hover state and links), `--color-accent-text` (current marker).
- Type and space: `--font-data`, `--t-micro`, `--t-label`, `--s-1`, `--s-3`, `--s-5`, `--s-6`, `--underline-offset`, `--hit-min`.
- Lines: `--line-hair` (divider above).

## States and motion
- Hover on a link changes colour only. The current marker has `view-transition-name: evals-switch-current`, so it moves between case-study pages with a view transition.
- Reduced motion: a `prefers-reduced-motion` block is present. Ink surface: roles re-point.

## Accessibility
The current item carries `aria-current="page"` (the arrow is `aria-hidden`). Links meet the 24px target rule (`--hit-min`).

## Used on
Also via: `Masthead`.
Rendered in the Masthead margin when its `switcher` prop is set.
