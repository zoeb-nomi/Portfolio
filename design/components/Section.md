# Section

`src/components/Section.astro` · changed in v3

![Section](../mocks/2026-11-12-v3/components/Section.jpg)

## What it is

A page section: "§n LABEL" in the margin column (the § in red-ink), the body
in the body column, closed by an Ink rule. A short red tick sits on the
section's top rule at the margin column's x; the motion layer grows it when
the section enters view (B-24, redrawn as A's pen). Final state in CSS.

Optional story props (home): `refLine` = "Fig. 0, step n." lead-in with its
sentence; `next` = the "Next:" link that ends the section.

## Props

```ts
  mark: string;
  label: string;
  note?: string;
  /** A small mono line under the label in the margin column (no MarginNote rule). */
  sub?: string;
  as?: 'section' | 'div';
  narrId?: string;
  anchorId?: string;
  refLine?: { strong: string; text: string };
  next?: { label: string; href: string };
  /** Draw the faint drafting grid behind this section (Builds ledger only). */
  grid?: boolean;
  class?: string;
```

## Used on

- `/`
- `/about/`
- `/builds/`
- `/crosssource/`
- `/mirror-eval/`
- `/notes/<slug>/`
- `/screener-eval/`
- `/writing/`
- `/writing/decisions-api-legal-quiz/`
- `/writing/eval-harness-at-my-own-reflection/`
- `/writing/nobody-reports-the-misses/`
- `/writing/the-bus-stop-nobody-notices/`
- `/writing/the-judge-caught-a-bug/`
- `/writing/two-levers-that-did-not-move/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
- Motion: the final state is in the HTML; the pre-reveal state lives in CSS under `.motion` and the motion layer (`src/scripts/motion.ts`) plays it. Reduced motion shows the final state.
