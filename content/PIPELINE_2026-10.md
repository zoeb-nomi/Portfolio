# Production pipeline for the content library (refined plan, 9 Oct 2026)

Approved so far: the 32-piece lineup and schedule (content/LINEUP_2026-10.md), 18:00 IST, X 2 to 3 hours later, Misses yes once the page fix merges, Post 1 first comment with the CrossSource README, a new portfolio section for pieces without a deep page.

This document is the how. The principle: every quality rule that can be a script is a script, every judgement call is a short rubric applied by a reviewer who did not make the thing, and nothing ships to the schedule document until both have passed.

## 1. Where it lives

A new private repo, `zoeb-nomi/content-engine`. The portfolio repo stays the home of the published pages and media only.

```
content-engine/
  CLAUDE.md              the process in 60 lines: voice card, never-said list, commands, rubric. A future session (ad hoc post) reads this and nothing else.
  kit/
    tokens.css           pinned copy of the portfolio tokens; sync script fails if the portfolio copy drifts
    social.css           the 1080x1350 grid, zones, type floors, mark sizes, motion timing
    primitives/          unit-strip, dumbbell, bar-list, waterfall, stat-tile, compare-table, answer-sheet (HTML + CSS each)
    motion.js            beat timeline, easing from tokens, hold-at-end, seamless loop, caption zone
    fonts/               the portfolio woff2 subsets
  pieces/pNN-slug/
    source.md            research sheet: numbers with file:line, denominators, limits, the opening moment, figure data
    post.md              LinkedIn body, first comment, X version, alt text, status
    figure.json          primitive, data, the single red mark, title, method line, footer limit, storyboard beats
    FACTCHECK.md         written only by the checker agent
    out/                 png, mp4, gif, pdf, contact-sheet, lint report
  scripts/
    new-piece.mjs        scaffold a piece folder from a slug and a source
    research.mjs         runs the source-sheet brief against a cloned repo (prompt template, not a model call)
    render.mjs           figure.json to png; --motion to mp4 and gif; --pdf to carousel
    design-lint.mjs      the rendered-image gate (section 3)
    text-check.mjs       the copy gate (section 4, stage 7)
    contact-sheet.mjs    six thumbnails on one image for review
    sync-portfolio.mjs   copies media and note data into the portfolio checkout
    schedule.mjs         pieces to SCHEDULE.md and schedule.html (phone page, copy buttons)
  SCHEDULE.md, schedule.html
```

Portfolio side: `public/content/<slug>/` for media, `src/data/notes.ts` for the note pages (copy stays in src/data per CLAUDE.md), one route `src/pages/notes/[slug].astro` and an index, registered once in the eight places. Each note shows the figure, the body, the pointers, and the link to the deep page where one exists.

## 2. Stage 0: design audit, then the kit (before any piece)

The audit answers one question: is DESIGN.md section 6 enough to produce a 1080x1350 social still, a looping video and a PDF carousel that look like the site and read on a phone? Today it is not. It covers 1080x1080 and OG only, gives three type floors in points with no grid, and says nothing about zones, mark sizes, motion timing or carousels.

What the Decisions poster shows (the reference the audit uses):
- Four header lines in two faces, with two different left margins (60 and 50 px).
- A crammed label row ("CANDIDATE ... MARKED AGAINST ...") that reads as noise at phone scale.
- Answer rows about 5 px apart, so the ticks disappear at a third of the size; red marks overlap each other.
- A dead band between the sheet and the finding; the finding is not the largest thing on the page.
- Footer at label size, ink-muted, on the bottom edge.

Audit output, as a numbered findings list for you to tick (the same format as the site gates), and then the kit implements the ticked items. Proposed rules, to be confirmed by the audit:
- A 1080x1350 grid: 72 px margins, 8 px baseline, 12 columns. Every element snaps.
- Five zones with fixed heights: kicker (mono caps, one line), title (serif, two lines max), figure, finding line (serif, the largest text on the page, one line), method and footer (mono, two lines max). Nothing moves between zones; a figure that does not fit its zone gets a different primitive, not a smaller font.
- Type floors at 1080 px wide: title 72 px, finding line 56 px, sans running text 36 px, mono labels 30 px, nothing below 28 px. Weights 400 and 500 only. These floors are set for a 360 px phone, which shows the image at a third of its size.
- Marks: minimum 14 px, minimum 6 px gap between marks, no overlaps; a dataset too dense for that gets binned or sampled and the method line says so.
- One red group per image. Red is the finding, never a heading, never decoration.
- Hairlines 1 px rule, 2 px for emphasis, radius 0, no shadows, no gradients, no logos, no URLs.
- Motion: beats of 1.2 s with 200 ms eases from the tokens, a 2 s hold on the final state, seamless loop, first frame is the still, caption zone fixed, 1080x1350 at 30 fps, under 45 s, under 5 MB for GIF.
- Carousel: the cover is the still; one idea per page; page type floors as above; last page is the limit and the pointer, never a call to action.

The kit codifies the rules as CSS and the primitives, and section 3 enforces them. A DESIGN.md section 6 rewrite goes to the portfolio as a small PR for you to merge, so the site and the social kit share one source.

## 3. The design lint (the gate that stops shitty media)

`design-lint.mjs` opens the rendered HTML in Playwright before screenshotting and fails the render if any of these are true:
- any text node computed size below its zone floor, or weight above 500, or a font outside the three faces
- any element outside its zone or crossing the 72 px margin
- any colour outside the token palette; more than one red group; any radius, shadow or gradient
- marks smaller than 14 px or overlapping
- title over two lines, finding line over one line, method and footer over two lines
- for motion: first frame differs from the still, no hold at the end, loop seam visible (frame 0 vs last frame diff above a threshold), duration or size over limits
- for PDF: any page not 1080x1350, more than 8 pages, cover differs from the still
- for all: alt text present and under 1,000 characters, no URL, no em or en dash in rendered text

It writes a report next to the output. A render with a failing report never reaches the contact sheet. This is the same idea as the site's tokens audit, pointed at social output.

## 4. The pipeline per piece

| Stage | What | Who | Input | Output | Gate |
|---|---|---|---|---|---|
| 1 Research | the source sheet: every number with file:line, denominators, limits, the raw rows the figure needs, the opening moment (a label, an item, a log line) | Sonnet, batched per repo so each repo is loaded once | cloned repo, essay page | source.md, under 300 words | sheet has no number without a pointer |
| 2 Write | body, first comment, X version, alt text, figure spec with the one red mark, storyboard beats if motion | Opus (me), in batches of 4 by arc | source.md, voice card | post.md, figure.json | per-post checklist: moment opener, finding with denominator inside the first 140 characters or the next sentence, the move, the limit, one question an eval owner would argue |
| 3 Red pen | an editor who did not write it: hook, cuts, repetition across the run, bans; returns a diff | Opus, fresh context, reads only the post | post.md | diff applied or rejected with a reason | no opener or question shape repeats within 5 pieces |
| 4 Fact check | every number, model name, denominator and attribution against the repo and the live page | Sonnet, separate, never the writer | post.md, figure.json, repos | FACTCHECK.md with pointers, PASS or FAIL | FAIL returns to stage 2 with the diff |
| 5 Render | figure.json to png, mp4, gif, pdf | code | figure.json, kit | out/ | design lint passes |
| 6 Visual review | a ten-line critique against the rubric: finding first, hierarchy, zones, breathing room, legibility at 360 px (a downscaled copy is reviewed, not the original), red once, alignment, caption, footer; for motion the three storyboard stills are reviewed before encoding | Opus (me), on a contact sheet of six | out/ | fix to figure.json, re-render | at most two rounds; a third means the primitive is wrong |
| 7 Text check | dashes, emoji, URLs in body, body 1,200 to 2,500 characters, banned phrases, privacy regexes, UTM matches the piece | code | post.md | status READY | all pass |
| 8 Publish to portfolio | media copied, note page data generated, build, gate, lint, check, qa, tokens, audio:check | code, then the pre-upgrade-review gate | pieces, portfolio checkout | a PR you merge | gate findings ticked |
| 9 Schedule doc | one row per piece with every field and link | code | pieces | SCHEDULE.md, schedule.html | no piece without status READY or CONDITIONAL |

Why the order: research before writing so the writer never invents a number; writing before rendering so the figure serves the finding and not the other way round; the red pen and the fact check in parallel after writing; storyboard stills before encoding so a video is never re-rendered three times (the Decisions lesson); the text check last because the red pen may change words.

## 5. The pilot: piece 3 end to end, by Saturday 11 Oct 18:00

Piece 3 (Claude 0 of 63) runs through every stage first, with the kit built around it. You see: the audit findings list, the kit, the pilot's source sheet, post, fact check, still, GIF, note page preview, and lint reports. You tick the audit findings and say go on the pilot. Only then does the batch run start. If the pilot takes three rounds on the image, the kit is wrong and gets fixed before 31 more pieces go through it.

## 6. The batch run

Order: by arc, so each batch of four shares a source sheet set and reads as one voice. Judge arc (8, 14, 22), Decisions arc (4, 7, 12, 30), screener arc (5, 10, 13, 18, 23), CrossSource (6, 19), mirror-eval (11, 15, 17), prompt-bank (9, 20, 27, 29), TradeFrame (21), Misses (16, 25), Keka (24, 26, 28), method (31, 32). Motion pieces (5, 9, 15, 17, 21) and carousels (11, 16, 23, 24) render after all stills are through, because the primitives are proven by then.

Your touch points, in total: the audit tick list, the pilot go, one contact-sheet review per batch if you want it (optional; my review runs regardless), the four blocker PRs and the notes-section PR to merge, and the schedule document at the end.

## 7. Ad hoc pieces (the 48-hour pattern)

`new-piece.mjs <slug>` scaffolds the folder. The same nine stages run, in one session, with a Decisions-style playbook in CLAUDE.md: pick the count that can run in a day, source sheet, write, red pen, fact check against the vendor's official page, render, lint, review, check, note page, schedule row. The kit and the lint make the media part a render, not a project. A reactive piece bumps the next scheduled slot by one.

## 8. Token economy

Codified: research prompts, rendering, lint, text check, contact sheets, schedule doc, portfolio sync are scripts or fixed prompt templates; they cost tokens once to build and nothing after. Per piece after the kit exists: research about 8k (Sonnet, amortised per repo), write about 6k out, red pen about 4k, fact check about 8k (Sonnet), review about 3k per round. Roughly 30 to 40k per piece, about 1.1 to 1.3M for the run, plus the kit, audit and pilot (about 400k) and the portfolio work and gates (about 500k). At API rates roughly 70 to 95 dollars, most of it Sonnet. Reactive pieces later cost the per-piece figure only.

## 9. Needed from you now

1. The private repo: I create `zoeb-nomi/content-engine` (private) through the GitHub connector if it allows repo creation; otherwise you create it empty in the GitHub UI and tell me.
2. Nothing else. The audit findings list is the next thing you see, then the pilot.
