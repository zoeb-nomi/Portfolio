# For Claude sessions in this repo

- Read design/README.md before touching any page, component, style, image or video.
  It is the design system; design/tokens.css holds every value (the only token file).
- Copy lives in src/data/copy.ts, never in .astro files.
- Register a new essay per design/README.md section 11 and run build, gate, lint,
  check, a11y, links and lhci before pushing.
- main is live and only Zoeb merges. Push a feature branch and open a draft
  PR only when asked.
