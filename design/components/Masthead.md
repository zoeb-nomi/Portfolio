# Masthead

## Purpose
The page masthead for every interior page: a kicker or case-study block in the margin column, an h1 and standfirst in the body column, closed by an Ink rule.

## Anatomy
- Margin column: kicker, or breadcrumbs (`crumbs` replace the kicker), `spec` definition list, `EvalsSwitcher`, repo link. It is an `<aside>` only when it carries spec, switcher or repo; a kicker alone is a plain `div`.
- `photo` mode (`thumbnail` or `portrait`): a `Headshot` in the margin column, no kicker, stacked above the title on phones.
- `plain` variant: empty margin column, hidden on phones.
- Body column: `<nav>` breadcrumbs, `<h1>` (steps down when longer than 40 characters), standfirst, byline slot, default slot (for example the AudioPlayer, which finds `.masthead-inner > .margin-col`).

## Props
| prop | type | notes |
|---|---|---|
| `h1` | `string` | required |
| `kicker`, `standfirst` | `string?` | |
| `label` | `string?` | accessible name for the margin aside |
| `variant` | `'default' \| 'plain'` | |
| `thumbnail`, `portrait` | `{alt}?` | thumb (120px) or about (200px) headshot |
| `h1Max`, `standfirstMax` | `string?` | any CSS length |
| `narr` | `boolean?` | read-along `data-narr` ids on h1, standfirst, spec |
| `spec` | `{label, value}[]?` | |
| `switcher` | `'CrossSource' \| 'mirror-eval' \| 'screener-eval'?` | |
| `repo` | `{href, label}?` | |
| `crumbs` | `{label, href?}[]?` | last item gets `aria-current="page"` |
Slots: `byline`, default.

## Tokens it reads
- Colour roles: `--color-text`, `-text-body`, `-text-muted`, `-line`, `--color-link`.
- Type: `--font-heading`, `--font-text`, `--font-data`, `--wght-head`, `--wdth-head`, `--t-page`, `--t-body`, `--t-data`, `--t-label`, `--t-micro`, `--track-tight`, `--lh-*`.
- Space and lines: `--s-1` to `--s-11`, `--gutter`, `--hit-min`, `--underline-offset`, `--line-ink` (closing rule), `--line-hair`.

## States and motion
Static: the component draws no pen mark and has no script (page titles get none from here). Breakpoints 899 and 1099 reflow the columns. Reduced motion and ink surface change nothing.

## Accessibility
One `<h1>` per page. Breadcrumbs are a labelled `<nav>` with an ordered list. Hover underline on crumbs only; link targets use `--hit-min`.

## Used on
Pages: `/about/`, `/builds/`, `/crosssource/`, `/design/`, `/design/components/`, `/mirror-eval/`, `/notes/[slug]/`, `/screener-eval/`, `/writing/`, `/writing/decisions-api-legal-quiz/`, `/writing/eval-harness-at-my-own-reflection/`, `/writing/nobody-reports-the-misses/`, `/writing/the-bus-stop-nobody-notices/`, `/writing/the-judge-caught-a-bug/`, `/writing/two-levers-that-did-not-move/`.
