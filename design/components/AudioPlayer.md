# AudioPlayer

## Purpose
Compact in-page narration player. The markup is a working native `<audio controls>`; an inline
script swaps it for the custom row, so a no-JS reader still gets a full player (the browser's own).

## Anatomy
- Caption (`label · N min`) and a note line, in mono.
- Row: play/pause button, seek track (`role="slider"`), time readout, speed button (1x cycle).
- Optional chapter chips (`aria-current` on the active one).
- Status line (`role="status"`, `aria-live="polite"`).
- A floating bar (play, Follow, "Player" jump, close) that appears while the player is out of view.
- Read-along: `cues` tuples `[data-narr id, start s, end s]` mark the active paragraph on the page.

## Props
| prop | type | notes |
|---|---|---|
| `audio` | `AudioData` | `src`, `duration`, `label`, `note`, optional `chapters` (`id`, `title`, `start`) and `cues` |
| `articleId` | `string` | storage key `audio:<articleId>` (resume position) |

## Tokens it reads
- Colour roles: `--color-surface`, `-surface-raised`, `-text`, `-text-body`, `-text-muted`, `-line`, `-accent`, `-accent-text`.
- Type and space: `--font-data`, `--t-micro`, `--t-small`, `--track-wide`, `--s-1` to `--s-6`.
- Other: `--line-hair`, `--line-pen`, `--radius`, `--hit-touch`, `--underline-offset`, `--dur-fast`, `--dur-base`, `--ease-draw`, `--z-nav`.

## States and motion
- Playing, paused, buffering (status line), speed change, chapter jump, follow on/off (`aria-pressed`).
- Seek fill and thumb ease with a short width/left transition; reduced motion sets `transition: none`.
- Smooth scroll to the active cue falls back to `auto` under reduced motion.
- Not a motion verb: it is a control, not a mark. No ink-surface variant; it sits on paper.

## Accessibility
- Native audio is the fallback. Buttons carry `aria-label` that tracks state ("Play: <label>", "Pause").
- The seek track exposes `aria-valuenow`, `-valuemax` and `-valuetext` ("0:42 of 6:10").
- Touch targets are `--hit-touch` (44px).

## Used on
Pages: `/crosssource/`, `/mirror-eval/`, `/screener-eval/`, `/writing/decisions-api-legal-quiz/`, `/writing/eval-harness-at-my-own-reflection/`, `/writing/nobody-reports-the-misses/`, `/writing/the-bus-stop-nobody-notices/`, `/writing/the-judge-caught-a-bug/`, `/writing/two-levers-that-did-not-move/`.
