// Notes: one short page per LinkedIn / X piece, so the first comment has a portfolio link and the
// piece's figure lives on the site. One counted finding per note, with its denominator and its limit.
// Newest first is the index's job (it sorts by date); order here does not matter.
// Page chrome (labels, index masthead) lives in copy.ts `notesPage`.

export type Note = {
  /** Piece id, e.g. 'p03'. */
  id: string;
  /** URL slug: /notes/<slug>/ */
  slug: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  kicker: string;
  /** The hook, sentence case. Also the h1. */
  title: string;
  /** The one finding, with its denominator. Also the meta description. */
  dek: string;
  /** Paragraphs; the last one is the closing question. */
  body: string[];
  figure: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
    video?: { src: string; poster: string; label: string };
  };
  /** Where each number lives: a repo file or a page section. */
  pointers: { label: string; href: string }[];
  /** The long-form page, when one exists. */
  deep?: { label: string; href: string };
  /** One sentence: the limit of the finding. */
  limit: string;
};

export const notes: Note[] = [
  {
    id: 'p03',
    slug: 'claude-zero-of-63',
    date: '2026-10-11',
    kicker: 'mirror-eval · 63 probes · two waves',
    title: 'Claude cited my site on 0 of 63 probes. Twice.',
    dek: '0 of 63 in August. 0 of 63 in September.',
    body: [
      `A judge note on one of my own eval answers, from the first wave in August, reads: "cites people-search pages (peekyou, kabalarians, hamariweb)."`,
      `Claude cited my site or my repos on 0 of 63 probes in that wave, and on 0 of 63 again in September.`,
      `The run asks four AI search engines the same 63 questions about my work and logs every source each answer cites. The question I cared about was narrow: does the answer cite my site or my repos, or something else?`,
      `Between the waves I cleaned up the web surfaces the engines were reading. For one engine that check passed loudly. Perplexity went from 13 of 63 to 63 of 63. ChatGPT went from 62 to 63. Gemini from 61 to 63.`,
      `Claude stayed at zero. Whatever the cleanup changed, none of it reached Claude's answers.`,
      `What Claude cited instead is a separate count, in citations rather than probes.`,
      `Limits, in plain words. One subject: me. Two waves, 29 days apart. Engine versions were not verifiably frozen between waves. The six cleanup changes went out together, so I cannot say which one moved Perplexity. "Claude" here is the API with web search on, standing in for the product, under the alias claude-sonnet-5 rather than a pinned version. The probe counts are judge-free counts from the run; the raw per-citation file is not in the public repo.`,
      `How many unfrozen waves at 0 of 63 would you need before you file the zero as the engine's behaviour rather than a gap in your own pages?`,
    ],
    figure: {
      src: '/content/p03/claude-zero-of-63.png',
      alt: 'Dumbbell chart of probes, out of 63, on which four AI search engines cited my site or repos in August and September 2026: Perplexity 13 to 63, ChatGPT 62 to 63, Gemini 61 to 63, and Claude 0 to 0 in red, for one subject over two waves with engine versions not verifiably frozen.',
      width: 1080,
      height: 1350,
      caption: 'Probes whose answer cited my site or my repos, out of 63 per engine.',
      video: {
        src: '/content/p03/claude-zero-of-63.mp4',
        poster: '/content/p03/claude-zero-of-63.png',
        label: 'Animated version of the figure. Dumbbell chart of probes, out of 63, on which four AI search engines cited my site or repos in August and September 2026: Perplexity 13 to 63, ChatGPT 62 to 63, Gemini 61 to 63, and Claude 0 to 0 in red, for one subject over two waves with engine versions not verifiably frozen.',
      },
    },
    pointers: [
      { label: 'README.md', href: 'https://github.com/zoeb-nomi/mirror-eval/blob/main/README.md' },
      { label: 'Site page /writing/eval-harness-at-my-own-reflection/', href: 'https://www.zoebnomi.com/writing/eval-harness-at-my-own-reflection/' },
      { label: 'results/2026-09-04/manifest.json', href: 'https://github.com/zoeb-nomi/mirror-eval/blob/main/results/2026-09-04/manifest.json' },
      { label: 'results/2026-08-06/scores.jsonl', href: 'https://github.com/zoeb-nomi/mirror-eval/blob/main/results/2026-08-06/scores.jsonl' },
      { label: 'src/engines.py', href: 'https://github.com/zoeb-nomi/mirror-eval/blob/main/src/engines.py' },
    ],
    deep: {
      label: 'The harness, the two waves and the cleanup, with the counts',
      href: '/writing/eval-harness-at-my-own-reflection/',
    },
    limit: 'One subject, two waves a month apart. Probe counts, not judge verdicts. Engine versions not verifiably frozen.',
  },
];
