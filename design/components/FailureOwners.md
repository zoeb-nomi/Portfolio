# FailureOwners

## Purpose
Which layer owns each failure: a square per failure, ink for a wrong-passage failure (tied to the prompt), red for a missing-authority failure (traces to retrieval).

## Anatomy
Two rows (baseline prompt, strict prompt) with a count in the head and a row of squares (`aria-hidden`); the strict row keeps the squares that are gone as dashed outlines. Then a key, a definition list of citation precision and recall (from → to), and an annotation sentence computed from the counts.

## Props
| prop | type | notes |
|---|---|---|
| `baseline`, `strict` | `{prompt, retrieval}` | failure counts per layer |
| `precision`, `recall` | `{from, to}` | strings shown as "from → to" |

## Tokens it reads
- Colour roles: `--color-text`, `-text-muted`, `-accent` (retrieval squares), `-accent-text`.
- Type and space: `--font-data`, `--t-micro`, `--t-data`, `--lh-snug`, `--s-1` to `--s-6`.
- Lines: `--line-object`, `--line-hair`. Motion: `--dur-slow`.

## States and motion
- Reveal: plays once at 35% in view; the strict row starts identical to the baseline row, then the fixed squares empty out to dashed outlines. Without script or with reduced motion the final state is the HTML.
- Ink surface: roles re-point.

## Accessibility
The squares are `aria-hidden`; the counts, the stats list and the annotation sentence state every number.

## Used on
Pages: `/crosssource/`.
