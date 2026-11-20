/* The Pipeline runtime (design/README.md §8). Base.astro calls init() on every page.
   Everything degrades: without JS or under reduced motion the page is complete and static.
   GSAP + ScrollTrigger are bundled from npm (no CDN). No smooth-scroll library. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const d = document;
const w = window;

export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = d) => r.querySelector<T>(s);
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = d) => Array.from(r.querySelectorAll<T>(s));
export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sub = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
export const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const cubicInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const motion = () => !reduce;
export { gsap, ScrollTrigger };

/** Read a "r,g,b" scene token (canvas colours). */
export const sceneRGB = (name: '--scene-bg' | '--scene-ink' | '--scene-red') =>
  getComputedStyle(d.documentElement).getPropertyValue(name).trim() || '0,0,0';

/** Instant digit change with a short opacity tick, no empty frames. */
export function swap(el: HTMLElement & { _dsv?: string }, value: string | number) {
  const v = String(value);
  if (el._dsv === v) return;
  const first = el._dsv == null;
  el._dsv = v;
  el.textContent = v;
  if (first || reduce || !el.animate) return;
  el.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
}

/** Whole-number reveal: opacity and a 6px rise on the whole value, never a count. */
export function revealNumber(el: HTMLElement, t: number) {
  const e = expoOut(clamp(t, 0, 1));
  el.style.opacity = e.toFixed(3);
  el.style.transform = e < 0.999 ? `translate3d(0,${((1 - e) * 6).toFixed(1)}px,0)` : 'none';
}

/** Mark the current nav link: <a class="nl" data-page="builds"> against <body data-page>. */
function markNav() {
  const page = d.body.dataset.page;
  if (!page) return;
  $$('.nl').forEach((a) => {
    if (a.dataset.page === page) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/** Theme toggle: dark by default, light on request, remembered per viewer; fires `ds:theme`. */
function theme() {
  const root = d.documentElement;
  const b = $<HTMLButtonElement>('.theme-t');
  if (!b) return;
  const get = () => (root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  const label = () => b.setAttribute('aria-label', get() === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  label();
  b.addEventListener('click', () => {
    const t = get() === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', t);
    try {
      localStorage.setItem('ds-theme', t);
    } catch {
      /* storage blocked: the choice lasts for this page only */
    }
    label();
    w.dispatchEvent(new CustomEvent('ds:theme', { detail: t }));
  });
}

/** In-page anchors: native smooth scroll, offset for the sticky header. */
function anchors() {
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href') || '#';
      if (id === '#') return;
      let el: HTMLElement | null = null;
      try {
        el = $(id);
      } catch {
        return;
      }
      if (!el) return;
      e.preventDefault();
      const hh = parseInt(getComputedStyle(d.documentElement).getPropertyValue('--header-h'), 10) || 60;
      w.scrollTo({ top: el.getBoundingClientRect().top + w.scrollY - hh - 8, behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });
}

/** Reveals: .split / [data-split] headings fade up whole; [data-reveal] blocks; [data-stagger] children;
    [data-num] numbers revealed whole once in view. */
export function reveals(root: ParentNode = d) {
  if (!motion()) return;
  $$('[data-split],.h2.split,.display.split', root).forEach((h) => {
    gsap.from(h, { autoAlpha: 0, y: 10, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 92%', once: true } });
  });
  $$('[data-reveal]', root).forEach((el) => {
    gsap.from(el, { y: 10, autoAlpha: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
  });
  $$('[data-stagger]', root).forEach((el) => {
    gsap.from(el.children, { y: 8, autoAlpha: 0, duration: 0.9, ease: 'power2.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
  });
  $$('[data-num]', root).forEach((el) => {
    revealNumber(el, 0);
    const o = { t: 0 };
    gsap.to(o, { t: 1, duration: 0.6, ease: 'none', onUpdate: () => revealNumber(el, o.t), scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
}

/** Red spine: draws down its section as you scroll; latched, so it only ever grows. */
export function spines(root: ParentNode = d) {
  if (!motion()) return;
  $$('.spine', root).forEach((sp) => {
    const sec = sp.parentElement;
    if (!sec) return;
    let mx = 0;
    gsap.set(sp, { scaleY: 0 });
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 70%',
      end: 'bottom 60%',
      onUpdate: (self) => {
        if (self.progress <= mx) return;
        mx = self.progress;
        sp.style.transform = `scaleY(${mx.toFixed(4)})`;
      },
    });
  });
}

/** Verbs row: one variable-weight wave when the row arrives (time-based, so it never rests half-weight). */
export function verbs(root: ParentNode = d) {
  if (!motion()) return;
  $$('.verb-row', root).forEach((row) => {
    const items = $$('.verb', row);
    const heads = items.map((v) => $('h3', v)).filter((h): h is HTMLElement => !!h);
    heads.forEach((h) => {
      h.style.setProperty('--vw', '62');
      h.style.setProperty('--vg', '200');
    });
    const o = { t: 0 };
    gsap.to(o, {
      t: 1,
      duration: 1.6,
      ease: 'none',
      scrollTrigger: { trigger: row, start: 'top 85%', once: true },
      onUpdate: () => {
        heads.forEach((h, i) => {
          const p = sub(o.t, i * 0.1, i * 0.1 + 0.6);
          let wg: number;
          let wd: number;
          if (p < 0.55) {
            const e = expoOut(p / 0.55);
            wg = lerp(200, 900, e);
            wd = lerp(62, 100, e);
          } else {
            wg = lerp(900, 620, cubicInOut((p - 0.55) / 0.45));
            wd = 100;
          }
          h.style.setProperty('--vg', wg.toFixed(0));
          h.style.setProperty('--vw', wd.toFixed(1));
        });
      },
    });
    gsap.from(items, { y: 10, autoAlpha: 0, duration: 1, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: row, start: 'top 88%', once: true } });
  });
}

/** A table or diagram that scrolls sideways becomes a keyboard stop (a named region) only while it overflows. */
function scrollRegions() {
  const els = $$('.tbl-wrap, .bd-flow-wrap, [data-scroll-region]');
  if (!els.length) return;
  const name = (el: HTMLElement) => {
    const cap = el.querySelector('caption')?.textContent?.trim();
    if (cap) return cap;
    let p: Element | null = el;
    while (p && p !== d.body) {
      let s: Element | null = p.previousElementSibling;
      while (s) {
        const h = s.matches('h2,h3,h4') ? s : s.querySelector('h2,h3,h4');
        if (h?.textContent?.trim()) return h.textContent.trim();
        s = s.previousElementSibling;
      }
      p = p.parentElement;
    }
    return d.title;
  };
  const apply = () =>
    els.forEach((el) => {
      if (el.dataset.dsRegion === 'fixed') return;
      const over = el.scrollWidth > el.clientWidth + 1;
      if (over && !el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'region');
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', name(el));
        el.dataset.dsRegion = 'on';
      } else if (!over && el.dataset.dsRegion === 'on') {
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        delete el.dataset.dsRegion;
      }
    });
  apply();
  let t = 0;
  w.addEventListener('resize', () => {
    clearTimeout(t);
    t = w.setTimeout(apply, 150);
  });
}

let started = false;
/** Run once per page from Base.astro. Page modules may call reveals/spines/verbs on their own roots. */
export function init() {
  if (started) return;
  started = true;
  markNav();
  theme();
  anchors();
  scrollRegions();
  if (motion()) gsap.registerPlugin(ScrollTrigger);
  reveals();
  spines();
  verbs();
  if (motion() && d.fonts?.ready) d.fonts.ready.then(() => ScrollTrigger.refresh());
}
