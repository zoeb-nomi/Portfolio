# ReadAlongDemo

`src/components/ReadAlongDemo.astro` · changed in v3

![ReadAlongDemo](../mocks/2026-11-12-v3/components/ReadAlongDemo.jpg)

## What it is

A silent preview of the read-along: the first lines of a real essay light up on the narration's own timing
(the cue times in copy.ts), looping. It has a Pause button and stops when it is off screen. With reduced
motion it is a still frame with the first line lit. No sound plays; the real thing is on every essay page.
Features "Nobody Reports the Misses" (CP §9, U11): it carries the rule for autonomy.

## Props

None.

## Used on

- `/writing/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
