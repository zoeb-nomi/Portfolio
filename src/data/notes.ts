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
      `In August I read a judge note on one of my own eval runs: "cites people-search pages (peekyou, kabalarians, hamariweb)."`,
      `The run asks four AI search engines the same 63 questions about my work and logs every source each answer cites. The question I cared about was narrow: does the answer cite my site or my repos, or something else?`,
      `Three engines cited my own pages on most probes. Perplexity went from 13 of 63 in August to 63 of 63 in September, after I cleaned up the web surfaces the engines were reading. ChatGPT went from 62 to 63. Gemini from 61 to 63.`,
      `Claude cited my site or my repos on 0 of 63 probes in August. Then 0 of 63 in September.`,
      `The finding is the zero, held across a cleanup that moved every other engine. The one surface I control never reached Claude's answers, before or after.`,
      `What filled that space is a separate count, in citations rather than probes, and it gets its own post.`,
      `Limits, in plain words. One subject: me. Two waves, 29 days apart. Engine versions were not frozen between waves. The six cleanup changes went out together, so I cannot say which one moved Perplexity. "Claude" here is the product with web search on, not a pinned model version. The probe counts come from my run log; the raw per-citation file is not in the public repo.`,
      `If you track what answer engines say about your product or your company: do you count the probes on which they cite you, or only whether they cite you at all?`,
    ],
    figure: {
      src: '/content/p03/claude-zero-of-63.png',
      alt: 'Dumbbell chart of four AI search engines showing probes that cited my site or repos, out of 63, from August to September 2026: Perplexity 13 to 63, ChatGPT 62 to 63, Gemini 61 to 63, and Claude 0 to 0 marked in red. One subject, two waves, probe counts rather than judge verdicts.',
      width: 1080,
      height: 1350,
      caption: 'Probes that cited my site or repos, out of 63, August to September 2026',
      video: {
        src: '/content/p03/claude-zero-of-63.mp4',
        poster: '/content/p03/claude-zero-of-63.png',
        label:
          'Animated dumbbell chart: Perplexity moves from 13 to 63 of 63 probes, ChatGPT from 62 to 63, Gemini from 61 to 63, and Claude stays at 0 of 63.',
      },
    },
    pointers: [
      { label: 'Per-engine counts, both waves: mirror-eval README.md', href: 'https://github.com/zoeb-nomi/mirror-eval/blob/main/README.md' },
    ],
    deep: {
      label: 'The harness, the two waves and the cleanup, with the counts',
      href: '/writing/eval-harness-at-my-own-reflection/',
    },
    limit: 'One subject, two waves a month apart. Probe counts, not judge verdicts. Engines, not model versions.',
  },
];
