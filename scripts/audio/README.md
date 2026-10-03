# Narration pipeline

Turns a built page into a narrated, read-along audio file: mp3, WebVTT captions,
and the cue/chapter data the `AudioPlayer` consumes. Local only (a Kokoro voice
running on this machine), reproducible, and cheap to re-run because unchanged
sentences are cached.

```
built page (dist/)                       scripts/audio/                          what ships
 every [data-narr] element  ──extract──▶ script (title, dek, labels, paras)
                                          └─ spoken forms (numbers, acronyms)
                                          └─ sentence split
                                  ──Kokoro──▶ audio per sentence (cached)
                                  ──layout──▶ exact timeline (no alignment guesswork)
                                  ──mix────▶ loudness-normalised (-16 LUFS), mp3 + ID3  ─▶ public/audio/<slug>.mp3
                                  ──derive─▶ captions                                    ─▶ public/audio/<slug>.vtt
                                  ──derive─▶ cues, chapters, hashes                      ─▶ src/data/audio/<slug>.json
```

## One-time setup

The pipeline has its own `package.json` so none of it touches the site's
dependency tree, the lockfile, or CI.

```
npm run audio:install     # installs scripts/audio/node_modules (kokoro-js, transformers.js, lamejs)
npm run audio:test        # unit tests; need no model and no network
```

The first `audio:build` downloads the Kokoro-82M ONNX model (~330 MB) into
`.audio-cache/models` (git-ignored). `audio:verify` downloads a small Whisper
model (~80-150 MB) the first time it runs.

## Making audio for a page

1. Give the page narration anchors (this is what the existing essays do):
   `<Masthead narr>` puts `data-narr` on the h1 and standfirst, `Section narrId="sN-cue"`
   on each section heading, and `data-narr="sN-pK"` on each paragraph.
2. Register it in `pages.json` (`slug`, `path`, `title`, optional `chapterTitles`, `overrides`).
3. Build the site, then the audio:

```
npm run build
npm run audio:build -- <slug> --dry-run   # read the spoken script first; no model needed
npm run audio:build -- <slug>             # synthesise, mix, encode, write outputs
npm run audio:verify -- <slug>            # optional: transcribe it back and compare
```

4. Wire the data file into the page the way `two-levers-that-did-not-move` does
   (`audio` object -> `<AudioPlayer audio=... articleId=... />` in the Masthead
   slot, plus the `AudioObject` in the JSON-LD).

## Keeping it honest

`npm run audio:check` (run after `npm run build`) fails when the audio no longer
matches the page: the page text changed since the audio was built (it names the
anchors that changed), a file is missing, or the cues are not exactly the page's
`data-narr` anchors in order. Edit an essay, forget the audio, and this says so.

## Things worth knowing

- **Tables, lists, figures and stat blocks** cannot be read verbatim. Extraction
  stops with the anchor ids and asks for a hand-written spoken version in
  `pages.json` `overrides` (`{ "s3-table1": "Table one shows ..." }`). Nothing is
  silently skipped. An override is hashed together with the page text, so editing
  either marks the audio stale.
- **Pronunciation** lives in `lexicon.json` (whole-word, case-sensitive). Numbers,
  currency, percentages, ratios and arrows are handled in `lib/spoken.mjs`. The
  page's own words are never changed; captions use the page text, not the spoken form.
- **Timings are exact.** Audio is assembled sentence by sentence from known sample
  counts, so cue times are arithmetic, not forced alignment. Gaps: 0.6 s between
  paragraphs, 1.2 s before a section heading (an audible chapter break), 0.28 s
  between sentences.
- **Loudness** is normalised to -16 LUFS integrated (ITU-R BS.1770-4, implemented in
  `lib/loudness.mjs` and tested against the reference tone), with the peak held
  under -1 dBFS. The mp3 is 24 kHz mono, 64 kbps, with ID3 title/artist/album.
- **Voice** defaults to `af_heart`. Change `voice` / `speed` per page in `pages.json`
  or with `--voice` / `--speed`. A different voice or speed re-synthesises (the cache
  is keyed on voice, speed and text).
- **Provenance** is recorded in each data file: engine, voice, speed, loudness,
  the SHA-256 of the model file, and per-segment text hashes.
- **Licences:** kokoro-js and transformers.js are Apache-2.0; `@breezystack/lamejs`
  (MP3 encoder) is LGPL-3.0. All are build tools only: nothing here is shipped to
  the browser, and the generated audio is yours.

## Layout

```
pages.json          which pages get narration + per-page settings
lexicon.json        pronunciations
build.mjs           script -> voice -> mix -> files
check.mjs           is the audio still true to the page?
verify.mjs          transcribe it back (Whisper) and compare
lib/extract.mjs     [data-narr] -> segments (Playwright, no network, scripts stripped)
lib/spoken.mjs      text -> speakable text, sentence split
lib/timeline.mjs    exact layout, cues, chapters, caption cues
lib/loudness.mjs    BS.1770 loudness + gain
lib/vtt.mjs, lib/id3.mjs, lib/hash.mjs, lib/config.mjs, lib/prepare.mjs
test/               node:test unit tests
```
