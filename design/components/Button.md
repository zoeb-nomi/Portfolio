# Button

## Purpose
The one link rendered in the kit's button grammar. It is always an `<a>`.

## Anatomy
`<a class="btn">` (or `.btn.ghost`, or `.tl`) wrapping `span.mi` (the label) and `span.ar` (the arrow, `aria-hidden`). External hrefs get `target="_blank"` and `rel="noopener noreferrer"` and the arrow becomes ↗. A trailing → or ↗ typed in the label is stripped, so the component owns the glyph.

## Props
| prop | type | notes |
|---|---|---|
| `href` | `string` | required |
| `variant` | `'primary' \| 'secondary' \| 'inverse' \| 'link'` | default `secondary` |
| `class` | `string?` | extra classes |
| `arrow` | `boolean` | show the arrow on `.btn` buttons; default `true` |

## Variants
- `primary`: the red `.btn` (the CTA; one per block).
- `secondary`: the outlined `.btn.ghost`.
- `link`: the underlined mono text link `.tl`. `inverse` is kept for old call sites and renders the same as `link`.

## Kit classes
`.btn`, `.btn.ghost`, `.tl`, `.mi`, `.ar`.

## Motion
Still: nothing lifts or casts a shadow. Hover and focus move only the arrow 3px (`.btn`) or redraw the `.tl` underline in red once. No script. Reduced motion collapses the transitions.

## Accessibility
Native link semantics, so Enter activates it. The button is 48px tall. Focus uses the global 2px accent outline. The arrow is decorative.

## Light and dark
Primary is `--color-accent` with `--color-on-accent` text, and hover mixes toward the text role. Both are role-driven, so the light theme's deeper red stays AA on paper.

## Used on
Through `CTASlab` on every essay and note.
