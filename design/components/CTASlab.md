# CTASlab

`src/components/CTASlab.astro` · changed in v3

![CTASlab](../mocks/2026-11-12-v3/components/CTASlab.jpg)

## What it is

(No header comment in the source; see the markup.)

## Props

```ts
  marginLines: string[];
  body: string;
  buttonLabel: string;
  buttonHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Mono line under the button; defaults to "30 min · intro call" for Book a call. */
  buttonNote?: string | null;
```

## Used on

- `/`
- `/about/`
- `/builds/`
- `/crosssource/`
- `/mirror-eval/`
- `/screener-eval/`
- `/writing/decisions-api-legal-quiz/`
- `/writing/eval-harness-at-my-own-reflection/`
- `/writing/nobody-reports-the-misses/`
- `/writing/the-judge-caught-a-bug/`
- `/writing/two-levers-that-did-not-move/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
