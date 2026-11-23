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
Primary fills with `--color-accent-fill` (the red under text, not the line red `--color-accent`) with `--color-on-accent` text, and hover and focus switch the fill to `--color-accent-hover`, a deeper red. Both are role-driven, so the label stays AA in both themes: 4.8:1 at rest and 5.9:1 on hover in dark, 5.2:1 and 6.3:1 in light.

## Used on
Through `CTASlab` on every essay and note.
