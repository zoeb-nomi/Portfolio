# AudioPlayer

## Purpose
The narration player (kit `.ap`) for essays and case studies. It starts as a working native `<audio controls>` and a script swaps it for the kit player. When the data file has cues it also reads along: the paragraph being narrated is marked, and a click on a paragraph plays from it.

## Anatomy
- `section.ap#listen` with the native `<audio>` (and a `<track>` when a `.vtt` exists), a `<noscript>` note, then `.ap-ui` (hidden until the script runs).
- Controls: red play/pause button, a scrubber `.ap-bar` (`role="slider"`), time, a speed button (1, 1.25, 1.5), a CC toggle when captions exist, a captions download link.
- `.ap-float`: a bottom bar (play, time, Follow, "to player", close) that appears once the player has scrolled away.

## Props
| prop | type | notes |
|---|---|---|
| `audio` | `AudioData` | `src`, `duration` (s), `label`, `note` (the synthetic-voice disclosure), optional `captions` (.vtt path), `chapters` (`id`, `title`, `start`), `cues` (`[narrId, start, end][]`) |
| `articleId` | `string` | storage key for the resume point (`audio:<articleId>`) |

Strings come from `pipelineWriting.player` in `copy.ts`.

## Variants
None. Read-along turns on only when `audio.cues` is non-empty.

## Kit classes
`.ap` family (`.ap-play`, `.ap-bar`, `.ap-rail`, `.ap-fill`, `.ap-knob`, `.ap-rate`, `.ap-cc`, `.ap-float`), `.lab`, `.tnum`. Page anchors get `data-narr` and `.is-reading`.

## Motion
No decorative motion. The scrubber fill and knob follow playback; the page follows the narrated paragraph with smooth scroll until the reader scrolls, then Follow switches off. Reduced motion: scrolling is instant and the knob and reading-mark transitions are removed. Plain playback never depends on it.

## Accessibility
Native audio is the no-JS fallback. The scrubber is a labelled slider with `aria-valuenow` and `aria-valuetext` ("1:05 of 8:20"); Left and Right seek 10 s, Home and End jump. The CC toggle is `aria-pressed`; status text is `role="status"`. The cues must match the page text; `npm run audio:check` verifies them.

## Light and dark
Roles only (accent, text, glass, surface-sunk), so both themes work from the same CSS. The float bar uses `--color-glass-strong`.

## Used on
`EssayShell` (every essay page), `/crosssource/`, `/mirror-eval/`, `/screener-eval/`, `/writing/decisions-api-legal-quiz/`.
