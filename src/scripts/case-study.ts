/* Case-study runtime (The Pipeline): the prototype's CS helpers plus one init per page.
   Every page renders its final state on the server (no JS, or reduced motion, shows the complete
   figure). With motion on, each init resets its figure to a start state and plays it once when the
   figure arrives; every toggle, hover and step is a click or a hover, never a scroll. Numbers and
   labels are read from data attributes the page built from copy.ts. */
import { $, $$, swap, reduce } from './ds';

const d = document;
const w = window;

// ---- helpers -----------------------------------------------------------------------------------------------

/** Segmented toggle: buttons with aria-pressed and a sliding red indicator. */
function seg(el: HTMLElement, onChange: (v: string) => void) {
  const btns = $$<HTMLButtonElement>('button', el);
  const ind = d.createElement('i');
  ind.className = 'cs-ind';
  ind.setAttribute('aria-hidden', 'true');
  el.insertBefore(ind, el.firstChild);
  const place = (b: HTMLElement) => {
    el.style.setProperty('--iw', b.offsetWidth + 'px');
    el.style.setProperty('--ix', b.offsetLeft + 'px');
  };
  const cur = () => btns.find((b) => b.getAttribute('aria-pressed') === 'true') ?? btns[0];
  const pick = (b: HTMLButtonElement, silent = false) => {
    btns.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    place(b);
    if (!silent) onChange(b.dataset.v ?? '');
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => pick(b));
    b.addEventListener('keydown', (e) => {
      const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!k) return;
      e.preventDefault();
      const nb = btns[(i + k + btns.length) % btns.length];
      nb.focus();
      pick(nb);
    });
  });
  pick(cur(), true);
  w.addEventListener('resize', () => place(cur()));
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => place(cur()));
  return {
    pick: (v: string) => {
      const b = btns.find((x) => x.dataset.v === v);
      if (b) pick(b);
    },
    set: (v: string) => {
      const b = btns.find((x) => x.dataset.v === v);
      if (b) pick(b, true);
    },
  };
}

/** Set tile classes with a left-to-right stagger. CSS does the transform and opacity work. */
function paint(arr: HTMLElement[], fn: (i: number) => string, stagger = 0) {
  arr.forEach((t, i) => {
    const cls = 'cs-t ' + (fn(i) || '');
    if (reduce || !stagger) {
      t.className = cls;
      return;
    }
    setTimeout(() => {
      t.className = cls;
    }, i * stagger);
  });
}

/** Run once when el enters the viewport. */
function inview(el: Element, fn: () => void, margin = '0px 0px -12% 0px') {
  if (!('IntersectionObserver' in w)) {
    fn();
    return;
  }
  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          io.disconnect();
          fn();
        }
      });
    },
    { rootMargin: margin },
  );
  io.observe(el);
}

const bar = (i: HTMLElement, k: number) => i.style.setProperty('--k', Math.max(0, Math.min(1, k)).toFixed(4));
const json = <T>(el: HTMLElement, key: string): T => JSON.parse(el.dataset[key] ?? 'null') as T;
const spans = (r: Element) => $$<HTMLElement>('.cs-t', r as HTMLElement);

/** Method strip: size the travelling packet to the strip width; pause it off-screen. */
function strips() {
  $$('.cs-strip-wrap').forEach((wr) => {
    const tr = $('.cs-track', wr);
    const st = $('.cs-strip', wr);
    if (!tr || !st) return;
    const size = () => {
      tr.style.width = st.scrollWidth + 'px';
      tr.style.right = 'auto';
      tr.style.setProperty('--run', Math.max(0, st.scrollWidth - 7) + 'px');
    };
    size();
    w.addEventListener('resize', size);
    const pk = $('.cs-pk', tr);
    if (pk && 'IntersectionObserver' in w && !reduce) {
      new IntersectionObserver((es) => {
        es.forEach((e) => {
          pk.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
        });
      }).observe(wr);
    }
  });
}

/** A list of buttons that swap one stage panel at a time. */
function steps(root: HTMLElement, render: (i: number) => void) {
  const bs = $$<HTMLButtonElement>('button', root);
  bs.forEach((b, i) =>
    b.addEventListener('click', () => {
      bs.forEach((x, k) => x.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      render(i);
    }),
  );
}

/** Hover, focus and click on a row show it; leaving the group clears it. */
function hoverRows(group: HTMLElement, rows: HTMLElement[], show: (r: HTMLElement) => void, clear: () => void) {
  rows.forEach((r) => {
    r.addEventListener('mouseenter', () => show(r));
    r.addEventListener('focus', () => show(r));
    r.addEventListener('click', () => show(r));
  });
  group.addEventListener('mouseleave', clear);
}

// ---- CrossSource ---------------------------------------------------------------------------------------------

type XsCfg = { prec: string; p: number; rel: string; wp: number; ma: number; fails: number; cfg: string };

export function initCrossSource() {
  const fig = $('#xs-fig');
  if (!fig) return;
  const data = json<{ lo: number; hi: number; base: XsCfg; strict: XsCfg }>(fig, 'cfg');
  const { lo, hi } = data;
  const svg = $<SVGSVGElement & HTMLElement>('svg', fig);
  const inner = $<HTMLElement>('.xs-needle-in', fig);
  const lit = $<HTMLElement>('.xs-arc-lit', fig);
  const markB = $<HTMLElement>('.xs-mark-b', fig);
  const markS = $<HTMLElement>('.xs-mark-s', fig);
  const tiles = spans($('#xs-tiles') as HTMLElement);
  const bars = $$<HTMLElement>('[data-tax]', fig);
  const el = (id: string) => d.getElementById(id) as HTMLElement;
  if (!svg || !inner || !lit || !markB || !markS) return;
  const ang = (v: number) => -90 + (180 * (v - lo)) / (hi - lo);

  function set(cfg: 'base' | 'strict', animate: boolean) {
    const D = data[cfg];
    inner!.style.transform = `rotate(${ang(D.p).toFixed(2)}deg)`;
    lit!.style.setProperty('--off', (1 - (D.p - lo) / (hi - lo)).toFixed(4));
    markB!.style.opacity = cfg === 'strict' ? '1' : '0';
    markS!.style.opacity = cfg === 'strict' ? '1' : '0';
    swap(el('xs-prec'), D.prec);
    swap(el('xs-fails'), String(D.fails));
    swap(el('xs-cfg'), D.cfg);
    swap(el('xs-rel'), D.rel);
    swap(el('xs-t0'), String(D.wp));
    paint(tiles, (i) => (i < 3 ? (i < D.wp ? 'r' : 'h dim') : 'f'), animate ? 45 : 0);
    bar(bars[0], D.wp / 6);
    bar(bars[1], D.ma / 6);
    bar(bars[2], 0);
    bar(bars[3], 0);
  }

  let auto = !reduce;
  const start: 'base' | 'strict' = auto ? 'base' : 'strict';
  const sg = seg($('.cs-seg', fig) as HTMLElement, (v) => {
    auto = false;
    set(v === 'base' ? 'base' : 'strict', true);
  });
  sg.set(start);
  set(start, false);
  if (auto) {
    inview(fig, () => {
      setTimeout(() => {
        if (auto) sg.pick('strict');
      }, 900);
    });
  }

  // Fig. 2: one answer through the harness
  const say = el('xs-say');
  const sp = el('xs-spans');
  const lines = json<string[]>(say, 'say');
  let tok = 0;
  steps(el('xs-steps'), (i) => {
    sp.setAttribute('data-step', String(i));
    const my = ++tok;
    if (reduce) {
      say.textContent = lines[i];
      return;
    }
    say.classList.add('out');
    setTimeout(() => {
      if (my !== tok) return;
      say.textContent = lines[i];
      say.classList.remove('out');
    }, 220);
  });
  strips();
}

// ---- mirror-eval ---------------------------------------------------------------------------------------------

type MeJudge = { t: string; c: string; r: string; v: string; bad: boolean; lad: string };
type TileRow = HTMLElement & { _t?: HTMLElement[]; _k?: number };

export function initMirrorEval() {
  const wf = d.getElementById('me-waves');
  if (!wf) return;

  // Fig. 1: engines, wave toggle
  const rows = $$<HTMLElement>('#me-eng .me-row').map((r) => ({
    w1: Number(r.dataset.w1),
    w2: Number(r.dataset.w2),
    v: $('.me-v b', r) as HTMLElement,
    t: spans(r),
  }));
  const wave = (v: string, animate: boolean) => {
    rows.forEach((R) => {
      const n = v === 'w1' ? R.w1 : R.w2;
      swap(R.v, String(n));
      paint(R.t, (i) => (i < R.w1 ? 'f' : v === 'w2' && i < R.w2 ? 'r' : ''), animate ? 9 : 0);
    });
  };
  let auto = !reduce;
  const sg = seg($('.cs-seg', wf) as HTMLElement, (v) => {
    auto = false;
    wave(v, true);
  });
  const startW = auto ? 'w1' : 'w2';
  sg.set(startW);
  wave(startW, false);
  if (auto) {
    inview(wf, () => {
      setTimeout(() => {
        if (auto) sg.pick('w2');
      }, 1000);
    });
  }

  // Fig. 2: what filled the gap. Ghost bar = Wave 1, solid bar = Wave 2.
  $$<HTMLElement>('.me-gap .bt').forEach((bt) => {
    const b = $('[data-b]', bt) as HTMLElement;
    const a = $('[data-a]', bt) as HTMLElement;
    const kb = Number(b.dataset.b) / Number(b.dataset.m);
    if (reduce) return;
    bar(b, Number(a.dataset.a) / Number(a.dataset.m));
    inview(bt, () => setTimeout(() => bar(b, kb), 350));
  });

  // Fig. 3: judges against a blind human
  const mx = $('#me-mx') as HTMLElement;
  const jrs = $$<TileRow>('.me-jr', mx);
  const lad = $$<HTMLElement>('#me-ladder li');
  const el = (id: string) => d.getElementById(id) as HTMLElement;
  jrs.forEach((jr) => {
    jr._t = spans(jr);
    jr._k = Number(jr.dataset.k);
  });
  const fill = (jr: TileRow, animate: boolean) =>
    paint(jr._t ?? [], (i) => (i < (jr._k ?? 0) ? 'f' : ''), animate ? ((jr._t?.length ?? 0) > 100 ? 2 : 24) : 0);
  const show = (jr: HTMLElement) => {
    const I = json<MeJudge>(jr, 'info');
    jrs.forEach((x) => x.classList.toggle('on', x === jr));
    mx.classList.add('dimmed');
    swap(el('me-rt'), I.t);
    swap(el('me-rc'), I.c);
    swap(el('me-rr'), I.r);
    swap(el('me-rv'), I.v);
    el('me-rv').classList.toggle('r', I.bad);
    lad.forEach((li) => {
      const key = li.dataset.k;
      const litNow = key === I.lad || key === 'count' || key === 'canon';
      li.classList.toggle('lit', key === I.lad);
      li.classList.toggle('off', !litNow);
    });
  };
  const clear = () => {
    jrs.forEach((x) => x.classList.remove('on'));
    mx.classList.remove('dimmed');
  };
  hoverRows(mx, jrs, show, clear);
  show(jrs[0]);
  clear();
  lad.forEach((li) => {
    li.classList.toggle('lit', li.dataset.k === 'band');
    li.classList.remove('off');
  });
  if (!reduce) {
    jrs.forEach((jr) => paint(jr._t ?? [], () => '', 0));
    inview(mx, () => jrs.forEach((jr, i) => setTimeout(() => fill(jr, true), i * 260)));
  }

  // Predictions: eleven calls, scored
  const pred = $('#me-pred');
  if (pred && !reduce) {
    const pt = spans(pred);
    const final = pt.map((t) => t.className.replace('cs-t', '').trim());
    paint(pt, () => '', 0);
    inview(pred, () => paint(pt, (i) => final[i], 90));
  }
  strips();
}

// ---- screener-eval -------------------------------------------------------------------------------------------

type SeStat = { t: string; r: string[]; lab: string[] };

export function initScreenerEval() {
  const el = (id: string) => d.getElementById(id) as HTMLElement;

  // Head figure: bars grow from zero to their real length (marks, not digits)
  const shock = el('se-shock');
  if (shock && !reduce) {
    const bs = $$<HTMLElement>('.se-st i', shock);
    const ks = bs.map((b) => b.style.getPropertyValue('--k'));
    bs.forEach((b) => b.style.setProperty('--k', '0'));
    inview(shock, () => bs.forEach((b, i) => setTimeout(() => b.style.setProperty('--k', ks[i]), 250 + i * 260)), '0px');
  }

  // Forest plot draws in
  const fp = $('.se-fp');
  if (fp && !reduce) {
    fp.classList.add('pre');
    inview(fp, () => requestAnimationFrame(() => fp.classList.remove('pre')));
  }

  // Stability: readout per screener, flips as squares
  const stab = el('se-stab');
  const R = json<Record<string, SeStat>>(stab, 'readouts');
  const scale = $('.se-scale') as HTMLElement;
  const flips = el('se-flips');
  const frs = $$<TileRow>('.se-fr', flips);
  const dts = $$<HTMLElement>('#se-rd dt');
  const dds = ['se-r1', 'se-r2', 'se-r3', 'se-r4', 'se-r5'].map(el);
  frs.forEach((fr) => {
    fr._t = spans(fr);
    fr._k = Number(fr.dataset.k);
  });
  const ink = (fr: HTMLElement) => fr.hasAttribute('data-ink');
  const fill = (fr: TileRow, animate: boolean) => paint(fr._t ?? [], (i) => (i < (fr._k ?? 0) ? (ink(fr) ? 'f' : 'r') : ''), animate ? 28 : 0);
  const show = (fr: HTMLElement) => {
    const s = fr.dataset.s ?? '';
    const D = R[s];
    frs.forEach((x) => x.classList.toggle('on', x === fr));
    flips.classList.add('dimmed');
    scale.classList.toggle('on-haiku', s === 'haiku');
    scale.classList.toggle('on-gpt', s === 'gpt');
    swap(el('se-rt'), D.t);
    dts.forEach((dt, i) => swap(dt, D.lab[i]));
    dds.forEach((dd, i) => swap(dd, D.r[i]));
  };
  const clear = () => {
    frs.forEach((x) => x.classList.remove('on'));
    flips.classList.remove('dimmed');
    scale.classList.remove('on-haiku', 'on-gpt');
  };
  hoverRows(flips, frs, show, clear);
  if (!reduce) {
    scale.classList.add('pre');
    frs.forEach((fr) => paint(fr._t ?? [], () => '', 0));
    inview(stab, () => {
      requestAnimationFrame(() => scale.classList.remove('pre'));
      frs.forEach((fr, i) => setTimeout(() => fill(fr, true), 300 + i * 320));
    });
  }

  // Parser test: ok, missing, wrong, garbled, grouped by outcome
  const pf = el('se-parse');
  const words = json<string[]>(pf, 'words');
  const total = Number(pf.dataset.total);
  const prs = $$<HTMLElement>('.se-pr').map((p) => ({
    v41: (p.dataset.v41 ?? '').split(',').map(Number),
    v42: (p.dataset.v42 ?? '').split(',').map(Number),
    out: $('.se-pv', p) as HTMLElement,
    t: spans(p),
  }));
  const CLS = ['f', '', 'r', 'g'];
  const version = (v: 'v41' | 'v42', animate: boolean) => {
    prs.forEach((P) => {
      const c = P[v];
      const edges = [c[0], c[0] + c[1], c[0] + c[1] + c[2], total];
      swap(P.out, c.map((n, i) => `${n} ${words[i]}`).join(' · '));
      paint(P.t, (i) => {
        for (let k = 0; k < 4; k++) if (i < edges[k]) return CLS[k];
        return '';
      }, animate ? 14 : 0);
    });
  };
  let auto = !reduce;
  const sg = seg($('.cs-seg', pf) as HTMLElement, (v) => {
    auto = false;
    version(v === 'v41' ? 'v41' : 'v42', true);
  });
  const startV = auto ? 'v41' : 'v42';
  sg.set(startV);
  version(startV, false);
  if (auto) {
    inview(pf, () => {
      setTimeout(() => {
        if (auto) sg.pick('v42');
      }, 1000);
    });
  }
  strips();
}
