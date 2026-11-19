# SiteFooter

## Purpose
The site footer on the ink surface: name, role line, contact links, then the footer nav and the design and llms.txt links.

## Anatomy
`footer.site-footer.surface-ink.bleed`: an empty (aria-hidden) margin column; body column with the name (Archivo), the role line, a links row (Book a call, email, LinkedIn, GitHub; 44px targets), and a hair rule above a meta row holding a labelled `<nav aria-label="Footer">` and two small links (design system, `llms.txt`). No top rule: the CTA slab or the last section rule closes the page above it.

## Props
None. Content comes from `site`, `cta`, `nav` and `designLink` in `src/data/copy.ts`.

## Tokens it reads
- Colour roles: `--color-text`, `--color-text-muted`, `--color-link` (all resolved on the ink surface).
- Type: `--font-heading`, `--font-text`, `--wght-head`, `--wdth-head`, `--track-tight`, `--t-h3`, `--t-small`, `--t-label`, `--lh-heading`.
- Space and lines: `--s-2` to `--s-11`, `--hit-touch`, `--underline-offset`, `--line-hair`.

## States and motion
Static. Link hover changes colour and underline. Reduced motion changes nothing. It is the ink surface by construction (`.surface-ink`), so it re-points roles itself. Collapses at 899px.

## Accessibility
Labelled footer nav; external links open with `rel="noopener noreferrer"`; targets are 44px.

## Used on
Also via: `layout Base`.
Rendered by Base on every page.
