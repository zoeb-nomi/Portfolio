# SiteHeader

## Purpose
The sticky glass bar: the brand, the four nav items, the theme toggle and an Email action.

## Anatomy
`header.site.gut > .in`: `a.brand`, `nav.nav` (`a.nl[data-page]`, the current one has `aria-current="page"` and the red underline), `button.theme-t` (sun and moon icons, `aria-label`), `a.hcta`.

## Props
| prop | type | notes |
|---|---|---|
| `currentPath` | `string` | the page path, to mark the current nav item |

Nav items, brand and strings come from `copy.ts` (`site`, `nav`, `headerUi`, `cta`).

## Variants
Phones (599px and below) drop Home (the brand links home) and Email (it is in the footer), keeping the theme toggle.

## Kit classes
`.site`, `.brand`, `.nav`, `.nl`, `.theme-t`, `.hcta` (styles in `ds.css`).

## Motion
The nav underline draws in on hover and focus (500ms, once). The toggle itself is wired by `src/scripts/ds.ts`: it sets `data-theme` on `<html>`, stores `ds-theme` per viewer and fires `ds:theme`. No other motion.

## Accessibility
A `header` landmark and a labelled `nav`; the toggle is a real button whose label names the theme it switches to; the `.skip` link in `Base.astro` comes first.

## Light and dark
This is the theme switch: dark by default, paper on request. The bar uses `--color-glass-strong`, a solid translucent tint with no `backdrop-filter` (design/README.md section 8, rule 8: a sticky bar never re-blurs a moving canvas), so the page shows faintly through it in both.

## Used on
Every page, through `src/layouts/Base.astro`.
