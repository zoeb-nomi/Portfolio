# Masthead

## Purpose
The page head (kit `.page-head`) for the writing pages: kicker, h1, optional standfirst, a byline, whatever the page puts in the default slot (the AudioPlayer, a finding line), optional readouts, and optional case-study details. An essay or note head also switches on the reading spine and in-place footnotes.

## Anatomy
`section.page-head.gut` > `.mh`: optional `.mh-photo` (a `Headshot`), then `.mh-body` with `p.kick` (or breadcrumb `nav.kick.crumbs`), `h1.display.split`, `p.dek`, `.byline` (the `byline` slot), the default slot, `.stats > .ro` readouts (`.v`, `.u`, `.s`), a `.hud.mh-spec` spec strip, and `.mh-links` (an `EvalsSwitcher` and a repo `.tl` link).

## Props
| prop | type | notes |
|---|---|---|
| `h1` | `string` | required |
| `kicker`, `standfirst` | `string?` | |
| `variant` | `'default' \| 'plain'` | `plain` drops the kicker |
| `stats` | `{v, u, s?}[]` | readouts under the head |
| `spec` | `{label, value}[]` | the HUD strip; `label` names its group for assistive tech (default "Case study details") |
| `switcher` | case-study name | renders `EvalsSwitcher` |
| `repo` | `{href, label}` | repo link |
| `crumbs` | `{label, href?}[]` | breadcrumb; replaces the kicker |
| `thumbnail`, `portrait` | `{alt}` | headshot beside the title |
| `h1Max`, `standfirstMax` | CSS length | width caps |
| `narr` | `boolean` | read-along anchors (`data-narr`) on h1, dek and spec |
| `article` | `boolean` | force the article marking on or off; default on when there is a byline and no case-study props |

Slots: `byline`, default.

## Variants
Default, `plain`, photo (`thumbnail` or `portrait`), article (`data-article`), case-study details (`spec`, `switcher`, `repo`).

## Kit classes
`.page-head`, `.kick`, `.display`, `.split`, `.dek`, `.byline`, `.stats`, `.ro`, `.hud`, `.hud-in`, `.hud-c`, `.tl`, `.lab`.

## Motion
The h1 fades up once (`.split`); readout numbers appear whole (`data-num`). When the head is an article, `scripts/reading.ts` is imported and draws the red spine and footnote handling for the sections below.

## Accessibility
One `h1`; the breadcrumb is a labelled `nav` with `aria-current` on the last item; the spec strip is a `role="group"` with a `dl`. Photo alt text is required.

## Light and dark
Roles only. Both themes work unchanged.

## Used on
`/notes/[slug]/`, `/writing/`, `/writing/decisions-api-legal-quiz/`. The photo, crumbs, spec, switcher and repo variants are not passed by any page at the time of writing (case studies use `CsHead` and `CaseTabs`).
