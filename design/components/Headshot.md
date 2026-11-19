# Headshot

## Purpose
The one headshot `<picture>`. It owns the image's box, crop and format ladder; the parent owns placement.

## Anatomy
`<picture>` with AVIF, WebP and JPG sources (480w and 960w files in `/img/`), then an `<img>` with width and height set for CLS. The photo is grayscale with `mix-blend-mode: multiply`, cropped to centre 12%.

## Props
| prop | type | notes |
|---|---|---|
| `size` | `'hero' \| 'thumb' \| 'card' \| 'about'` | default `hero`: fills its container, square; `thumb` 120px; `card` 300px; `about` 200px (132px at 599px and below) |
| `alt` | `string` | required |
| `loading` | `'eager' \| 'lazy'` | default `lazy`; eager also sets `decoding="sync"` |
| `class` | `string?` | placement from the parent |

## Tokens it reads
None. Sizes are fixed per preset in the component; the only breakpoint is 599px. It reads no colour role: the photograph is neutral grayscale.

## States and motion
Static; no hover and no animation. Reduced motion and the ink surface change nothing (the multiply blend assumes a light backdrop, so keep it on paper).

## Accessibility
`alt` is required by the type. Intrinsic width and height reserve space.

## Used on
Pages: `/`.
Also via: `Masthead`.
