# zoebnomi.com — portfolio site

Source of [zoebnomi.com](https://zoebnomi.com/?utm_source=github&utm_medium=readme&utm_campaign=portfolio), the personal site of **Zoeb Nomi** — AI Product Manager focused on eval-driven LLM/RAG output quality.

Built with Astro 5. All copy, meta, JSON-LD and llms.txt live in `src/data/copy.ts`. `scripts/geo-gate.mjs` gates the site against canon (46 required strings, 6 banned) — run it after every edit.

Keystone project: [CrossSource](https://github.com/zoeb-nomi/crosssource) — eval methodology for RAG citation quality (precision 0.981 → 0.994, ~95% golden-set citation accuracy, 270K-record corpus).
