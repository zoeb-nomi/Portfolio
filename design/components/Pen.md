# Pen (src/scripts/pen.ts, src/scripts/pen-scroll.ts)

Not a component: the one actor in Red Pen 5. It draws proofreader's marks over real text
as SVG paths in an `svg.pen-layer` over a host (`aria-hidden`, no pointer events).

| mark | meaning |
|---|---|
| `tick` | checked, fine |
| `strike` + `caret` | wrong, corrected |
| `circle` | wrong, flagged; on hover, "this one" |
| `underline` | stress (last line only on a multi-line target) |
| `box` | scope |
| `cross` | rejected |
| `leader` | a line to the margin note |

**Attributes** (no component needed, `pen-scroll.ts` runs on every page):
`data-pen="<mark>"`, `data-pen-on="hover"` (with `data-pen-zone` on the hover area),
`data-pen-delay="<ms>"`, `data-pen-heavy`, `data-pen-target` (on a child: mark the
child, draw in the parent), `data-pen-key` (seed for the wobble), `data-tally` (a number
that counts up to its own text).

Paths are generated from the target's client rects with a seeded wobble (mulberry32), so
they are stable across loads and resizes. Duration scales with path length
(260 to 900 ms, `--ease-pen`). Marks redraw without animation on resize.
