# CaseTabs

## Purpose
The three-harness switcher at the top of each case study: CrossSource, mirror-eval and screener-eval as numbered tabs, plus a repo link at the right. It replaces `EvalsSwitcher` on the three case-study pages.

## Anatomy
`div.gut > .in > nav.cs-tabs`: one `a` per harness (an `i` with 01 to 03, then the name; the current one has `aria-current="page"`), then `a.cs-repo` (opens in a new tab).

## Props
| prop | type | notes |
|---|---|---|
| `current` | `number` | zero-based index into `evalsSwitcher` |
| `repoHref` | `string` | the repo link |
| `repoLabel` | `string` | its label |

Harness names and links come from `evalsSwitcher` in `copy.ts`; the nav label and arrow from `pipelineCaseStudies.shared`.

## Variants
None.

## Kit classes
`.cs-tabs` and `.cs-repo` (in `src/styles/case-study.css`). Part of the `Cs*` family, see `CaseStudyKit.md`.

## Motion
None. The tab row scrolls sideways on narrow screens (scrollbar hidden).

## Accessibility
A labelled `<nav>`; the current page uses `aria-current`. All items are links, so no roving focus is needed.

## Light and dark
Roles only; the current tab gets a red underline and a red number.

## Used on
`/crosssource/`, `/mirror-eval/`, `/screener-eval/`.
