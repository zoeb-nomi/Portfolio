# SiteFooter

## Purpose
The one-line site footer: identity on the left; Writing, Design system, Email, LinkedIn, GitHub, X and llms.txt on the right.

## Anatomy
`footer.foot.gut > .in`: `span.foot-id` and `nav[aria-label="Footer"]` with the links. On phones the links wrap.

## Props
None. Links and identity text come from `copy.ts` (`writingLink`, `designLink`, `cta`, `llmsLink`, `footerId`).

## Variants
None.

## Kit classes
`.foot`, `.foot-id`, `.gut`, `.in` (styles in `ds.css`). The footer carries Email on phones, where the header drops it.

## Motion
Links change colour on hover and focus (a 300ms fade). No script.

## Accessibility
A `footer` landmark with a labelled `nav`. External links open in a new tab with `rel="noopener noreferrer"`.

## Light and dark
Roles only: a hairline above, muted identity, body-coloured links.

## Used on
Every page, through `src/layouts/Base.astro`.
