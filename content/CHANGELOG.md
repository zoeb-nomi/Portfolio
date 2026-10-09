# Changelog: what changed from the 8 Oct handover, and why

## Scope and process
- The content engine lives in a private repo, content-engine, not under scripts/content/ in the portfolio. Reason: 30 pieces of specs, renders, lint reports and fact-check trails would bloat the live site's repo; the portfolio receives only published media and note data.
- Every piece goes through nine stages with separation of duties: a research sheet with file-and-line pointers, writing, an independent editor, an independent fact checker, render, a design lint, a visual review, a text check, and only then a schedule row. The handover's 8 Oct check caught 22 issues in 10 posts; this run's checkers failed every first draft and passed them after two or three rounds.
- No measurement loop or outreach mechanism, per Zoeb's 9 Oct decision. Schedule and forget, with reactive pieces bumping the queue.

## Lineup
- 32 pieces instead of 18 to 20, by splitting overloaded drafts rather than inventing: ZoomInfo out of Post 2, the verdict split out of Post 3, judge-vs-judge and the taxonomy miss out of Posts 7 and 8, three Decisions API follow-ups.
- Cadence 2, 3, 2, 3 days from Sat 11 Oct; the Decisions API post Zoeb scheduled himself for 9 Oct is slot 2.
- Post 9b (baseline vs strict) kept as piece 19 but rewritten as a net count; Post 10 (vendor criteria) rewritten with a stated denominator (4 of 20 vendors) and moved to 23 Nov.
- Keka pieces (24, 26, 28) parked until Zoeb confirms the public figures; the Notion case studies conflict with the work page and resume.
- The lineup label "P5 taxonomy miss" was wrong; the taxonomy verdict rests on P9 (judge agreement 35% against a 60% floor). Piece 22 now says so.

## Numbers corrected against the repos
- Blocker 3 premise: the site's "less than a point" sentence is about link deletion (-0.90 and +0.41), which is correct. The 1.14 figure is the employer swap on gpt-5-mini. The error is in the screener-eval README, not the site. Piece 10 is reframed as "the largest edit effect was 1.14; the screener swap was 22.3".
- The 22.3 gap's denominator is the 232 condition-A calls of the swap run, not 885.
- "227 eligible" in mirror-eval cannot be reproduced from published scores (215 can); not used.
- ZoomInfo 0 to 74 and the poisoned sources 79 to 11 are README counts; raw citations are not public. Stated as such, with "poisoned" as the repo's term.
- "Two of nine predictions held" is stale; the file scores 11 predictions: 4 held (one tied), 1 partial, 1 inconclusive, 3 missed, 2 not testable.
- OpenAI Decisions API: beta released 6 Oct per OpenAI's changelog (not 8 Oct); modes are probability, choice and score; $0.10 per 1M input tokens and no output-token charge confirmed on the docs guide; "about 10x faster than the Responses API" is OpenAI's own wording.
- Engine versions in mirror-eval are "not verifiably frozen", never "not frozen". Waves are single runs, never months.

## Design
- DESIGN.md section 6 was a colour-and-font memo; a 25-point audit produced the social kit rules now in content-engine/kit/social.css: a phone shows 1080 px at 360 CSS px with 3 device px per CSS px, so every site floor is multiplied by three (mono 33, sans 36, serif 60, hairline 3 px, marks 24 px, at most 100 marks per figure). Zones have fixed heights; a figure that does not fit gets a different primitive, never a smaller font.
- A design lint rejects any render that breaks those rules. Every one of the 29 rendered pieces passes it; the first renders of all of them failed it.
- The Post 2 image from the handover carried two findings and the retired palette; the new piece 3 carries one finding and the dumbbell of four engines.
- Motion pieces ship an MP4 for LinkedIn and a GIF for X from the same frames, because GIF support in LinkedIn's scheduler is unresolved.

## Site
- A /notes/ section gives every piece a portfolio home; copy stays in src/data as the repo requires.
- Four fix branches and the notes branch wait behind one pre-upgrade-review gate; Zoeb ticks findings and merges draft PRs in the GitHub web UI.

## 9 October, afternoon: films rebuilt
- The first films (scene crossfades, twelve seconds each, text swapping every two to three seconds) were rejected as slide decks. Replaced by a timeline runtime with a 3D stage (content-engine kit/film.mjs, kit/stage.css, scripts/film.mjs) and one bespoke film.mjs per piece: one object from the work, a different move per film, length from the content (13 to 21 s including the still as opener and closer), nothing to read mid-film but numbers, one red group entering last. The red pen as a motif is limited to the eval and judge pieces; the rest use stamps, stacks, tapes, receipts, rings and cards. The briefs are in content-engine/FILMS.md.
- The still of each film piece is now frame 0 of the film, so the stills carry the topic object too.
- screener-eval films were corrected to the project's shape: the parser test (one PDF through five parsers, 26 of 29 then 29 of 29) is a separate, deterministic test; the screener run is a paired, interleaved run of two cheap models over 21 postings with scripted edits. Verdict words (advance, hold, reject) are the prompt's own schema and appear only in the verdict piece.
- mirror-eval films show the probe to answer to citations flow as the harness ran it (provider APIs with web search, not a chat product); the "sources cleaning" is the August cluster of surface fixes, not a pipeline stage.
- TradeFrame film reuses only the workflow names, schedules and counts from Zoeb's system guide; no tickers, positions, amounts, brokers, bots or hosts.
- Posts: openings rotated across four types tied to each film's first moment; facts frozen to the existing fact-check rows; alt text rewritten per new still.
- Six draft PRs opened on the portfolio (#20 to #25), all green; Zoeb merges in the web UI.

## 9 October, evening: lineup simplified
- Cadence is one post every alternate day from 11 October (11, 13, 15 ... 2 December), per Zoeb; the Decisions API post of 9 October is already live. The three holds that waited on portfolio fixes (#20, #21, #23) became a merge step in the hand-over; p29 is last and still waits on the recruiter-prompt-bank fix.
- Every note is listed on /notes/ from the start; the date gate was removed at Zoeb's request.
- Hand-over pack: one zip with a folder per post (POST.txt with LinkedIn body, first comment, X posts, alt text; the still, mp4, gif or carousel pdf and page pngs), plus SCHEDULE.md and the phone page.
