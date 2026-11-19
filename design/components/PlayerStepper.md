# PlayerStepper

## Purpose
A step-through explainer built like a media player: a screen, chapters and a control bar. It never starts by itself.

## Anatomy
- Player (`hidden` until script runs): screen with a chip strip and a live caption; numbered chapter buttons; a bar with Play/Pause, Back, Next, a range scrubber, the time and a speed select (0.5, 1, 1.5, 2).
- Transcript: an ordered list of all steps in full. Without JavaScript the player stays hidden and the transcript is the figure.

## Props
| prop | type | notes |
|---|---|---|
| `stages` | `Stage[]` | `title`, `text`, optional `tone: 'bad'`, `chips` (`text`, `kind: 'hot' \| 'fail'`) |
| `seconds` | `number?` | seconds per step at 1x, default 4 |

## Tokens it reads
- Colour roles: `--color-text`, `-text-muted`, `-surface`, `-surface-raised`, `-accent`, `-accent-text`.
- Primitive read: `--on-red` for text on red fills (flagged in the report).
- Type and space: `--font-data`, `--t-micro`, `--t-small`, `--t-note`, `--lh-snug`, `--s-2` to `--s-10`.
- Lines: `--line-object`, `--line-pen-dashed`, `--line-ink`, `--line-hair`. Motion: `--dur-base`, `--ease-draw`.

## States and motion
- Playing, paused, at a chapter, scrubbed; time-based via `requestAnimationFrame`. Chips enter with the `ps-in` animation.
- A "hot" chip is outlined dashed with red text; a "fail" chip and a `bad` chapter are filled red.
- Reduced motion: the global rule in `src/styles/base.css` collapses CSS animation. Playback is still user-started and timed by script, so it is not a loss of content.
- Ink surface: roles re-point (the red fill uses `--color-accent`).

## Accessibility
Caption is `aria-live="polite"`. Chapter buttons have visually hidden "Go to step n:" text. The scrubber has an `aria-label`. The transcript duplicates all content.

## Used on
Pages: `/crosssource/`, `/writing/the-judge-caught-a-bug/`.
