# EvalsSwitcher

`src/components/EvalsSwitcher.astro` · changed in v3

![EvalsSwitcher](../mocks/2026-11-12-v3/components/EvalsSwitcher.jpg)

## What it is

Margin-column switcher on /crosssource and /mirror-eval: lets a reader on
one case study jump to the other without going back through nav. Three
line tiers only: --rule for the divider above it, --red-ink for the
current item (no new colors).

## Props

```ts
  current: 'CrossSource' | 'mirror-eval' | 'screener-eval';
```

## Used on

- (not rendered by any page; kept for reuse)

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
