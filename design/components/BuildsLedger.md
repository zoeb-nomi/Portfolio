# BuildsLedger

`src/components/BuildsLedger.astro` · new in v3

![BuildsLedger](../mocks/2026-11-12-v3/components/BuildsLedger.jpg)

Variant `compact`:

![BuildsLedger compact](../mocks/2026-11-12-v3/components/BuildsLedger-compact.jpg)

Variant `feature`:

![BuildsLedger feature](../mocks/2026-11-12-v3/components/BuildsLedger-feature.jpg)

## What it is

BuildsLedger (DESIGN v3 D-08, SPEC #17/#20-22): one row per build, booktabs
(Heavy above and below, Ink under the head, Hair between rows). Red only on
the verdict tag and the links.

variant="full"     /builds/: # · Build · Guarded · Measured · Shipped at
>=1100px; each row stacks into label/value pairs below.
variant="compact"  home §2: # · Build · Measured, rows with `compact: true`.
variant="feature"  /builds/ §1 first row (TradeFrame): head, the decision
path figure, then Guarded / Measured / Shipped cells.

Rows are native <details>: tap, click or Enter opens the row's panel (its
result figure, its guard, its ship date and the case-study action) with no
script at all. The motion layer adds hover-to-open on fine pointers and
animates the panel height; the content is always in the HTML.

## Props

```ts
  variant?: 'full' | 'compact' | 'feature';
  entries?: BuildEntry[];
  /** Number shown in the # column for the first row. */
  start?: number;
```

## Used on

- `/`
- `/builds/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
- Motion: the final state is in the HTML; the pre-reveal state lives in CSS under `.motion` and the motion layer (`src/scripts/motion.ts`) plays it. Reduced motion shows the final state.
