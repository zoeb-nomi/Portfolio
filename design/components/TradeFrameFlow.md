# TradeFrameFlow

`src/components/TradeFrameFlow.astro` · new in v3

![TradeFrameFlow](../mocks/2026-11-12-v3/components/TradeFrameFlow.jpg)

## What it is

"Who decides what runs" (DESIGN v3 D-09, Take B B-12/B-23): TradeFrame's
decision path. Dashed node = proposes only; solid = decides (D-16).
variant="full"   /builds/ feature row: the nodes, the books, kill switch and ledger.
variant="strip"  home compact ledger: the four step labels on one line.
Every label is printed in the HTML. When the figure enters view the motion
layer lights the path once, step by step (propose -> validate -> confirm ->
execute and record), then clears; Replay plays it again.

## Props

```ts
  variant?: 'full' | 'strip';
  id?: string;
  /** Strip only: render its own Replay button (false inside a <summary>, where the row panel carries it). */
  replay?: boolean;
```

## Used on

- (not rendered by any page; kept for reuse)

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
- Motion: the final state is in the HTML; the pre-reveal state lives in CSS under `.motion` and the motion layer (`src/scripts/motion.ts`) plays it. Reduced motion shows the final state.
