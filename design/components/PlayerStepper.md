# PlayerStepper

## Purpose
A step-through explainer built like a media player: a screen, five chapters, and a bar with Play/Pause, Back, Next, a scrubber, the time and a speed control. It never starts by itself. Without JavaScript the player is hidden and the transcript below it (all steps in full) is the figure.

## Anatomy
`.ps[data-ps]`: `.ps-player` (hidden until the script runs) with `.ps-screen` (`.ps-strip` of chips, `.ps-cap` caption, `aria-live="polite"`), `ol.ps-chapters` of buttons (`data-tone="bad"` for a failure step), and `.ps-bar` (`.ps-play`, `.ps-nav` Back and Next, `input.ps-scrub` range, `.ps-time`, a speed `select` of 0.5, 1, 1.5, 2). Then `.ps-transcript`: an ordered list of the full text.

## Props
| prop | type | notes |
|---|---|---|
| `stages` | `Stage[]` | `title`, `text`, optional `tone: 'bad'`, `chips: { text, kind?: 'hot' \| 'fail' }[]` |
| `seconds` | `number` | seconds each step lasts at 1x; default `4` |

## Variants
Chip kinds `hot` and `fail`; a stage with `tone: 'bad'` marks its chapter button as the failure.

## Kit classes
Own `ps-*` classes; the accent is the active step, the failure chip and the play button; `--line-pen-dashed` marks proposed items.

## Motion
Time-based playback only when the reader presses Play; scrubbing and the chapter buttons jump instantly. Nothing animates on load. The transcript line for the current step is highlighted.

## Accessibility
The transcript is always in the page, so the content survives without JS. Chapter buttons read "Go to step N: <title>"; the scrubber is a native range with a label; the caption is `aria-live="polite"`; controls are native buttons and a select, so keyboard and screen readers work without custom roles. A reader who prefers less motion is not auto-played at all.

## Light and dark
Roles only; the screen uses `--color-surface-sunk` and a hairline frame, so it reads on both grounds.

## Used on
`/writing/the-judge-caught-a-bug/` (Fig. 1).
