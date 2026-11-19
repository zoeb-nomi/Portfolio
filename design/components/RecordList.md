# RecordList

## Purpose
The public-record block that closes a Work entry: claims you can check. Each row is the claim with its artefacts as links, and where it lives.

## Anatomy
A `<section>` (labelled "Public record", optionally with context) holding a heading (kicker), an optional note and a list of rows: `what` plus underlined links separated by a middle dot, and `where`. A row whose links are empty or start with `TODO_` is not rendered; if none remain, nothing renders.

## Props
| prop | type | notes |
|---|---|---|
| `kicker` | `string` | the heading text |
| `items` | `RecordItem[]` | `what`, `links[]`, `where` |
| `note` | `string?` | |
| `context` | `string?` | disambiguates the landmark label |
| `flush` | `boolean?` | drop the top rule and spacing after another strong rule (one strong rule between blocks) |
| `headingLevel` | `'h2' \| 'h3'` | default `h3` |

## Tokens it reads
- Colour roles: `--color-text`, `--color-text-muted`, `--color-link`.
- Type and space: `--font-text`, `--font-data`, `--t-small`, `--t-note`, `--t-label`, `--t-micro`, `--lh-*`, `--s-1` to `--s-8`, `--hit-min`, `--underline-offset`.
- Lines: `--line-ink`, `--line-hair`.

## States and motion
Static: no script, no animation. Reduced motion changes nothing. Ink surface: roles re-point. Stacks at 899px and below.

## Accessibility
Labelled region; configurable heading level; external links open in a new tab with `rel="noopener noreferrer"`; link targets use `--hit-min`.

## Used on
Pages: `/about/`, `/design/components/`.
