# Moved

## Purpose
Redirect fallback for an old URL. Cloudflare serves the real redirect from `public/_redirects`; this page keeps the URL resolving where that is not applied (local preview, a cached client) and carries an incoming `#fragment` across.

## Anatomy
A full HTML document (not wrapped in Base): `noindex`, a canonical link to the target, a `meta refresh`, an inline script that replaces the location (keeping a plain `#id` as `?from-hash=`), and a body line "This page moved" with a link.

## Props
| prop | type | notes |
|---|---|---|
| `from` | `string` | the old path; the target is the matching `to` in `redirects` (`src/data/copy.ts`), else `/` |

## Tokens it reads
None. It ships no stylesheet and renders unstyled.

## States and motion
No motion. Works without script through `meta refresh`. Reduced motion and ink surface do not apply.

## Accessibility
Sets `lang="en"` and a plain link to the new location, so a reader without refresh or script can still follow it.

## Used on
Pages: `/evals/`, `/notes/`, `/shipping/`, `/work/`.
The stubs are the old `/notes/`, `/shipping/`, `/work/` and `/evals/` URLs; Base only mentions it in a comment about hash hops.
