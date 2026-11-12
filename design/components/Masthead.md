# Masthead

`src/components/Masthead.astro` · changed in v3

![Masthead](../mocks/2026-11-12-v3/components/Masthead.jpg)

## What it is

The page masthead: a kicker in the margin column, an h1 + standfirst in the
body column, closed by a strong rule. One component for every interior page.

default   kicker in the margin column (Writing, Evals, posts, case studies)
: add `spec` / `switcher` / `repo` for the case-study margin
plain     empty margin column, hidden on phones (Work)
photo     pass `thumbnail`: a 120px headshot in the margin column, no kicker,
stacked above the title on phones (About)

Slots: `byline` (a dated line under the standfirst) and the default slot
(anything under that, the read-along AudioPlayer). The AudioPlayer finds its
float anchor via `.masthead-inner > .margin-col`; keep both class names.
A kicker alone is just text. Only a margin column that carries a spec block, the evals
switcher or a repo link is a real complementary region and gets a name.

## Props

```ts
  h1: string;
  kicker?: string;
  standfirst?: string;
  /** Accessible name for the margin-column aside (used only when it carries a spec, switcher or repo link). */
  label?: string;
  variant?: 'default' | 'plain';
  thumbnail?: { alt: string };
  /** Any CSS length; ch is relative to the h1's own font size. */
  h1Max?: string;
  standfirstMax?: string;
  /** Read-along anchors (data-narr) on the h1, standfirst and spec block. */
  narr?: boolean;
  spec?: SpecRow[];
  switcher?: 'CrossSource' | 'mirror-eval' | 'screener-eval';
  repo?: { href: string; label: string };
  /** Breadcrumb under Builds/Writing (DESIGN v3 §e). Replaces the margin kicker. */
  crumbs?: { label: string; href?: string }[];
  /** About: one borderless greyscale portrait, 200px (D-12). */
  portrait?: { alt: string };
```

## Used on

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
