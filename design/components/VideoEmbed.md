# VideoEmbed

`src/components/VideoEmbed.astro` · unchanged in v3

![VideoEmbed](../mocks/2026-11-12-v3/components/VideoEmbed.jpg)

## What it is

Lite-embed facade. Nothing third-party loads until someone asks to watch:
the poster is self-hosted, and the YouTube iframe is created on click. This
component makes no third-party request on first paint (the page-level analytics
scripts in Base.astro are separate).

Progressive enhancement: the markup ships an <a> to the watch page, so the
poster is a working link with JavaScript off. The inline script upgrades that
anchor into a real <button> (aria-label "Play: <title>"): reusing the same
child nodes, so the poster is never re-requested, and that button swaps in
the iframe. Exactly one control exists in either mode.
Extensionless path to the self-hosted poster: <poster>.webp + <poster>.jpg
must both exist under public/. Required, there is no remote fallback.

## Props

```ts
  youtubeId: string;
  title: string;
  caption: string;
  figNo: number;
  // Extensionless path to the self-hosted poster: <poster>.webp + <poster>.jpg
  // must both exist under public/. Required, there is no remote fallback.
  poster: string;
  channel?: string; // small mono plate, e.g. 'KEKA HR · YOUTUBE'
```

## Used on

- `/about/`

## Rules

- Values only from `design/tokens.css`; lines only from the `--line-*` tiers (see `design/README.md`).
- Copy comes from `src/data/copy.ts`, never typed into the component.
