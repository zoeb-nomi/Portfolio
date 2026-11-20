# VideoEmbed

## Purpose
A click-to-play video facade. Nothing third-party loads until someone asks to watch: the poster is self-hosted and the youtube-nocookie iframe is created on click, in place.

## Anatomy
`figure.vid[data-video-embed]`: `.frame` with `a.facade` (a `<picture>` poster and a red `.vplay` tab), then `figcaption` with the caption and a `.vlinks` set (the watch link and any `links`). The inline script upgrades the anchor into a real `<button>` (aria-label "Play: <title>"), reusing the same child nodes so the poster is not fetched twice.

## Props
| prop | type | notes |
|---|---|---|
| `youtubeId` | `string` | |
| `title` | `string` | used for the iframe title and the play label |
| `caption` | `string` | |
| `poster` | `string` | extensionless path; `<poster>.webp` and `<poster>.jpg` under `public/` |
| `play` | `string` | text on the red play tab |
| `open` | `string` | label of the link to the watch page |
| `links` | `{label, href}[]` | further links beside it |

## Variants
Anchor (no JS) and button (JS). A missing poster is marked `data-failed` so no broken-image marker shows.

## Kit classes
The red play tab (`.vplay`) and the caption links are the component's own CSS; frame on `--color-surface-sunk` with `--line-hair`.

## Motion
None. Clicking swaps the facade for the iframe (autoplay) and moves focus to it.

## Accessibility
Exactly one control exists in either mode. With JS off the poster is a working link to the watch page. The iframe gets a `title` and `allow` for fullscreen. Links open in a new tab with `rel="noopener noreferrer"`.

## Light and dark
Roles only; the play tab is `--color-accent` with `--color-on-accent` text. The poster is the same image in both themes.

## Used on
`/about/`.
