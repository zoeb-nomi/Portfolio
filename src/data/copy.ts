// src/data/copy.ts
// Every string on zoebnomi.com, transcribed verbatim from COPY PACK v1 · 2026-08-02.
// Templates import from here only — no copy is authored in .astro files.
// Design-authored strings (orchestrator-approved 2026-08-02, build-spec.md §12) are marked below.

export interface NavItem {
  label: string;
  href: string;
  // Extra path prefixes that also count as "current" for this nav item —
  // e.g. Evals covers /crosssource/ and /mirror-eval/ in addition to its
  // own /evals/ index.
  activePrefixes?: string[];
}

export function isNavCurrent(item: NavItem, currentPath: string): boolean {
  if (item.href === '/') return currentPath === '/';
  if (currentPath.startsWith(item.href)) return true;
  return item.activePrefixes?.some((p) => currentPath.startsWith(p)) ?? false;
}

export interface CtaLink {
  label: string;
  href: string;
}

// ---------------------------------------------------------------------------
// 1 · GLOBAL
// ---------------------------------------------------------------------------

export const site = {
  name: 'Zoeb Nomi',
  titleSuffix: 'Zoeb Nomi · AI Product Manager',
  titlePattern: (page: string) => `${page} — Zoeb Nomi · AI Product Manager`,
    footerLine:
      'Zoeb Nomi · AI Product Manager — LLM Evaluation & RAG Quality · Bengaluru (IST) · Open to US relocation',
};

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Evals', href: '/evals/', activePrefixes: ['/crosssource/', '/mirror-eval/', '/screener-eval/'] },
  { label: 'Writing', href: '/writing/' },
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
];

// Evals index switcher — reused in the /evals/ index and in the margin-column
// switcher on /crosssource and /mirror-eval.
export const evalsSwitcher = [
  { name: 'CrossSource', href: '/crosssource/' },
  { name: 'mirror-eval', href: '/mirror-eval/' },
  { name: 'screener-eval', href: '/screener-eval/' },
];

export const cta = {
  bookACall: { label: 'Book a call', href: 'https://calendar.app.google/56javKNeXqw7X8oq6' } as CtaLink,
  email: { label: 'Email', href: 'mailto:zoeb.nomi@gmail.com' } as CtaLink,
  linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zoebnomi' } as CtaLink,
  github: { label: 'GitHub', href: 'https://github.com/zoeb-nomi' } as CtaLink,
};

// ---------------------------------------------------------------------------
// 8 · OG / META (per page) — pack §8
// ---------------------------------------------------------------------------

export const meta = {
  home: {
    title: 'Zoeb Nomi — AI Product Manager at Instead | LLM Evaluation & RAG Quality',
    description:
      'AI product manager at Instead, in Bengaluru. I own LLM output quality for a production tax-research system — eval loops, citation accuracy — and CrossSource.',
  },
  crosssource: {
    title: 'CrossSource: RAG citation evaluation — Zoeb Nomi',
    description:
      'Open harness measuring citation accuracy in legal RAG: 0.981→0.994 precision, validated LLM judge (100% blind agreement, 15/15), and a failure taxonomy that separates prompting from retrieval.',
  },
  writingJudgeBug: {
    title: "The judge caught a bug I didn't — Zoeb Nomi",
    description:
      "Validating an LLM-as-judge: a blind human check that agreed 15/15 still caught a real harness bug the judge couldn't see — and why 15/15 and a broken instrument can coexist. From CrossSource, an open RAG citation-evaluation harness.",
  },
  writingIndex: {
    title: 'Writing — Zoeb Nomi',
    description: 'Notes on LLM evaluation, LLM-as-judge reliability, and RAG output quality — from CrossSource and production eval work.',
  },
  evals: {
    title: 'Evals — Zoeb Nomi · AI Product Manager',
    description:
      'Two open evaluation harnesses built to one method: CrossSource (citation accuracy in legal RAG) and mirror-eval (what AI search engines say about a person). Judges validated blind; numbers counted, not scored.',
  },
  mirrorEval: {
    title: 'mirror-eval: what AI search says about a person — Zoeb Nomi',
    description:
      'Open harness measuring what four AI search engines say about a person, twice: Perplexity 13→63 of 63 probes citing the canonical site, Claude 0→0, a data broker filling the gap, and a judge that failed blind validation — so the numbers are counts, not scores.',
  },
  writingReflection: {
    title: 'I pointed an eval harness at my own reflection — Zoeb Nomi',
    description:
      'Engines fill rather than abstain; self-published claims get discounted; the LLM judge failed blind validation and the study got stronger for it. Three findings from running an eval harness on my own name.',
  },
  screenerEval: {
    title: 'screener-eval: what LLM résumé screeners reward — Zoeb Nomi',
    description:
      'One résumé, 21 open AI PM roles, two LLM screeners, 885 scored calls. Swapping employers for fictional ones and deleting links each moved the score under a point; the choice of screener moved it 22. Paired, repeated, counted — no judge.',
  },
  writingTwoLevers: {
    title: '885 screenings, one résumé, and the two levers that did not move — Zoeb Nomi',
    description:
      "Employer names and evidence links did nothing measurable to an LLM screener's score; which screener read the résumé moved it 22 points, and its own noise was bigger than either lever.",
  },
  work: {
    title: 'Work — Zoeb Nomi · AI Product Manager',
    description:
      'Instead (LLM output quality), Multiplier (global employment), Keka HR (zero-to-one BGV, $2.7M MRR), Hurix. Four companies, two promotions, quality you can measure.',
  },
  about: {
    title: 'About Zoeb Nomi — AI Product Manager at Instead, Bengaluru',
    description:
      'Mechanical engineer turned AI product manager. Bengaluru, open to US relocation. Evals are a product surface, not a QA afterthought.',
  },
};

// ---------------------------------------------------------------------------
// PUBLIC RECORD — third-party and first-party artefacts that corroborate the
// claims made elsewhere on the site. Every URL here is public and checkable.
// ---------------------------------------------------------------------------

export const sources = {
  kekaProfile: {
    href: 'https://medium.com/keka-product/meet-zoeb-nomi-the-rabbit-hole-explorer-and-corehr-maestro-a252fedbe113',
    headline: 'Meet Zoeb Nomi: The Rabbit-Hole Explorer and CoreHR Maestro',
    publisher: 'Keka',
    datePublished: '2025-01-16',
  },
  insteadResearch: { href: 'https://instead.com/products/research' },
  veremarkPartner: { href: 'https://usemultiplier.com/marketplace/partner/veremark' },
  kekaBgvVideo: { href: 'https://www.youtube.com/watch?v=rPYfTCj181w' },
};

export const googleSiteVerification = 'vgzEQSI7C-PSHphOVsVKmJtkssXkxltkinTBE9NIPDM';
export const cloudflareBeaconToken = 'f73bbdec2def46e98c0bd8c94edf3bdf';

// ---------------------------------------------------------------------------
// 7 · JSON-LD — pack §7, verbatim
// ---------------------------------------------------------------------------

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.zoebnomi.com/#person',
  name: 'Zoeb Nomi',
  givenName: 'Zoeb',
  familyName: 'Nomi',
  jobTitle: 'Product Manager',
  disambiguatingDescription:
    'Zoeb Nomi is an individual person: a product manager based in Bengaluru, India, who works on evaluation and output quality for large language model and retrieval-augmented generation products.',
  description:
    'Product manager at Instead, an AI-native tax research and planning platform. Works on LLM and RAG output quality: evaluation harnesses, citation accuracy, LLM-as-a-judge validation and model benchmarking. Author of CrossSource, an open-source evaluation harness for citation accuracy in legal RAG.',
  worksFor: {
    '@type': 'Organization',
    name: 'Instead',
    url: 'https://www.instead.com/',
    description: 'AI-native tax research, planning and filing platform.',
  },
  url: 'https://www.zoebnomi.com',
  email: 'mailto:zoeb.nomi@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
  knowsAbout: [
    'Large language model evaluation',
    'Retrieval-augmented generation',
    'RAG citation accuracy and grounding',
    'LLM-as-a-judge evaluation and judge validation',
    'Model benchmarking and regression testing for LLM products',
    'AI product management',
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'MIT Aurangabad' },
    { '@type': 'EducationalOrganization', name: 'STOA' },
  ],
  subjectOf: [
    {
      '@type': 'Article',
      headline: 'Meet Zoeb Nomi: The Rabbit-Hole Explorer and CoreHR Maestro',
      url: sources.kekaProfile.href,
      datePublished: '2025-01-16',
      publisher: { '@type': 'Organization', name: 'Keka' },
    },
  ],
  sameAs: [
    'https://www.linkedin.com/in/zoebnomi',
    'https://github.com/zoeb-nomi',
    'https://x.com/zoeb_nomi',
    'https://topmate.io/zoebnomi',
    'https://www.zoebnomi.com',
    'https://www.wikidata.org/wiki/Q141108023',
    'https://orcid.org/0009-0004-6287-6152',
  ],
};

export const softwareSourceCodeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'CrossSource',
  description:
    'Open evaluation harness measuring citation accuracy in retrieval-augmented generation over public court opinions. Citation precision 0.981–0.994; 100% (15/15) blind human–judge agreement.',
  codeRepository: 'https://github.com/zoeb-nomi/crosssource',
  programmingLanguage: 'Python',
  author: { '@type': 'Person', name: 'Zoeb Nomi', url: 'https://www.zoebnomi.com' },
};

// mirror-eval — copy-pack-additions.md §16, verbatim
export const mirrorEvalJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'mirror-eval',
  description:
    'Open evaluation harness measuring what AI search engines say about a person, with a claim-failure taxonomy, dual-family LLM judges validated blind against a human, and a judge-free citation trail. Two waves, 332 probes each, across ChatGPT, Claude, Perplexity and Gemini.',
  codeRepository: 'https://github.com/zoeb-nomi/mirror-eval',
  programmingLanguage: 'Python',
  version: '1.0',
  author: { '@type': 'Person', name: 'Zoeb Nomi', url: 'https://www.zoebnomi.com' },
};

// screener-eval — copy-pack-s17.md §19, verbatim
export const screenerEvalJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'screener-eval',
  description:
    'Paired, repeated evaluation harness for LLM résumé screeners: one résumé, 21 open job postings, two screening models, counted deltas with bootstrap confidence intervals, plus a deterministic parser test. No LLM judge.',
  codeRepository: 'https://github.com/zoeb-nomi/screener-eval',
  programmingLanguage: 'Python',
  author: { '@type': 'Person', name: 'Zoeb Nomi', url: 'https://www.zoebnomi.com' },
};

// ---------------------------------------------------------------------------
// 2 · HOME — pack §2 + build-spec §8.1
// ---------------------------------------------------------------------------

export const home = {
  eyebrow: 'AI Product Manager · LLM Evaluation & RAG Quality',
  h1Line1: 'LLM products fail quietly.',
  h1Underline: 'quietly.',
  h1Line2: 'I build the evals that catch them.',
  unflaggedMark: '[unflagged]', // design-authored, §12
  figure1Caption: 'Fig. 1 — Zoeb Nomi. Bengaluru (IST). US-morning slots kept open.',
  reviewerNote:
    // design-authored, orchestrator-approved §12
    "Reviewer's note — the quiet failure is the whole problem. Nothing in the output looks wrong. The eval is the only thing standing between a plausible sentence and a filed document.",
  subheadPre:
    "I'm Zoeb Nomi. At Instead — an AI-native tax research and planning platform, the first new entrant to clear IRS e-filing approval alongside incumbents — I own end-to-end output quality for a production tax-research LLM: citation accuracy, model benchmarking, and the evaluation loops that catch regressions before release. ",
  subheadHighlight: "In tax research, a wrong citation isn't a UX bug. It's a compliance risk.",
  proofStrip: [
    {
      value: '0.994',
      verdict: '✓',
      sub: null as string | null,
      label: 'citation precision under strict citation discipline',
      provenance: '(CrossSource v0.1; baseline 0.981)',
    },
    {
      value: '100%',
      verdict: null as string | null,
      sub: '(15/15)',
      label: 'blind human–judge agreement validating the LLM judge',
      provenance: null as string | null,
    },
    {
      value: '~95%',
      verdict: null as string | null,
      sub: null as string | null,
      label: 'citation accuracy held on a production golden set',
      provenance: null as string | null,
    },
  ],
  // Evals block — replaces the single flagship card, copy-pack-additions.md §11,
  // added 2026-09-10. Rendered by EvalsBlock.astro inside Section §2.
  evals: {
    kicker: 'Evals',
    h2: 'Three harnesses, one method.',
    methodLine: 'Build the judge. Validate it blind against a human. Count what you can. Report the rest as bands.',
    cards: [
      {
        name: 'CrossSource',
        description:
          'An open evaluation harness for citation accuracy in legal RAG. 22 public court opinions, a 25-question golden set, an LLM judge validated blind against a human — 100% (15/15) — and a real harness bug caught by that validation.',
        linkLabel: 'Read the case study →',
        linkHref: '/crosssource/',
      },
      {
        name: 'mirror-eval',
        description:
          'The same method pointed at what AI search engines say about me. Four engines, 63 search probes each, two waves a month apart. The judges failed blind validation — 3/40 and 12/40 — so the study stands on counted citations instead: Perplexity 13 → 63 of 63, Claude 0 → 0.',
        linkLabel: 'Read the case study →',
        linkHref: '/mirror-eval/',
      },
      {
        name: 'screener-eval',
        description:
          'The same résumé through two LLM screeners, 885 times, against 21 open AI PM roles. Swapping every employer for a fictional one moved the score by under a point; so did deleting every link. Which screener read it moved it by 22.',
        linkLabel: 'Read the case study →',
        linkHref: '/screener-eval/',
      },
    ],
    closeLine:
      'One judge passed and caught a bug. One judge failed and the study survived on counts. One needed no judge at all. Same method three times — that is the point.',
  },
  measuredLabel: 'Measured, not asserted', // design-authored §12
  howIWorkLabel: 'How I work', // design-authored §12
  methods: [
    {
      n: '01',
      name: 'Instrument', // design-authored §12
      description:
        'Flag → classify by failure mode → weekly review, scored on a four-dimension rubric: answerability, accuracy, citation quality, actionability.',
    },
    {
      n: '02',
      name: 'Taxonomize', // design-authored §12
      description:
        'A failure taxonomy instead of a single score — so you know whether the fix belongs to prompting or to retrieval.',
    },
    {
      n: '03',
      name: 'Validate the judge', // design-authored §12
      description:
        'An unvalidated eval reports wrong numbers with full confidence — precisely the failure mode the eval exists to catch.',
    },
  ],
  ctaSlabMarginNow: 'NOW: PM AT INSTEAD',
  ctaSlabMarginBefore: 'BEFORE: $2.7M MRR FROM ZERO AT KEKA HR',
  ctaSlabBody: "If you're shipping an LLM product, let's talk about what your evals miss.", // design-authored §12
};

// ---------------------------------------------------------------------------
// 3 · CROSSSOURCE — pack §3
// ---------------------------------------------------------------------------

export const crosssource = {
  kicker: 'Case study · Open evaluation harness · v0.1 · Python',
  title: 'CrossSource: measuring whether a RAG system can be trusted to cite the law',
  standfirst:
    'An open evaluation harness for citation accuracy in legal RAG — built to answer one question with rigor: when the system cites a court opinion, is the claim actually supported by that source?',
  specBlock: [
    { label: 'Corpus', value: '22' },
    { label: 'Golden set', value: '25' },
    { label: 'Retrieval', value: 'BM25 top-5' },
    { label: 'Judge validated', value: '15/15' },
  ],
  repoHref: 'https://github.com/zoeb-nomi/crosssource',
  repoLabel: 'github.com/zoeb-nomi/crosssource',

  s1: {
    mark: '§1',
    label: 'Why this exists',
    paraPre: 'In ',
    caseName: 'Mata v. Avianca',
    paraMid:
      ', lawyers were sanctioned for filing a brief full of citations an AI invented. ',
    highlight:
      'Citation hallucination is the canonical trust failure of legal AI — and it is exactly the class of failure my day job revolves around.',
    paraPost:
      ' CrossSource is the public, reproducible version of that work: a fixed corpus, a golden question set, and an evaluation pipeline anyone can run.',
  },

  s2: {
    mark: '§2',
    label: 'Method',
    rows: [
      {
        term: 'Corpus',
        kind: 'plain' as const,
        body:
          "22 public-domain US court opinions (16 Supreme Court, 2 federal circuit, 4 state), sourced from Harvard Law School's Caselaw Access Project, chunked to ~350 words.",
      },
      { term: 'Retrieval', kind: 'plain' as const, body: 'BM25, top-5.' },
      {
        term: 'Generation',
        kind: 'code' as const,
        bodyPre: 'Claude with mandatory inline citations in ',
        code: 'doc_id:chunk_id',
        bodyPost: ' format.',
      },
      {
        term: 'Golden set',
        kind: 'plain' as const,
        body: '25 human-authored questions with verified ground-truth supporting chunks.',
      },
      {
        term: 'Two configurations',
        kind: 'configs' as const,
        italic1: 'baseline',
        mid: ' (citation formatting only) vs ',
        italic2: 'strict',
        bodyPost: ' (explicit citation-discipline rules in the prompt).',
      },
      {
        term: 'Scoring',
        kind: 'plain' as const,
        body: 'claim-level citation precision and recall, faithfulness, and answer relevance — scored by an LLM judge, validated by hand (below).',
      },
    ],
  },

  s3: {
    mark: '§3',
    label: 'Findings',
    table1: {
      caption: 'Table 1 — baseline vs. strict',
      columns: ['Dimension', 'Baseline', 'Strict'],
      rows: [
        { dimension: 'Citation precision', baseline: '0.981', strict: '0.994', strictWins: true },
        { dimension: 'Citation recall', baseline: '0.760', strict: '0.760', strictWins: false },
        { dimension: 'Faithfulness', baseline: '1.000', strict: '1.000', strictWins: false },
        { dimension: 'Answer relevance', baseline: '0.980', strict: '0.960', strictWins: false },
      ],
    },
    table2: {
      caption: 'Table 2 — failure taxonomy by configuration',
      columns: ['Error type', 'Baseline', 'Strict'],
      rows: [
        { type: 'Right document, wrong passage', baseline: '3', strict: '1', strictWins: true },
        { type: 'Missing authority', baseline: '6', strict: '6', strictWins: false },
        { type: 'Wrong document', baseline: '0', strict: '0', strictWins: false },
        { type: 'Unsupported claim', baseline: '0', strict: '0', strictWins: false },
      ],
    },
    findingLeadIn: 'The finding that matters:',
    findingPre:
      ' prompting discipline buys precision — wrong-passage citations drop 3 → 1, precision rises 0.981 → 0.994. It cannot buy recall: 0.760 in both configurations, because every missing-authority failure traces to retrieval, not generation. Knowing ',
    findingItalic: 'which layer owns the failure',
    findingPost: ' is the entire point of separating the metrics.',
  },

  s4: {
    mark: '§4',
    label: 'The judge caught a bug — because I checked the judge',
    statQuote: '100% agreement (15/15)',
    statPre: "I hand-graded a blind, stratified sample of the judge's citation-precision verdicts: ",
    statPost: '.',
    bugPara:
      'That validation pass also surfaced a genuine harness defect — consecutive citations produced punctuation-only claim spans that the judge initially mislabeled as failures. Fixing it changed the metrics.',
    lessonQuote:
      'That is the lesson worth paying for: an unvalidated eval reports wrong numbers with full confidence — precisely the failure mode the eval exists to catch.',
    marginNote: 'Validation pass — stratified blind sample, hand-graded.',
  },

  s5: {
    mark: '§5',
    label: 'What this demonstrates',
    intro: 'The same discipline I run in production:',
    items: [
      'Instrument the pipeline',
      'Build a failure taxonomy instead of a single score',
      'Validate the judge externally',
      'Separate precision from recall — so you know whether to fix prompting or retrieval',
    ],
  },

  s6: {
    mark: '§6',
    label: 'Next (v0.2)',
    status: 'In build',
    items: [
      'Retrieval ablations',
      'Cross-model judge comparison',
      'Law-trained annotation review',
      'Per-question difficulty stratification',
      'An agent-eval module — in build',
    ],
  },

  ctaSlabBody: 'Read the code, run the harness →',
};

// ---------------------------------------------------------------------------
// MIRROR-EVAL — copy-pack-additions.md §12, added 2026-09-10. Same shape as
// CrossSource (§3 above) section-for-section: masthead, Section blocks with
// mark/label, DataTable, a bold lead-in finding paragraph, PullQuote, Related
// writing cross-link, CTASlab. The kicker and specBlock values follow
// CrossSource's own established pattern (case study · harness type · version
// · language / a 4-item spec block) — the copy pack does not dictate that
// exact wording, only the numbers, so these are structural labels, not
// invented prose.
// ---------------------------------------------------------------------------

export const mirrorEval = {
  kicker: 'Case study · Open evaluation harness · v1.0 · Python',
  title: 'mirror-eval: pointing an eval harness at what AI search says about me',
  standfirst:
    'Same fixes, four engines, opposite outcomes — and a zero that turned out to be the most useful number in the study. An open harness for measuring what AI search engines say about a person, built to the CrossSource method: explicit ground truth, a failure taxonomy instead of a bare score, a judge whose agreement with a human is measured rather than assumed, and a limitations section that says what the numbers cannot support.',
  specBlock: [
    { label: 'Engines', value: '4' },
    { label: 'Probes', value: '332 per wave' },
    { label: 'Waves', value: '2' },
    { label: 'Judge validated', value: '3/40 · 12/40' },
  ],
  repoHref: 'https://github.com/zoeb-nomi/mirror-eval',
  repoLabel: 'github.com/zoeb-nomi/mirror-eval',

  s1: {
    mark: '§1',
    label: 'Why this exists',
    body:
      "Recruiters, buyers and counterparties increasingly ask an AI engine about you before they ask you. The answer is assembled from whatever the crawlers found — a dead portfolio, a scraped aggregator, a job you left two years ago — and you cannot see it from inside your own account, cannot A/B it, and nobody sends you a report. Existing tooling measures whether you are mentioned. That is the easy half. The hard half is whether the mention is true, current, and sourced to something you control. That is a scoring problem, which makes it an eval problem — the same class of problem as asking whether a production LLM's citation actually supports its claim. So I pointed the harness at my own reflection.",
  },

  s2: {
    mark: '§2',
    label: 'Method',
    rows: [
      {
        term: 'Subject',
        kind: 'code' as const,
        bodyPre: 'Me. ',
        code: 'canon.yaml',
        bodyPost:
          ' holds the ground truth — true claims, stale claims, clean and poisoned sources — and is the only file with facts in it. Point it at anyone.',
      },
      {
        term: 'Engines',
        kind: 'plain' as const,
        body:
          "ChatGPT, Claude, Perplexity, Gemini, through each provider's own API and retrieval stack. Aggregators would bolt a third-party search layer onto the model and measure a system nobody uses.",
      },
      {
        term: 'Battery',
        kind: 'plain' as const,
        body:
          '83 probes per engine per wave — 63 search-mode, 20 knowledge-mode — 332 per wave. Prompts are derived from facets (scaffolding, prior, decision, output shape), not topics; every cell is repeated, because a single probe cannot tell "the fix worked" from "we resampled."',
      },
      {
        term: 'Two waves',
        kind: 'plain' as const,
        body: 'Baseline 2026-08-06, lift 2026-09-04. Identical battery, canon, and composition.',
      },
      {
        term: 'Between the waves (Aug 7–20)',
        kind: 'plain' as const,
        body:
          'Six changes to the surfaces engines read — a Bing Webmaster submission, a homepage link to the CrossSource repo, LinkedIn and profile-page cleanup, a DOI and identifier records, a new /writing/ page. They landed as a cluster, and are attributed as one.',
      },
      {
        term: 'Two judges from different model families',
        kind: 'plain' as const,
        body:
          'Tag every answer against a claim-failure taxonomy; then a blind, stratified human-labelled sample of 40 decides whether any judged number can be cited.',
      },
      {
        term: 'Two kinds of number',
        kind: 'plain' as const,
        body:
          'Counted: which surfaces each engine actually cited — judge-free. Judged: taxonomy categories — reported as bands unless validation says otherwise.',
      },
    ],
  },

  s3: {
    mark: '§3',
    label: 'Findings',
    intro: 'Probes citing an owned surface, of 63 search-mode probes per engine, Wave 1 → Wave 2:',
    table1: {
      caption: 'Table 1 — owned-surface citations by engine, Wave 1 → Wave 2',
      columns: ['Engine', 'zoebnomi.com', 'github.com/zoeb-nomi', 'Owned (site or repo)'],
      rows: [
        { engine: 'ChatGPT', site: '62 → 54', repo: '0 → 25', owned: '62 → 63', bold: false },
        { engine: 'Claude', site: '0 → 0', repo: '0 → 0', owned: '0 → 0', bold: true },
        { engine: 'Perplexity', site: '13 → 63', repo: '0 → 0', owned: '13 → 63', bold: true },
        { engine: 'Gemini', site: '61 → 63', repo: '0 → 32', owned: '61 → 63', bold: false },
      ],
    },
    table2Intro: 'What filled the gap (citation counts, Wave 1 → Wave 2):',
    table2: {
      caption: 'Table 2 — what filled the gap, Wave 1 → Wave 2',
      columns: ['Surface', 'Engine', 'Count'],
      rows: [
        { surface: 'Four poisoned name-etymology and job-board pages', engine: 'Claude', count: '79 → 11' },
        { surface: 'zoominfo.com (data broker)', engine: 'Claude', count: '0 → 74' },
        { surface: 'Wrong-person pages (imdb, nomi.ai, youtube)', engine: 'Perplexity', count: '228 → 36' },
      ],
    },
    findingLeadIn: 'The finding that matters:',
    findingBody:
      " the same cluster of fixes produced a 13 → 63 lift on Perplexity and nothing at all on Claude — 0 of 63 in both waves, a true null at four weeks. One variable explains the split: index access. The Bing submission reached the index Perplexity reads; there is no equivalent path into Anthropic's. And Claude's zero is not silence. Its poisoned citations fell 79 → 11, and a data broker rose 0 → 74 to fill the vacuum. An engine that cannot find the authoritative page does not abstain. It substitutes.",
  },

  s4: {
    mark: '§4',
    label: 'The judge failed — because I checked the judge',
    para1:
      "CrossSource's judge passed its blind check at 15/15. This one did not. Against 40 blind human labels, the Claude judge matched the exact tag set on 3 (8%) and the Gemini judge on 12 (30%); the two judges agreed with each other on 117 of 332 answers (35%). Ten repetitions of an identical prompt changed the tag set 86% of the time. It was the third consecutive blind check to say the same thing.",
    para2Pre:
      'So no interpretive category on this page is a rate. Bands only — and every headline number is a count with a denominator. The one exception is ',
    para2Code: 'poisoned_citation',
    para2Post: ', 27% → 19%, which is computed against canon rather than judged.',
    lessonQuote: 'It became a point estimate the moment it stopped being asked of a language model.',
  },

  s5: {
    mark: '§5',
    label: 'What this demonstrates',
    body:
      'The method survives the judge failing. When validation says the judge cannot be trusted, you do not soften the claim — you change what kind of number you publish. Instrument what can be counted; demote what must be interpreted; separate index-driven effects from model-driven ones so you know which fix owns the failure. It is the same discipline as CrossSource, and the opposite outcome, which is why the two belong together.',
  },

  s6: {
    mark: '§6',
    label: 'Limitations',
    body:
      'Engine versions are not verifiably frozen between waves (the citation trail is index-driven and robust to that; the taxonomy is not). The last fixes had about two weeks of recrawl, not four. The six interventions were a cluster, not isolated tests. Human validation covers 40 of 227 eligible items, stratified — not a full audit. Canon had a coverage gap: several "fabricated" numbers were true, published figures missing from canon.yaml. Verbatim engine answers are withheld because cited surfaces can include other people\'s public posts.',
  },

  s7: {
    mark: '§7',
    label: 'Predictions, scored',
    body:
      'PREDICTIONS.md was committed before Wave 1 ran and scored publicly, misses first: two of nine held. The misses changed the roadmap more than the hits did.',
  },

  s8: {
    mark: '§8',
    label: 'Next',
    body:
      'v1 is closed with this wave. A Claude-only mini-wave on the frozen instrument runs once a real crawler-access change has had time to land. v2 moves from chat engines to the agentic stacks that actually screen and source people — paired designs, counted metrics, human-gated labels.',
  },

  repoCta: [
    { label: 'Read the code, run it on yourself →', href: 'https://github.com/zoeb-nomi/mirror-eval' },
    { label: 'Release v1.0 →', href: 'https://github.com/zoeb-nomi/mirror-eval/releases/tag/v1.0' },
    { label: 'Predictions →', href: 'https://github.com/zoeb-nomi/mirror-eval/blob/main/PREDICTIONS.md' },
  ],

  relatedWriting: {
    mark: '§9',
    text: 'I pointed an eval harness at my own reflection',
    href: '/writing/eval-harness-at-my-own-reflection/',
  },
  // Cross-link added with screener-eval, copy-pack-s17.md §19 — the "natural
  // spot" in the existing related-writing style for this page.
  relatedScreenerEval: {
    text: 'screener-eval — the same counting discipline, no judge at all, pointed at LLM résumé screeners',
    href: '/screener-eval/',
  },

  ctaSlabBody: 'Read the code, run it on yourself →',
};

// ---------------------------------------------------------------------------
// SCREENER-EVAL — copy-pack-s17.md §17, added 2026-09-11. Same shape as
// CrossSource / mirror-eval: masthead (kicker, spec block, EvalsSwitcher,
// repo link), numbered Sections, DataTable for the three findings tables,
// PullQuote for "The finding that matters" (per build instructions — the
// text itself is verbatim from the pack), related-writing cross-link,
// CTASlab. Kicker and specBlock labels are structural, matching the
// established CrossSource/mirror-eval pattern (case study · harness type ·
// language; a small spec block of counts) — the pack dictates the numbers,
// not this exact wording.
// ---------------------------------------------------------------------------

export const screenerEval = {
  kicker: 'Case study · Open evaluation harness · Python',
  title: 'screener-eval: I ran my résumé through an LLM screener 885 times',
  standfirst:
    'Same résumé, same 21 job descriptions, two LLM screeners, five repeats each. Swapping every employer on the résumé for a fictional one moved the fit score by less than a point. Deleting every link moved it by less than a point. Which screener read it moved it by 22.',
  specBlock: [
    { label: 'Postings', value: '21' },
    { label: 'Screeners', value: '2' },
    { label: 'Calls', value: '885' },
    { label: 'Reps', value: '5' },
  ],
  repoHref: 'https://github.com/zoeb-nomi/screener-eval',
  repoLabel: 'github.com/zoeb-nomi/screener-eval',

  s1: {
    mark: '§1',
    label: 'Why this exists',
    body:
      'Before a person reads a résumé, a parser extracts it and, increasingly, a language model scores it. Nobody outside the vendor sees the score, and the advice industry around it — brand names up top, links to proof, keywords — is advice nobody has measured. This is the measurement: one real résumé, the currently open US AI product roles at large tech and frontier labs, two cheap screening models of the kind a vendor would actually run, and a paired design so the delta is the unit. The same eval discipline as CrossSource and mirror-eval, pointed at the one system where applications actually die.',
  },

  s2: {
    mark: '§2',
    label: 'Method',
    rows: [
      {
        term: 'Résumé',
        parts: [
          { text: 'Mine, v4.2 (résumé A). Two variants, each generated by a script from A: ' },
          { strong: 'B-institution' },
          {
            text: ' replaces every employer and institution name with a fictional unknown of matching description; ',
          },
          { strong: 'B-links' },
          { text: ' deletes every URL (portfolio, GitHub, LinkedIn, repo).' },
        ],
      },
      {
        term: 'Job descriptions',
        parts: [
          {
            text:
              '21 open, US-based AI Product Manager postings retrieved 2026-09-10 — 12 at frontier labs (OpenAI 6, Anthropic 3, Google DeepMind 3), 9 at large tech (Google 2, Meta 2, Amazon 2, NVIDIA 2, Microsoft 1). Director, Principal and Head titles excluded. Posting text is used locally and never published; the repo ships URLs and hashes.',
          },
        ],
      },
      {
        term: 'Screeners',
        parts: [
          { code: 'claude-haiku-4-5' },
          { text: ' and ' },
          { code: 'gpt-5-mini' },
          {
            text:
              ' — the cheap tier, because that is what screening at volume runs on. The screening prompt is a rubric from published research on LLM résumé screening; no vendor publishes theirs, so this is a proxy and is labelled as one. Each call returns strict JSON: a 0–100 fit score, advance / hold / reject, reasons, objections, discounted claims.',
          },
        ],
      },
      {
        term: 'Design',
        parts: [
          {
            text:
              'Paired. For every job description, A and B are scored by the same model in the same run window, order randomised; the unit of analysis is the per-JD delta (B − A). Conditions are interleaved within one window, not run on different days.',
          },
        ],
      },
      {
        term: 'Reps',
        parts: [
          {
            text:
              'A 10-rep pilot on one posting put the run-to-run standard deviation at 3.7 (Haiku) and 4.4 (gpt-5-mini) points and recommended 12 reps; 5 were run, which resolves effects of about 3 points and up. 885 scored calls in total, 0 parse errors, under $4 in API calls.',
          },
        ],
      },
      {
        term: 'Statistics',
        parts: [
          {
            text:
              'Mean paired delta with a 10,000-resample bootstrap 95% confidence interval and a two-sided sign test. Nothing here is judged by a model.',
          },
        ],
      },
      {
        term: 'Parser test (separate, deterministic)',
        parts: [
          {
            text:
              'The résumé PDF through three plain text extractors and two open-source résumé parsers, field-level errors counted against a hand-written canon of 29 fields.',
          },
        ],
      },
    ],
  },

  s3: {
    mark: '§3',
    label: 'Findings',
    intro: 'Paired delta in fit score, B − A, 21 job descriptions, 5 reps:',
    table1: {
      caption: 'Table 1 — paired delta by lever and screener',
      columns: ['Lever', 'Screener', 'Mean delta', '95% CI', 'Sign test p'],
      rows: [
        {
          lever: 'Every employer → fictional unknown',
          screener: 'claude-haiku-4-5',
          delta: '+0.07',
          ci: '−3.05 to +2.76',
          p: '1.00',
        },
        {
          lever: 'Every employer → fictional unknown',
          screener: 'gpt-5-mini',
          delta: '−1.14',
          ci: '−3.03 to +0.84',
          p: '0.19',
        },
        {
          lever: 'Every link deleted',
          screener: 'claude-haiku-4-5',
          delta: '−0.90',
          ci: '−2.90 to +1.03',
          p: '1.00',
        },
        {
          lever: 'Every link deleted',
          screener: 'gpt-5-mini',
          delta: '+0.41',
          ci: '−1.82 to +2.71',
          p: '1.00',
        },
      ],
    },
    table2Intro: 'What did move the score — the same résumé, the same posting, condition A only:',
    table2: {
      caption: 'Table 2 — condition A, by screener',
      columns: ['Measure', 'claude-haiku-4-5', 'gpt-5-mini'],
      rows: [
        { measure: 'Mean fit score', haiku: '44.8', gpt: '64.7' },
        { measure: 'Most common verdict', haiku: 'reject (136 of 233)', gpt: 'hold (157 of 232)' },
        { measure: 'Distinct scores given, across 233 calls', haiku: '10', gpt: '30' },
        { measure: 'Postings where every rep returned the identical score', haiku: '17 of 42 cells', gpt: '0 of 42' },
        { measure: 'Run-to-run SD, same posting, same résumé', haiku: '3.0', gpt: '4.8' },
        { measure: "Postings where the screener flipped its own verdict across reps", haiku: '6 of 21', gpt: '12 of 21' },
      ],
    },
    betweenScreeners:
      'Between the two screeners, on the same résumé and the same posting: mean gap 22.3 points, largest 51.3; gpt-5-mini scored higher on 19 of 21 postings; the two agreed on the majority verdict for 6 of 21 postings; correlation between their per-posting scores 0.46.',
    findingLeadIn: 'The finding that matters:',
    findingBody:
      " the two levers résumé advice is built on did nothing measurable. Replacing every employer with a company that does not exist, and deleting every link to proof, each moved the score by less than a point, with confidence intervals that straddle zero on both screeners. The choice of screener moved it by 22 points on average and flipped the verdict on 15 of 21 postings. And the screener's own noise — a 3-to-5-point wobble on identical input, a verdict that flips against itself on a third to a half of postings — is larger than either lever. A single-shot \"ATS score\" from any tool is a sample from that wobble.",
    lessonQuote: 'The screener you get is the variable.',
  },

  s4: {
    mark: '§4',
    label: 'What the null does and does not say',
    body:
      'The employer swap replaced companies a US screener has not heard of with companies that do not exist. It says nothing about swapping in a famous name; that is the prestige test, and it needs a different résumé than mine to run. The link deletion removed URL text a language model cannot follow anyway; it tests whether the presence of links signals anything to the screener, and it did not. Both nulls are about this résumé, these 21 postings, this rubric, and these two cheap models. They are counted honestly and they are narrow.',
  },

  s5: {
    mark: '§5',
    label: 'The parser test',
    intro:
      'Before any model sees a résumé, an extractor does. Field-level extraction against a 29-field canon, résumé v4.1 → v4.2:',
    table: {
      caption: 'Table 3 — field-level extraction, v4.1 → v4.2',
      columns: ['Parser', 'v4.1 (ok / missing / wrong / garbled)', 'v4.2'],
      rows: [
        { parser: 'pdftotext', v41: '26 / 3 / 0 / 0', v42: '29 / 0 / 0 / 0' },
        { parser: 'PyMuPDF', v41: '26 / 3 / 0 / 0', v42: '29 / 0 / 0 / 0' },
        { parser: 'pdfminer.six', v41: '26 / 3 / 0 / 0', v42: '29 / 0 / 0 / 0' },
        { parser: 'resumix (npm)', v41: '7 / 9 / 12 / 1', v42: '9 / 8 / 11 / 1' },
        { parser: 'resume-parser (npm)', v41: '2 / 4 / 1 / 22', v42: '2 / 2 / 1 / 24' },
      ],
    },
    close:
      'The three fields every plain extractor missed on v4.1 were the same three: LinkedIn, portfolio, GitHub. The links were hyperlink annotations under plain words, with no URL text on the page — invisible to anything that reads text. Printing the addresses fixed it: 29 of 29. The two résumé-specific parsers were worse than plain text extraction on both versions, and one of them read the two-column header as my name.',
  },

  s6: {
    mark: '§6',
    label: 'What this demonstrates',
    body:
      'Paired, repeated, counted. The experiment cost under $4 and a morning, and it replaces two pieces of received wisdom with two measured nulls and one measured effect nobody talks about: the screener you get is the variable. The same discipline as the other two harnesses — decide what is countable, count it, state what the count cannot support — with no judge in the loop at all.',
  },

  s7: {
    mark: '§7',
    label: 'Limitations',
    body:
      "One candidate's résumé. Twenty-one postings from eight employers, so shared boilerplate limits independence. Five reps against a pilot recommendation of twelve; the intervals are wide enough that effects under about three points are not excluded. The rubric is a published-research proxy, not any vendor's system. The institution-swap run was stopped after five complete reps and a partial sixth, which is included where both conditions of a pair completed. Cheap-tier models only; a frontier-tier screener may behave differently. Early in the pilot, gpt-5-mini returned empty content under a small output budget because its reasoning tokens consumed it — fixed before any counted run, disclosed because a screening vendor could make the same mistake.",
  },

  s8: {
    mark: '§8',
    label: 'Next',
    body:
      'A prestige arm (well-known employer names swapped in), a JD-vocabulary-alignment arm, and the same design on a second candidate\'s résumé — each is one config change on the public harness.',
  },

  repoCta: {
    label: 'Read the code, run it on your own résumé →',
    href: 'https://github.com/zoeb-nomi/screener-eval',
  },

  relatedWriting: {
    mark: '§9',
    text: '885 screenings, one résumé, and the two levers that did not move',
    href: '/writing/two-levers-that-did-not-move/',
  },

  ctaSlabBody: 'Read the code, run it on your own résumé →',
};

// ---------------------------------------------------------------------------
// WRITING — "I pointed an eval harness at my own reflection" — copy-pack-
// additions.md §13, added 2026-09-10. Body split into Sections at the three
// numbered beats plus the closing "What I'd tell someone" section, per spec.
// ---------------------------------------------------------------------------

export const writingReflection = {
  kicker: 'Eval methodology · mirror-eval',
  title: 'I pointed an eval harness at my own reflection',
  dek: 'What four AI search engines say about me, measured twice — and the three things that only showed up because the numbers were counted rather than scored.',
  date: '2026-09-10',
  readingTime: '5 min',
  repoHref: 'https://github.com/zoeb-nomi/mirror-eval',

  s1: {
    mark: '§1',
    label: 'Why I ran this',
    paras: [
      'Somewhere right now a recruiter is asking an AI engine about a candidate before opening the résumé. The candidate will never see the answer. They cannot A/B it, cannot check its sources, and nobody sends a report. I wanted to know what that answer looked like for me — and, more usefully, whether it could be changed on purpose.',
      'So I built the same kind of harness I build at work and pointed it at my own name. Four engines — ChatGPT, Claude, Perplexity, Gemini — each asked 83 questions about me, 63 of them with search on, all of them repeated. Every answer tagged against a canon of verified facts. Every citation logged. Then a month of fixes to the pages those engines read, and the whole battery run again.',
      'I expected a before-and-after chart. I got three things I did not expect, and each of them only surfaced because I counted instead of scored.',
    ],
  },

  s2: {
    mark: '§2',
    label: "1. Engines don't abstain. They fill.",
    paras: [
      "The headline split cleanly by engine. Perplexity went from citing my site on 13 of 63 search probes to 63 of 63. Claude went from 0 to 0. Same fixes, same month, opposite outcomes — and one variable explains it: index access. A Bing Webmaster submission reached the index Perplexity reads. There is no equivalent door into Anthropic's.",
      "But Claude's zero was not silence. The junk that used to feed its answers — name-etymology pages, a job-board scrape — dropped from 79 citations to 11. And a data broker rose from 0 to 74 to take their place. Claude's third most-cited source about me, after a month of cleanup, was a page I have never controlled and had asked to be removed.",
      'That is the pattern worth naming. An engine that cannot find the authoritative page does not say "I couldn\'t find much." It assembles an answer from whatever it can find, with the same fluency it would use for the truth. Clearing the junk did not create room for the right source; it created a vacuum, and the vacuum filled. If you fix your surfaces without fixing the index, you have rearranged the substitutes.',
    ],
  },

  s3: {
    mark: '§3',
    label: '2. "It\'s published by him, so it\'s his claim."',
    paras: [
      'While labelling answers by hand I kept meeting the same move. An engine would find my site, read a number on it — a metric from a project, a result from a harness — and then decline to stand behind it. Not because it was wrong, but because I was the one who had published it. The claim was treated as testimony rather than evidence.',
      'The engines are right to do this, which is what makes it uncomfortable. Self-attestation is weak evidence. A harness result on my own site is a claim; the same result in a repository with commits, or in a piece someone else wrote about the work, is corroboration. The lesson for anyone whose work is mostly self-published is not to publish more. It is to get the claim restated somewhere you do not own — and to make the thing you own as easy to verify as possible: public code, public data, dated releases, a predictions file scored in the open.',
      'I had a version of this belief before the study. Watching an engine apply the discount, sentence by sentence, turned it from a belief into a measurement I now want to run properly.',
    ],
  },

  s4: {
    mark: '§4',
    label: "3. The judge failed. The study didn't.",
    paras: [
      'The harness uses two LLM judges from different model families to tag each answer with a failure category. Then it does the thing that makes a judge a judge: a blind, stratified sample of 40 answers, labelled by a human who cannot see the verdicts.',
      "The judges failed. The Claude judge matched the human's exact tag set on 3 of 40. The Gemini judge on 12. The two judges agreed with each other on 35% of answers. Ten repetitions of an identical prompt changed the tag set 86% of the time. It was the third blind check in a row to say so.",
      'In CrossSource, the same validation step came back 15 for 15 — and caught a real harness bug in the process. Here it came back a failure. I think the second result is the more useful one to have in public, because of what it forces. You cannot publish a failure rate on the strength of a judge that agrees with a human 8% of the time. So the interpretive categories became bands — a floor where both judges agree, a ceiling where either fires — and the headline numbers became counts: which surfaces each engine cited, of how many probes. The one category that survived as a point estimate, poisoned citations, did so because it was moved out of the judge entirely and computed against canon. It went from a 77%-agreement judgement to an exact calculation the moment it stopped being a question for a language model.',
    ],
    lessonQuote:
      'The method did not soften the claim when the judge failed. It changed what kind of number was allowed to appear in a headline. That is what validation is for.',
  },

  s5: {
    mark: '§5',
    label: "What I'd tell someone running this on themselves",
    paras: [
      'Count before you score. The citation trail — which pages an engine actually read — is judge-free, cheap, and turned out to carry the whole story. Repeat every probe; a single-shot before/after is indistinguishable from resampling. Treat your own site as a claim, not a proof, and go get the corroboration. And when the validation step comes back ugly, publish that too. A harness that only reports the numbers its judge can be trusted with is worth more than one that reports everything.',
      'The harness is public and entity-agnostic — canon.yaml is the only file with facts in it. Run it on yourself. I would like to know whether your engines fill the way mine did.',
    ],
  },

  footer: [
    { label: 'Case study →', href: '/mirror-eval/' },
    { label: 'Repo →', href: 'https://github.com/zoeb-nomi/mirror-eval' },
    { label: 'Related: The judge caught a bug →', href: '/writing/the-judge-caught-a-bug/' },
  ],
};

// ---------------------------------------------------------------------------
// WRITING — "885 screenings, one résumé, and the two levers that did not
// move" — copy-pack-s17.md §18, added 2026-09-11. Same masthead shape as the
// mirror-eval reflection piece (kicker, byline with date + reading time).
// The pack's body is one continuous ~650-word piece with no numbered
// sub-heads of its own; it is split here into Sections at its natural
// paragraph beats (design-authored grouping only — every word of every
// paragraph is verbatim from the pack).
// ---------------------------------------------------------------------------

export const writingTwoLevers = {
  kicker: 'Eval methodology · screener-eval',
  title: '885 screenings, one résumé, and the two levers that did not move',
  dek: 'I ran my own résumé through two LLM screeners against 21 open AI PM roles, five times each, with the employers swapped for fictional ones and the links deleted. Neither mattered. Something else did.',
  date: '2026-09-11',
  readingTime: '3 min',
  repoHref: 'https://github.com/zoeb-nomi/screener-eval',

  s1: {
    mark: '§1',
    label: 'The setup',
    paras: [
      'Every piece of résumé advice I have ever been given comes down to two levers. Put the recognisable names where the eye lands first. Link to the proof. I had never seen either one measured against the thing that actually reads a résumé now, so I measured them.',
      'The setup is small on purpose. One résumé — mine. Twenty-one job descriptions, every open US AI product manager role I could find at the frontier labs and large tech. Two cheap screening models, the tier a vendor would run at volume, given a scoring rubric from published research and asked for a 0–100 fit score and a verdict. Then the two levers, one at a time: a copy of the résumé with every employer replaced by a company that does not exist, and a copy with every link deleted. Same job description, both versions, same model, same hour, five times over. 885 scored calls, under four dollars.',
    ],
  },

  s2: {
    mark: '§2',
    label: 'What did not move',
    paras: [
      'Swapping every employer for a fiction moved the score by 0.07 points on one screener and −1.1 on the other. Deleting every link: −0.9 and +0.4. All four confidence intervals straddle zero. On this résumé, against these postings, the two levers did nothing a counting method could see.',
    ],
  },

  s3: {
    mark: '§3',
    label: 'What did',
    paras: [
      'What did move the score was the screener. On the same résumé and the same posting, the two models disagreed by 22 points on average and by 51 at the extreme. One rejected me 58% of the time; the other put me on hold 68% of the time. They agreed on the verdict for six postings out of twenty-one. One of them handed out only ten distinct scores across 233 calls, and gave exactly 28 to eighty-four of them. That is not a scale. That is a rubric leaking through.',
      'And under all of it, the noise. Ask the same model the same question about the same résumé five times and the score wobbles by three to five points. On a third to a half of the postings, the screener flipped its own verdict between reps. Every free "ATS score" tool I have seen returns one number from one call. That number is a sample from the wobble.',
    ],
  },

  s4: {
    mark: '§4',
    label: 'What the nulls do not say',
    paras: [
      'I want to be careful about what the nulls mean. The employer swap replaced companies a US screener has not heard of with companies nobody has heard of; it says nothing about whether a famous name would help, and I cannot run that test on my own résumé. The deleted links were text a language model cannot follow anyway, so the test was whether the presence of links signals anything, and it did not. These are narrow, honest results about one candidate and two cheap models.',
    ],
  },

  s5: {
    mark: '§5',
    label: 'The wider lesson',
    paras: [
      'The wider lesson is not about résumés. It is that the interesting variable in an LLM-mediated system is rarely the one people are optimising. I spent a week making sure my evidence links were printed as text after finding that every extractor dropped them as invisible annotations — that fix was real, 26 of 29 fields to 29 of 29, and it is the one change in this study I would tell anyone to make. But once the text is in, the score belongs to the screener, and the screener belongs to whoever chose it.',
      'The harness is public. Point it at your own résumé; the only thing you need to change is the PDF.',
    ],
  },

  footer: [
    { label: 'Case study →', href: '/screener-eval/' },
    { label: 'Repo →', href: 'https://github.com/zoeb-nomi/screener-eval' },
    { label: 'Related: I pointed an eval harness at my own reflection →', href: '/writing/eval-harness-at-my-own-reflection/' },
  ],
};

// ---------------------------------------------------------------------------
// 4 · WORK — pack §4
// ---------------------------------------------------------------------------

export interface RecordLink {
  label: string;
  href: string;
}

export interface RecordItem {
  what: string;
  links: RecordLink[];
  where: string;
}

export interface PublicRecord {
  note?: string;
  items: RecordItem[];
}

export const work = {
  standfirst: 'Four companies, two promotions, one through-line: quality you can measure.',
  arcClose: 'Mechanical engineering → enterprise product → AI product quality.',
  recordKicker: 'Public record',

  // Open work — copy-pack-additions.md §15, added 2026-09-10. Rendered above
  // the Instead entry via RecordList; `where` is left blank (not specified in
  // the copy pack — these rows are cross-links, not third-party artefacts).
  openWork: {
    kicker: 'Open work',
    note: 'Three public evaluation harnesses, built to one method.',
    items: [
      {
        what: 'CrossSource — citation accuracy in legal RAG',
        links: [
          { label: 'Case study', href: '/crosssource/' },
          { label: 'Repo', href: 'https://github.com/zoeb-nomi/crosssource' },
        ],
        where: '',
      },
      {
        what: 'mirror-eval — what AI search engines say about a person',
        links: [
          { label: 'Case study', href: '/mirror-eval/' },
          { label: 'Repo', href: 'https://github.com/zoeb-nomi/mirror-eval' },
          { label: 'v1.0', href: 'https://github.com/zoeb-nomi/mirror-eval/releases/tag/v1.0' },
        ],
        where: '',
      },
      {
        what: 'screener-eval — what LLM résumé screeners actually reward',
        links: [
          { label: 'Case study', href: '/screener-eval/' },
          { label: 'Repo', href: 'https://github.com/zoeb-nomi/screener-eval' },
        ],
        where: '',
      },
    ],
  },

  insteadNote:
    "Reviewer's note — every figure here is from a production eval set, not a demo. The open, reproducible version of the method is CrossSource.",

  instead: {
    company: 'Instead',
    role: 'Product Manager',
    dateRange: 'Sep 2025–present',
    descriptor:
      'AI-native tax research & planning platform; first new entrant to clear IRS e-filing approval alongside incumbents.',
    achievements: [
      {
        kicker: 'Eval loop',
        text:
          'Own end-to-end output quality for the production tax-research LLM: a citation-accuracy evaluation loop (flag → classify by failure mode → weekly review) and a four-dimension rubric (answerability, accuracy, citation quality, actionability) that benchmarks model configurations and catches regressions before release — ~95% citation accuracy held on the eval set.',
        metrics: ['~95%'],
      },
      {
        kicker: 'Benchmarking',
        text:
          'Built the competitive model-benchmarking program: the platform scored against three competing platforms across 50+ scenarios over 5 rounds; designed a "pipeline-collapse" eval measuring chain coherence and self-QC honesty across a full multi-step tax workflow.',
        metrics: ['50+ scenarios over 5 rounds'],
      },
      {
        kicker: 'Failure mode',
        text:
          'Fixed a systemic "knowledge–citation gap" failure mode — plausible-but-wrong citations, a false-positive problem — by attaching document identity and sub-type to every cited source. Citation precision rose; outputs became traceable and audit-ready.',
        metrics: [] as string[],
      },
      {
        kicker: 'Latency',
        text:
          'Cut workflow latency ~90% (10–15 minutes → under a minute) by scoping incremental edits to changed inputs instead of reprocessing the full document set.',
        metrics: ['~90%'],
      },
      {
        kicker: 'Corpus',
        text:
          "Architected and QA'd the 270K+-record RAG corpus across 100+ legal source types: ingestion-pipeline PRDs, MongoDB schemas, a Python fetchability harness across 378 sources, and remediation of ~139K scraped documents.",
        metrics: ['270K+', '100+', '378 sources', '~139K'],
      },
      {
        kicker: 'Research',
        text:
          'Led legal-support research across 160+ tax strategies (a Legal Support Matrix built from Tax Court cases, IRS rulings, and audit guidance) and shipped Source Explorer — command-palette search with cross-type related sources.',
        metrics: ['160+ tax strategies'],
      },
    ],
    record: {
      note:
        "What's public. The eval numbers above are from production; the reproducible version is CrossSource.",
      items: [
        {
          what: 'How the AI cites tax law —',
          links: [{ label: 'Research product page', href: sources.insteadResearch.href }],
          where: 'instead.com',
        },
        {
          // Rendered only once the exact release URL replaces the TODO_ href.
          what: 'IRS e-file: 100% government testing across all US jurisdictions —',
          links: [{ label: 'press release', href: 'TODO_GLOBENEWSWIRE' }],
          where: 'May 2026',
        },
        {
          what: 'CrossSource —',
          links: [{ label: 'open harness, MIT', href: 'https://github.com/zoeb-nomi/crosssource' }],
          where: 'github.com',
        },
        {
          what: 'The judge caught a bug —',
          links: [{ label: 'essay', href: '/writing/the-judge-caught-a-bug/' }],
          where: 'zoebnomi.com',
        },
      ],
    } as PublicRecord,
  },

  multiplier: {
    company: 'Multiplier',
    role: 'Product Manager',
    dateRange: 'Mar 2025–Sep 2025',
    descriptor: 'Global employment platform enabling compliant hiring across 150+ countries.',
    achievements: [
      {
        kicker: null as string | null,
        text:
          'Owned the Value-Added Services vertical (procurement, BGV, ITSM, partnerships): $100K incremental revenue and a 47% efficiency gain from new SOPs; launched the PosterElite compliance partnership end-to-end in 21 days.',
        metrics: ['$100K', '47%', '21 days'],
      },
    ],
    record: {
      note: "What's public. The PosterElite launch was not announced publicly; the claim stands, unlinked.",
      items: [
        {
          what: 'Background screening for global hires —',
          links: [{ label: 'Veremark partner page', href: sources.veremarkPartner.href }],
          where: 'usemultiplier.com',
        },
        {
          what: 'Initiate background verification through Multiplier —',
          links: [
            {
              label: 'help centre',
              href: 'https://help.usemultiplier.com/hr/resources/initiate-background-verification-through-multiplier',
            },
          ],
          where: 'help.usemultiplier.com',
        },
        {
          what: 'IT asset & equipment support at onboarding —',
          links: [
            {
              label: 'product news',
              href: 'https://usemultiplier.com/product-news/streamline-onboarding-process-with-multiplier',
            },
          ],
          where: 'updated Aug 2025',
        },
      ],
    } as PublicRecord,
  },

  keka: {
    company: 'Keka HR',
    role: 'Product Manager · 3 roles, 2 promotions',
    dateRange: 'Dec 2022–Mar 2025',
    descriptor: "India's leading HR technology platform; $25M+ ARR CoreHR suite.",
    standfirst:
      "Built the Background Verification module zero-to-one on the Checkr API — Keka's first US-market product. From nothing to 28 US enterprise clients and $2.7M MRR, it drove the company's first US expansion and was a full course in integration edge cases, compliance constraints, and enterprise onboarding.",
    achievements: [
      {
        kicker: 'Also',
        text:
          '6 SSO integrations (Azure AD / Google Workspace) → 27% adoption lift and $121K upsell; led the Exit Module revamp → offboarding time down 28%, CSAT up 80%.',
        metrics: ['6 SSO', '27%', '$121K', '28%', '80%'],
      },
    ],
    // The Fig. number is a prop on VideoEmbed, so the caption here is the
    // sentence only — the component renders the "Fig. 1 — " prefix.
    video: {
      youtubeId: 'rPYfTCj181w',
      title: 'Background Verification in Keka',
      channel: 'KEKA HR · YOUTUBE',
      poster: '/img/keka-bgv-poster',
      caption: 'Background Verification in Keka. Product video, Keka HR. Plays here.',
    },
    record: {
      note: "What shipped, on Keka's own surfaces. None of these name me; the profile piece does.",
      items: [
        {
          what: 'Background Verification module —',
          links: [{ label: 'product video', href: sources.kekaBgvVideo.href }],
          where: 'youtube.com',
        },
        {
          what: 'Keka × Checkr —',
          links: [
            { label: 'marketplace listing', href: 'https://www.keka.com/marketplace/app/checkr' },
            {
              label: "Checkr's integration guide",
              href: 'https://help.checkr.com/s/article/Keka-Checkr-Integration-User-Guide',
            },
          ],
          where: 'keka.com · help.checkr.com',
        },
        {
          what: 'Employee Exit module revamp —',
          links: [
            { label: 'announcement', href: 'https://help.keka.com/admin/updates-to-the-exit-process' },
            { label: 'exit-process guide', href: 'https://help.keka.com/admin/exits-revamaped' },
          ],
          where: 'help.keka.com',
        },
        {
          what: 'SSO —',
          links: [
            {
              label: 'Azure AD',
              href: 'https://help.keka.com/hc/en-us/articles/39946697572241-Azure-AD-integration-with-Keka',
            },
            { label: 'Okta', href: 'https://help.keka.com/admin/how-to-configure-okta-sso-with-keka' },
            {
              label: 'OneLogin',
              href: 'https://help.keka.com/hc/en-us/articles/39946711883281-Configuring-OneLogin-SSO-with-Keka',
            },
          ],
          where: 'help.keka.com',
        },
        {
          what: 'Verification partners —',
          links: [
            { label: 'SpringVerify', href: 'https://help.keka.com/admin/integrating-springverify-with-keka-2' },
            {
              label: 'OnGrid',
              href: 'https://help.keka.com/hc/en-us/articles/39946713812881-Ongrid-Integration-with-Keka',
            },
            { label: 'HelloVerify', href: 'https://www.keka.com/marketplace/app/helloverifybgv' },
          ],
          where: 'keka.com',
        },
        {
          what: 'Profile —',
          links: [
            {
              label: '"Meet Zoeb Nomi: the rabbit-hole explorer and CoreHR maestro"',
              href: sources.kekaProfile.href,
            },
          ],
          where: 'Jan 2025',
        },
      ],
    } as PublicRecord,
  },

  hurix: {
    company: 'Hurix Digital',
    role: 'Business Analyst',
    dateRange: 'Oct 2021–Oct 2022',
    descriptor: null as string | null,
    achievements: [
      {
        kicker: null as string | null,
        text:
          'Led agile transformation of LMS development (43% faster delivery); drove 31% growth in customer conversions via an end-to-end video-learning rollout.',
        metrics: ['43%', '31%'],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// CONTRIBUTIONS GRAPH — placeholders pending copy-pack. Keep additions here,
// not hard-coded in ContributionGraph.astro.
// ---------------------------------------------------------------------------

export const contributions = {
  kicker: 'PM who ships code',
  dek: 'All three harnesses are public repositories. This is the last year of commits, live from GitHub.',
  captionLive: 'contributions in the last year · live from GitHub',
  captionSnapshot: 'contributions in the last year · as of',
  legendLess: 'Less',
  legendMore: 'More',
};

// ---------------------------------------------------------------------------
// 5 · ABOUT — pack §5
// ---------------------------------------------------------------------------

export interface TimelineSource {
  label: string;
  href: string;
}

export const about = {
  bodyPara1:
    "I'm Zoeb Nomi — an AI product manager at Instead, in Bengaluru, working on the hardest trust problem in applied AI: making a system tell the truth about its sources.",
  // Rule-separated timeline replacing the arc paragraph (orchestrator-approved
  // 2026-08-03 polish pass). Facts only — every figure here also ships
  // elsewhere in the copy pack (Work page, JSON-LD, llms.txt).
  // `source` is present only where a public artefact actually exists. A row
  // with no source is a claim you take on trust; a row with one is checkable.
  timeline: [
    { year: '2019', body: 'B.E. Mechanical Engineering, MIT Aurangabad', source: null as TimelineSource | null },
    { year: '2021–2022', body: 'Business Analyst, Hurix Digital', source: null as TimelineSource | null },
    { year: '2022', body: 'STOA General Management Program', source: null as TimelineSource | null },
    {
      year: '2022–2025',
      body: 'Product Manager, Keka HR · 3 roles, 2 promotions · BGV zero-to-one to $2.7M MRR',
      source: {
        label: 'Keka Product blog, Jan 2025 →',
        href: sources.kekaProfile.href,
      } as TimelineSource | null,
    },
    {
      year: '2025',
      body: 'Product Manager, Multiplier · global employment across 150+ countries',
      source: null as TimelineSource | null,
    },
    {
      year: '2025–present',
      body: 'Product Manager, Instead · owning production LLM output quality',
      source: { label: 'instead.com/research →', href: sources.insteadResearch.href } as TimelineSource | null,
    },
  ],
  // The Medium piece cannot be framed, so the About page draws the link card
  // itself. Every string here is from the article: the kicker is its metadata,
  // the excerpt is its opening line verbatim, the byline is its publication.
  embed: {
    kicker: 'Medium · Keka Product · 16 Jan 2025 · 1 min read',
    title: 'Meet Zoeb Nomi: The Rabbit-Hole Explorer and CoreHR Maestro',
    excerpt: `"Hi, I'm Zoeb Nomi, a Product Manager on the CoreHR team at Keka…"`,
    byline: 'Keka Blog · in Keka Product',
    href: sources.kekaProfile.href,
    linkLabel: 'Read on Medium →',
  },
  profileRow: {
    label: 'Profile',
    detail: '"Meet Zoeb Nomi: the rabbit-hole explorer and CoreHR maestro" · Keka Product blog · Jan 2025 →',
    href: sources.kekaProfile.href,
  },
  beliefPre: 'What I believe: ',
  beliefStrong: 'evals are a product surface, not a QA afterthought.',
  beliefPost:
    ` The interesting product work in AI is deciding what "good output" means, making that measurable, and wiring the measurement into how the team ships. That's what my flagship project, CrossSource, demonstrates in public.`,
  factsRow: [
    'Bengaluru, India (IST)',
    'Open to US relocation',
    'I keep US-morning slots open — book one',
  ],
  photoAlt: 'Zoeb Nomi',
  h1: 'About — the record',
  dek: "Every claim on this site links to something you can check. This page is the ledger: what I've done, and where the evidence lives.",
};

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------

export const notFound = {
  message: '404 — no source found for that claim',
  linkLabel: 'Home',
  linkHref: '/',
};

// ---------------------------------------------------------------------------
// llms.txt — pack §6, verbatim
// ---------------------------------------------------------------------------

export const llmsTxt = `# Zoeb Nomi

> Zoeb Nomi is an AI Product Manager at Instead (AI-native tax research & planning platform; first new entrant to clear IRS e-filing approval alongside incumbents), specializing in LLM evaluation and RAG output quality. He owns end-to-end output quality for the production tax-research LLM. Based in Bengaluru, India; open to US relocation.

## Key facts

- Role: Product Manager, Instead (Sep 2025–present). Owns citation-accuracy evaluation, model benchmarking, and regression-catching eval loops for a production tax-research LLM. ~95% citation accuracy on the eval set.
- Flagship public project: CrossSource (https://github.com/zoeb-nomi/crosssource) — open evaluation harness for citation accuracy in legal RAG. Citation precision 0.981 (baseline) → 0.994 (strict); recall 0.760; faithfulness 1.000; 100% (15/15) blind human–judge agreement. Corpus: 22 public-domain US court opinions; 25-question golden set; BM25 top-5 retrieval.
- Second public project: mirror-eval (https://github.com/zoeb-nomi/mirror-eval) — open evaluation harness for what AI search engines say about a person; built to the CrossSource method. Two waves (2026-08-06, 2026-09-04), 332 probes each across ChatGPT, Claude, Perplexity, Gemini. Judge-free citation trail: Perplexity 13-of-63 → 63-of-63 search probes citing zoebnomi.com; Claude 0-of-63 → 0-of-63; CrossSource repo cited by ChatGPT 0 → 25-of-63 and Gemini 0 → 32-of-63. Blind human validation of the LLM judges: 3/40 and 12/40 — taxonomy reported as bands only. Release v1.0.
- Third public project: screener-eval (https://github.com/zoeb-nomi/screener-eval) — paired, repeated evaluation of LLM résumé screeners. One résumé, 21 open US AI PM postings, two cheap-tier screeners, 5 reps, 885 calls. Employer-name swap: +0.07 / −1.14 points (95% CIs straddle zero). Link deletion: −0.90 / +0.41. Cross-screener gap on the same input: 22.3 points mean, verdicts agree on 6 of 21 postings. Parser test: plain extractors 26/29 → 29/29 after printing URLs as text.
- At Instead: fixed the "knowledge–citation gap" failure mode (plausible-but-wrong citations); cut workflow latency ~90% (10–15 min → under a minute); architected a 270K+-record RAG corpus across 100+ legal source types; fetchability harness across 378 sources; remediation of ~139K documents; Legal Support Matrix across 160+ tax strategies; shipped Source Explorer.
- Previously: Multiplier (Value-Added Services vertical: $100K incremental revenue, 47% efficiency gain, partnership launched in 21 days). Keka HR (3 roles, 2 promotions: built Background Verification module zero-to-one on Checkr API — 28 US enterprise clients, $2.7M MRR, company's first US expansion; 6 SSO integrations, 27% adoption lift, $121K upsell; Exit Module revamp, offboarding time −28%, CSAT +80%). Hurix Digital (agile transformation, 43% faster delivery; 31% conversion growth).
- Education: STOA General Management Program (2022); B.E. Mechanical Engineering, MIT Aurangabad (2019).
- Contact: zoeb.nomi@gmail.com · https://www.linkedin.com/in/zoebnomi · book: https://calendar.app.google/56javKNeXqw7X8oq6

## Public record

- Profile — "Meet Zoeb Nomi: The Rabbit-Hole Explorer and CoreHR Maestro", Keka Product blog, Jan 2025: https://medium.com/keka-product/meet-zoeb-nomi-the-rabbit-hole-explorer-and-corehr-maestro-a252fedbe113
- Instead Research product (the AI citation surface he owns): https://instead.com/products/research
- Multiplier × Veremark background-screening partner page: https://usemultiplier.com/marketplace/partner/veremark
- Keka Background Verification module — product video: https://www.youtube.com/watch?v=rPYfTCj181w

## Pages

- Home: https://www.zoebnomi.com/
- Evals index: https://www.zoebnomi.com/evals/
- CrossSource case study: https://www.zoebnomi.com/crosssource/
- mirror-eval case study: https://www.zoebnomi.com/mirror-eval/
- screener-eval case study: https://www.zoebnomi.com/screener-eval/
- Work: https://www.zoebnomi.com/work/
- About: https://www.zoebnomi.com/about/
- Writing (essays index): https://www.zoebnomi.com/writing/
- Writing — "The judge caught a bug I didn't" (validating LLM-as-judge evals): https://www.zoebnomi.com/writing/the-judge-caught-a-bug/
- Writing: https://www.zoebnomi.com/writing/eval-harness-at-my-own-reflection/
- Writing: https://www.zoebnomi.com/writing/two-levers-that-did-not-move/
`;
