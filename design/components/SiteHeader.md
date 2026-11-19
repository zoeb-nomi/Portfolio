# SiteHeader

## Purpose
The site header on paper: wordmark and role line, the four nav items at every width (no hamburger), and a red "Book a call" action.

## Anatomy
`<header id="site-header">`: wordmark link (name, role line from 1100px), `<nav aria-label="Primary">` list, and the header CTA link (opens in a new tab). Sticky from 900px, named `site-header` for view transitions so it holds still between pages.

## Props
| prop | type | notes |
|---|---|---|
| `currentPath` | `string` | marks the current nav item with `aria-current="page"` |
Content comes from `site`, `nav`, `cta` in `src/data/copy.ts`.

## Tokens it reads
- Colour roles: `--color-text`, `-text-muted`, `-surface`, `-accent-text` (CTA), `--color-link`.
- Type: `--font-heading`, `--font-text`, `--wght-claim`, `--wdth-claim`, `--wght-strong`, `--track-tight`, `--t-small`, `--t-label`.
- Space and lines: `--s-1` to `--s-8`, `--gutter`, `--header-h`, `--z-nav`, `--hit-touch`, `--line-ink` (bottom rule), `--line-pen` (current-item underline). Motion: `--dur-base`, `--ease-draw`.

## States and motion
- Hover and current nav items draw an underline (`::after`); the CTA thickens its underline on hover.
- The view transition keeps the header fixed across navigations; `motion.css` turns view transitions off under reduced motion.
- Ink surface: not used there; the header stays on paper.

## Accessibility
Primary nav is labelled; `aria-current="page"` on the current item; the CTA and nav items are 44px targets and the external link carries `rel="noopener noreferrer"`.

## Used on
Also via: `layout Base`.
Rendered by Base on every page.
