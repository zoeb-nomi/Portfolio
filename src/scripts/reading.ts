/* Reading-page behaviour for essays, notes and long case studies (The Pipeline).
   Imported by components/Masthead.astro on pages whose head carries [data-article].
   Everything degrades: without JS there is no spine and every footnote stays in its list at the end. */
import { $, $$, clamp, motion, swap } from './ds';

const d = document;
const w = window;

/** The red spine: down the left edge of the article, from its first line to the end of its last section (or its
    footnotes), then a terminal square. Under 1100px it becomes a fixed progress bar under the header. */
export function readingSpine() {
  const main = $('main');
  const secs = $$('.rs', main ?? d);
  if (!main || !secs.length) return;
  const first = secs[0];
  const last = secs[secs.length - 1];
  const foot = $$('.footnotes', main).pop();
  const end: HTMLElement = foot ?? last;
  const heads = $$('.rs-h', main);

  const prog = d.createElement('div');
  prog.className = 'rd-prog';
  prog.setAttribute('aria-hidden', 'true');
  prog.innerHTML = '<div class="rd-track"></div><div class="rd-ticks"></div><div class="rd-fill"></div><div class="rd-tip"><span class="rd-tiplab"></span></div>';
  main.appendChild(prog);
  const fill = $('.rd-fill', prog)!;
  const tip = $('.rd-tip', prog)!;
  const lab = $('.rd-tiplab', prog)!;
  const ticks = $('.rd-ticks', prog)!;

  // Reduced motion: the finished line, no scroll-driven movement.
  const still = !motion();
  const narrow = w.matchMedia('(max-width: 1099px)');
  const g = { top: 0, th: 1, at: 0, ah: 1, vis: false, secs: [] as { y: number; no: string }[] };
  let last_ = -1;
  let raf = 0;

  const measure = () => {
    const sy = w.scrollY;
    const mt = main.getBoundingClientRect().top + sy;
    const fr = first.getBoundingClientRect();
    const inEl = $('.in', first);
    const left = (inEl ?? first).getBoundingClientRect().left;
    const topPad = parseFloat(getComputedStyle(first).paddingTop) || 0;
    const top = fr.top + sy + topPad;
    const bottom = end.getBoundingClientRect().bottom + sy;
    g.at = top;
    g.ah = Math.max(1, bottom - top - w.innerHeight * 0.45);
    g.top = top;
    g.th = Math.max(1, bottom - top);
    if (!narrow.matches) {
      prog.style.left = `${Math.round(left)}px`;
      prog.style.top = `${Math.round(top - mt)}px`;
      prog.style.height = `${Math.round(g.th)}px`;
      prog.style.right = '';
    } else {
      prog.style.left = '';
      prog.style.top = '';
      prog.style.height = '';
    }
    g.secs = heads.map((h) => {
      const n = $('.sec-no', h) ?? h;
      const b = n.getBoundingClientRect();
      return { y: b.top + b.height / 2 + sy, no: n === h ? '' : (n.textContent ?? '').trim() };
    });
    ticks.textContent = '';
    if (!narrow.matches) {
      g.secs.forEach((s) => {
        const t = d.createElement('i');
        t.style.top = `${(clamp((s.y - g.top) / g.th, 0, 1) * 100).toFixed(2)}%`;
        ticks.appendChild(t);
      });
    }
    last_ = -1;
    frame();
  };

  const frame = () => {
    raf = 0;
    if (still) {
      if (narrow.matches) {
        fill.style.transform = 'scaleX(1)';
        prog.classList.remove('on');
      } else {
        fill.style.transform = 'scaleY(1)';
        tip.style.display = 'none';
        prog.classList.add('done');
      }
      return;
    }
    if (narrow.matches) {
      const vis = g.at < w.scrollY + w.innerHeight && g.at + g.ah + w.innerHeight * 0.45 > w.scrollY + w.innerHeight * 0.5;
      if (vis !== g.vis) {
        g.vis = vis;
        prog.classList.toggle('on', vis);
      }
      const q = clamp((w.scrollY + w.innerHeight * 0.35 - g.at) / g.ah, 0, 1);
      if (Math.abs(q - last_) < 0.0004) return;
      last_ = q;
      fill.style.transform = `scaleX(${q.toFixed(4)})`;
      return;
    }
    const y = w.scrollY + w.innerHeight * 0.5;
    const p = clamp((y - g.top) / g.th, 0, 1);
    if (Math.abs(p - last_) < 0.0004) return;
    last_ = p;
    fill.style.transform = `scaleY(${p.toFixed(4)})`;
    tip.style.transform = `translate3d(0,${(p * g.th).toFixed(1)}px,0)`;
    prog.classList.toggle('done', p >= 0.999);
    let cur = '';
    for (const s of g.secs) if (s.y <= y) cur = s.no;
    swap(lab, cur);
  };

  const ask = () => {
    if (!raf) raf = w.requestAnimationFrame(frame);
  };
  w.addEventListener('scroll', ask, { passive: true });
  w.addEventListener('resize', () => w.requestAnimationFrame(measure));
  narrow.addEventListener('change', measure);
  if (w.ResizeObserver) new ResizeObserver(() => w.requestAnimationFrame(measure)).observe(main);
  if (d.fonts?.ready) d.fonts.ready.then(measure);
  measure();
}

/** Footnote markers open their note in place, under the paragraph that cites them. A second press closes it. */
export function footnotes() {
  const refs = $$<HTMLAnchorElement>('.prose sup a[href^="#fn"]');
  if (!refs.length) return;
  refs.forEach((a) => {
    const li = $(a.getAttribute('href') ?? '');
    if (!li) return;
    a.setAttribute('aria-expanded', 'false');
    a.setAttribute('aria-controls', `fx-${li.id}`);
  });
  // Capture phase on the document, so the site-wide anchor scroll (ds.ts) does not also jump to the list.
  d.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('.prose sup a[href^="#fn"]');
      if (!a) return;
      const li = $(a.getAttribute('href') ?? '');
      if (!li) return;
      e.preventDefault();
      e.stopPropagation();
      const id = `fx-${li.id}`;
      const open = d.getElementById(id);
      if (open) {
        a.setAttribute('aria-expanded', 'false');
        open.remove();
        return;
      }
      const host = a.closest('p,li,figcaption,.tbl-wrap') ?? a.parentElement;
      if (!host) return;
      const box = d.createElement('div');
      box.className = 'fnbox';
      box.id = id;
      box.setAttribute('role', 'note');
      const n = d.createElement('b');
      n.textContent = a.dataset.n ?? '';
      box.appendChild(n);
      const c = li.cloneNode(true) as HTMLElement;
      $$('.back', c).forEach((b) => b.remove());
      while (c.firstChild) box.appendChild(c.firstChild);
      host.insertAdjacentElement('afterend', box);
      a.setAttribute('aria-expanded', 'true');
    },
    true,
  );
}

/** Both behaviours, for pages whose head carries [data-article]. */
export function reading() {
  if (!d.querySelector('[data-article]')) return;
  readingSpine();
  footnotes();
}
