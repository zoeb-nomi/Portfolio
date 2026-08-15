// src/data/copy.ts
// Every string on zoebnomi.com, transcribed verbatim from COPY PACK v1 · 2026-08-02.
// Templates import from here only — no copy is authored in .astro files.
// Design-authored strings (orchestrator-approved 2026-08-02, build-spec.md §12) are marked below.

export interface NavItem {
  label: string;
  href: string;
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
  standingLine: 'Zoeb Nomi · AI Product Manager · Bengaluru (IST)',
  footerLine:
    'Zoeb Nomi · AI Product Manager — LLM Evaluation & RAG Quality · Bengaluru (IST) · Open to US relocation',
};

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'CrossSource', href: '/crosssource/' },
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
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
      'Zoeb Nomi is an AI product manager at Instead, an AI-native tax research and planning platform, based in Bengaluru, India. He owns output quality for a production tax-research LLM — eval loops, citation accuracy, model benchmarking — and built CrossSource, an open RAG citation-evaluation harness.',
  },
  crosssource: {
    title: 'CrossSource: RAG citation evaluation — Zoeb Nomi',
    description:
      'Open harness measuring citation accuracy in legal RAG: 0.981→0.994 precision, validated LLM judge (100% blind agreement, 15/15), and a failure taxonomy that separates prompting from retrieval.',
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
  sameAs: [
    'https://www.linkedin.com/in/zoebnomi',
    'https://github.com/zoeb-nomi',
    'https://x.com/zoeb_nomi',
    'https://topmate.io/zoebnomi',
    'https://www.zoebnomi.com',
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
  flagship: {
    label: 'Flagship — open source', // design-authored §12
    sectionMark: '§2',
    title: 'CrossSource',
    description:
      'An open evaluation harness for citation accuracy in legal RAG. 22 public court opinions, a 25-question golden set, an LLM judge validated blind against a human — and a real harness bug caught by that validation. The full harness, golden set and results are public and MIT-licensed at github.com/zoeb-nomi/crosssource.',
    linkLabel: 'Read the case study →',
    linkHref: '/crosssource/',
  },
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
  findingKicker: 'THE FINDING THAT MATTERS',
  findingQuote:
    'Prompting discipline buys precision — it cannot buy recall. 0.760 in both configurations, because every missing-authority failure traces to retrieval, not generation.',
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
        body: '22 public-domain US court opinions (16 Supreme Court, 2 federal circuit, 4 state), sourced from Harvard Law School’s Caselaw Access Project, chunked to ~350 words.',
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
    marginNote: 'Fig. 2 — validation pass, stratified blind sample.',
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
// 4 · WORK — pack §4
// ---------------------------------------------------------------------------

export const work = {
  standfirst: 'Four companies, two promotions, one through-line: quality you can measure.',
  arcClose: 'Mechanical engineering → enterprise product → AI product quality.',

  instead: {
    company: 'Instead',
    role: 'Product Manager',
    dateRange: 'Sept 2025–present',
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
          'Architected and QA’d the 270K+-record RAG corpus across 100+ legal source types: ingestion-pipeline PRDs, MongoDB schemas, a Python fetchability harness across 378 sources, and remediation of ~139K scraped documents.',
        metrics: ['270K+', '100+', '378 sources', '~139K'],
      },
      {
        kicker: 'Research',
        text:
          'Led legal-support research across 160+ tax strategies (a Legal Support Matrix built from Tax Court cases, IRS rulings, and audit guidance) and shipped Source Explorer — command-palette search with cross-type related sources.',
        metrics: ['160+ tax strategies'],
      },
    ],
  },

  multiplier: {
    company: 'Multiplier',
    role: 'Product Manager',
    dateRange: 'Mar 2025–Sept 2025',
    descriptor: 'Global employment platform enabling compliant hiring across 150+ countries.',
    achievements: [
      {
        kicker: null as string | null,
        text:
          'Owned the Value-Added Services vertical (procurement, BGV, ITSM, partnerships): $100K incremental revenue and a 47% efficiency gain from new SOPs; launched the PosterElite compliance partnership end-to-end in 21 days.',
        metrics: ['$100K', '47%', '21 days'],
      },
    ],
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
// 5 · ABOUT — pack §5
// ---------------------------------------------------------------------------

export const about = {
  bodyPara1:
    "I'm Zoeb Nomi — an AI product manager at Instead, in Bengaluru, working on the hardest trust problem in applied AI: making a system tell the truth about its sources.",
  // Rule-separated timeline replacing the arc paragraph (orchestrator-approved
  // 2026-08-03 polish pass). Facts only — every figure here also ships
  // elsewhere in the copy pack (Work page, JSON-LD, llms.txt).
  timeline: [
    { year: '2019', body: 'B.E. Mechanical Engineering, MIT Aurangabad' },
    { year: '2021–2022', body: 'Business Analyst, Hurix Digital' },
    { year: '2022', body: 'STOA General Management Program' },
    { year: '2022–2025', body: 'Product Manager, Keka HR · 3 roles, 2 promotions · BGV zero-to-one to $2.7M MRR' },
    { year: '2025', body: 'Product Manager, Multiplier · global employment across 150+ countries' },
    { year: '2025–present', body: 'Product Manager, Instead · owning production LLM output quality' },
  ],
  beliefPre: 'What I believe: ',
  beliefStrong: 'evals are a product surface, not a QA afterthought.',
  beliefPost:
    ' The interesting product work in AI is deciding what "good output" means, making that measurable, and wiring the measurement into how the team ships. That’s what my flagship project, CrossSource, demonstrates in public.',
  factsRow: [
    'Bengaluru, India (IST)',
    'Open to US relocation',
    'I keep US-morning slots open — book one',
  ],
  photoAlt: 'Zoeb Nomi',
  figureCaption: 'Fig. 1 — Zoeb Nomi. Bengaluru (IST).',
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

- Role: Product Manager, Instead (Sept 2025–present). Owns citation-accuracy evaluation, model benchmarking, and regression-catching eval loops for a production tax-research LLM. ~95% citation accuracy on the eval set.
- Flagship public project: CrossSource (https://github.com/zoeb-nomi/crosssource) — open evaluation harness for citation accuracy in legal RAG. Citation precision 0.981 (baseline) → 0.994 (strict); recall 0.760; faithfulness 1.000; 100% (15/15) blind human–judge agreement. Corpus: 22 public-domain US court opinions; 25-question golden set; BM25 top-5 retrieval.
- At Instead: fixed the "knowledge–citation gap" failure mode (plausible-but-wrong citations); cut workflow latency ~90% (10–15 min → under a minute); architected a 270K+-record RAG corpus across 100+ legal source types; fetchability harness across 378 sources; remediation of ~139K documents; Legal Support Matrix across 160+ tax strategies; shipped Source Explorer.
- Previously: Multiplier (Value-Added Services vertical: $100K incremental revenue, 47% efficiency gain, partnership launched in 21 days). Keka HR (3 roles, 2 promotions: built Background Verification module zero-to-one on Checkr API — 28 US enterprise clients, $2.7M MRR, company's first US expansion; 6 SSO integrations, 27% adoption lift, $121K upsell; Exit Module revamp, offboarding time −28%, CSAT +80%). Hurix Digital (agile transformation, 43% faster delivery; 31% conversion growth).
- Education: STOA General Management Program (2022); B.E. Mechanical Engineering, MIT Aurangabad (2019).
- Contact: zoeb.nomi@gmail.com · https://www.linkedin.com/in/zoebnomi · book: https://calendar.app.google/56javKNeXqw7X8oq6

## Pages

- Home: https://www.zoebnomi.com/
- CrossSource case study: https://www.zoebnomi.com/crosssource/
- Work: https://www.zoebnomi.com/work/
- About: https://www.zoebnomi.com/about/
`;
