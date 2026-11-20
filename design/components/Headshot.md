# Headshot

## Purpose
The one headshot `<picture>`, in a few presets, served avif then webp then jpg from the same 480w and 960w files everywhere. The parent owns placement; this component owns the picture's box and crop.

## Anatomy
`picture.headshot.headshot--<size>` with two `<source>` elements and an `<img>` with intrinsic `width` and `height`, `srcset`, `sizes`, and `decoding` (`sync` when eager, else `async`).

## Props
| prop | type | notes |
|---|---|---|
| `size` | `'hero' \| 'thumb' \| 'card' \| 'about'` | default `hero` |
| `alt` | `string` | required |
| `loading` | `'eager' \| 'lazy'` | default `lazy` |
| `class` | `string?` | placement classes from the parent |

## Variants
`hero` (about 240px, square), `thumb` (120px), `card` (300px, parent shrinks it on phones), `about` (132px under 600px, else 200px).

## Kit classes
None of its own beyond `.headshot` and `.headshot--<size>` (scoped crop and sizing).

## Motion
None.

## Accessibility
`alt` is required; pass the real description, or an empty string only if the image is decorative next to a name that already says who it is. Width and height are set so nothing shifts.

## Light and dark
No colour of its own; the photograph is the same in both themes.

## Used on
`Masthead` (the `thumbnail` and `portrait` props). No page passes those props at the time of writing, so the component is not rendered on the live site. The header comment mentions an `EmbedCard` and a hero Figure that no longer exist.
