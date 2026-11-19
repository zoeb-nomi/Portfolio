# VideoEmbed

## Purpose
A lite YouTube embed: nothing third-party loads until the reader asks to watch. The poster is self-hosted and the iframe is created on click.

## Anatomy
`<figure>` with a 16:9 frame holding the facade link (self-hosted poster as WebP with JPG fallback, a play glyph, an optional channel plate), a caption "Fig. n: caption", and an "Open on YouTube" link. With JS the anchor is upgraded to a `<button>` (`aria-label` "Play: title") reusing the same child nodes, which then swaps in a `youtube-nocookie` iframe. Exactly one control exists in either mode.

## Props
| prop | type | notes |
|---|---|---|
| `youtubeId` | `string` | |
| `title` | `string` | used for the play label and iframe title |
| `caption` | `string` | |
| `figNo` | `number` | |
| `poster` | `string` | extensionless path; `<poster>.webp` and `.jpg` must exist under `public/` |
| `channel` | `string?` | small mono plate on the poster |

## Tokens it reads
- Colour roles: `--color-text`, `-text-muted`, `-surface`, `-accent-text`, `--color-link`.
- Primitive read: `--on-red-muted` (plate text; flagged in the report).
- Type and space: `--font-data`, `--t-micro`, `--track-wide`, `--lh-snug`, `--s-1` to `--s-8`, `--radius`, `--hit-min`, `--underline-offset`. Motion: `--dur-fast`, `--ease-draw`.

## States and motion
- Facade, hover and focus (the glyph reacts), loading, playing, and poster-failed (`data-failed`).
- No motion verb; the glyph transition is a short background-colour change that the global reduced-motion rule collapses.
- Hover or focus: the play glyph's fill changes from `--color-text` to `--color-accent-text`. The channel plate text uses `--on-red-muted` (a primitive, so it does not re-point on the ink surface).

## Accessibility
Works as a plain link with JavaScript off. The poster `alt` is empty because the control carries the label. Touch targets use `--hit-min`; external links use `rel="noopener noreferrer"`.

## Used on
Pages: `/about/`.
