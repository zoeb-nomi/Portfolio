# Button

## Purpose
The one link-styled-as-button. An object on the desk: hover lifts it with a hard ink shadow, press sets it down.

## Anatomy
A single `<a class="rp-button rp-button--<variant>">` wrapping the slot. External hrefs get `target="_blank"` and `rel="noopener noreferrer"`.

## Props
| prop | type | notes |
|---|---|---|
| `href` | `string` | required |
| `variant` | `'primary' \| 'secondary' \| 'inverse'` | default `secondary` |
| `class` | `string?` | extra classes |

## Tokens it reads
- Colour roles: `--color-text`, `-surface`, `-accent-text`, `-line-strong`.
- Type and shape: `--font-text`, `--wght-strong`, `--wdth-head`, `--radius`, `--hit-touch`.
- Motion: `--dur-fast`, `--ease-draw`.
- Variants: primary is a `--color-accent-text` fill with text in `--on-red` (a primitive read, see the report); secondary is outlined and fills `--color-text` on hover; inverse is `--color-surface` with `--color-accent-text` text, for the CTA slab.

## States and motion
- Hover: translate by (-3px, -3px) with a 3px hard `--color-text` shadow (README section 3). Active: back to rest, no shadow.
- Transition is `--dur-fast`; the transform is the only layout-neutral movement.
- No reduced-motion rule in the component. No script.
- Ink surface: use `inverse` there (the CTA slab does), since roles re-point.

## Accessibility
Native link semantics; minimum height is `--hit-touch` (44px). Focus uses the global focus style.

## Used on
Pages: `/`, `/design/components/`, `/notes/[slug]/`.
Also via: `CTASlab`.
