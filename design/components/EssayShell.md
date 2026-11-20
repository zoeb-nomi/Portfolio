# EssayShell

## Purpose
The whole frame of an essay page in The Pipeline: page head (kicker, title, dek, byline, audio), the article with its red reading spine, optional footnotes, and the related rows at the foot. The page supplies the article as the default slot.

## Anatomy
- `section.page-head.wr-head[data-article]`: `.kick`, `h1.display.split`, `.wr-dek`, `.byline` (author, kind, date, reading time, a link to the audio), `AudioPlayer` when `audio` is set, and a `head` slot.
- `section.rs.gut > .rs-in.prose#article`: the default slot, then `.footnotes#footnotes` when a `footnotes` slot is given.
- Related section: `h2.h2`, an `ol.blist` of three other essays (or just an "All writing" link).
- Script: `scripts/reading.ts` (the spine and in-place footnotes).

## Props
| prop | type | notes |
|---|---|---|
| `slug` | `string` | used to pick related essays |
| `kicker`, `title`, `dek` | `string` | page head text |
| `date` | `string` | ISO date |
| `readingTime` | `string` | e.g. "9 min" |
| `audio` | `Audio?` | `src`, `duration`, `label`, `note`, `chapters?`, `cues?`, `captions?` |
| `articleId` | `string` | resume key for the player |
| `related` | `'list' \| 'link'` | three other essays (default) or just the All writing link |

Slots: `head` (under the audio), default (the article), `footnotes`. Strings come from `pipelineEssay` in `copy.ts`.

## Variants
`related="list"` and `related="link"`.

## Kit classes
`.page-head`, `.kick`, `.display`, `.split`, `.byline`, `.prose`, `.footnotes`, `.blist` with `.build` rows, `.ctas` and `.tl`; page layout in `src/styles/essay.css`.

## Motion
The heading fades up once (`.split`); the related rows stagger in (`data-stagger`); the red spine grows with scroll and ends in a small square at the footnotes. Under 1100px the spine becomes a progress bar under the header. Reduced motion shows the finished spine and no movement.

## Accessibility
One `h1` per page, article inside `main`, a skip-able audio player, footnotes that open in place but stay in a list at the foot without JS. The read-along `data-narr` cues stay on the elements the page puts in the slot and must match the audio file.

## Light and dark
Roles only; the spine and its marks use `--color-accent`. Both themes are complete.

## Used on
`the-bus-stop-nobody-notices`, `eval-harness-at-my-own-reflection`, `two-levers-that-did-not-move`, `nobody-reports-the-misses`, `the-judge-caught-a-bug`. (`decisions-api-legal-quiz` builds the same page from `Masthead` and `Section` instead.)
