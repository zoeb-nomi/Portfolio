# Moved

## Purpose
A redirect fallback page for a retired URL. Cloudflare serves the real redirect from `public/_redirects`; this page exists so the URL still resolves where that is not applied (local preview, a cached client), and it carries an incoming `#fragment` across.

## Anatomy
A full document (it imports `base.css` and `ds.css` itself): `<meta http-equiv="refresh">`, a canonical link to the target, `noindex`, an inline script that applies the stored theme (`ds-theme`) and one that redirects with `location.replace`, then a skip link and a `main` with a kicker and a text link to the target.

## Props
| prop | type | notes |
|---|---|---|
| `from` | `string` | the old path; the target is read from `redirects` in `copy.ts`, default `/` |

## Variants
None.

## Kit classes
`.skip`, `.sec`, `.gut`, `.in`, `.kick`, `.h3`, `.tl`.

## Motion
None; the page is on screen for an instant at most.

## Accessibility
The fallback is a real link, so with JS and meta refresh both off the visitor can still follow it. A skip link and `lang="en"` are set. A fragment is kept only when it is a plain id.

## Light and dark
The inline script reads `ds-theme` before first paint, so a returning visitor never sees the wrong theme flash; the kit roles do the rest.

## Used on
`/work/`, `/shipping/`, `/evals/`, `/notes/` (each page is just `<Moved from="..." />`).
