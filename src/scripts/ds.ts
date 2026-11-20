/* The Pipeline runtime (design/README.md §8). Base.astro calls init() on every page.
   Everything degrades: without JS or under reduced motion the page is complete and static.
   The kit's own motion (reveals, spines, the verbs wave) uses IntersectionObserver and the Web Animations API,
   so a plain page ships no animation library. Pages whose own scripts need GSAP import it from ./gsap.
   Smooth wheel scrolling: Lenis (npm, pinned), only for a fine pointer and never under reduced motion; touch keeps
   native scrolling. Anything that must hold the page (the home trace inspector) calls scrollLock(). */
import Lenis from 'lenis';

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

let lenis: Lenis | null = null;

/** Hold or release the page (a modal panel); pauses smooth scrolling while held. */
export function scrollLock(on: boolean) {
  if (!lenis) return;
  if (on) lenis.stop();
  else lenis.start();
}

/** Smooth wheel scrolling for mouse and trackpad. Nested scrollers opt out with data-lenis-prevent. */
function smoothScroll() {
  if (reduce || !w.matchMedia('(pointer: fine)').matches) return;
  lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });
  const loop = (t: number) => {
    lenis?.raf(t);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

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
      if (lenis) lenis.scrollTo(el, { offset: -(hh + 8) });
      else w.scrollTo({ top: el.getBoundingClientRect().top + w.scrollY - hh - 8, behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });
}

const POWER2_OUT = 'cubic-bezier(.33,1,.68,1)';

/** Run `fn` once when `el` first crosses `ratio` of the viewport height from the top (like ScrollTrigger "top N%"). */
function onEnter(el: Element, ratio: number, fn: () => void) {
  // Already past the trigger line (the page opened on an anchor, or was restored mid-scroll): run now, as
  // ScrollTrigger would, so nothing above the viewport stays hidden.
  if (el.getBoundingClientRect().top < w.innerHeight * ratio) {
    fn();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.disconnect();
        fn();
        return;
      }
    },
    { rootMargin: `0px 0px -${Math.round((1 - ratio) * 100)}% 0px` },
  );
  io.observe(el);
}

/** Hide an element now and fade it up when it arrives; elements already on screen fade in at once. */
function fadeUp(el: HTMLElement, ratio: number, y: number, duration: number, delay = 0) {
  el.style.opacity = '0';
  onEnter(el, ratio, () => {
    const a = el.animate(
      [
        { opacity: 0, transform: `translate3d(0,${y}px,0)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration, delay, easing: POWER2_OUT, fill: 'backwards' },
    );
    el.style.opacity = '';
    a.addEventListener('finish', () => a.cancel());
  });
}

/** Reveals: .split / [data-split] headings fade up whole; [data-reveal] blocks; [data-stagger] children;
    [data-num] numbers revealed whole once in view. */
export function reveals(root: ParentNode = d) {
  if (!motion() || !('IntersectionObserver' in w)) return;
  $$('[data-split],.h2.split,.display.split', root).forEach((h) => fadeUp(h, 0.92, 10, 1100));
  $$('[data-reveal]', root).forEach((el) => fadeUp(el, 0.95, 10, 1000));
  $$('[data-stagger]', root).forEach((el) =>
    Array.from(el.children).forEach((c, i) => fadeUp(c as HTMLElement, 0.95, 8, 900, i * 50)),
  );
  $$('[data-num]', root).forEach((el) => {
    revealNumber(el, 0);
    onEnter(el, 0.9, () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const t = clamp((now - t0) / 600, 0, 1);
        revealNumber(el, t);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  });
}

/** Red spine: draws down its section as you scroll, from the section's top at 70% of the viewport to its bottom
    at 60%; latched, so it only ever grows. */
export function spines(root: ParentNode = d) {
  if (!motion()) return;
  const items = $$('.spine', root)
    .map((sp) => ({ sp, sec: sp.parentElement as HTMLElement | null, mx: 0 }))
    .filter((x): x is { sp: HTMLElement; sec: HTMLElement; mx: number } => !!x.sec);
  if (!items.length) return;
  items.forEach((x) => (x.sp.style.transform = 'scaleY(0)'));
  let queued = false;
  const update = () => {
    queued = false;
    const vh = w.innerHeight;
    for (const x of items) {
      if (x.mx >= 1) continue;
      const r = x.sec.getBoundingClientRect();
      const p = clamp((0.7 * vh - r.top) / (0.1 * vh + r.height), 0, 1);
      if (p <= x.mx) continue;
      x.mx = p;
      x.sp.style.transform = `scaleY(${p.toFixed(4)})`;
    }
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  w.addEventListener('scroll', queue, { passive: true });
  w.addEventListener('resize', queue);
  update();
}

/** Verbs row: one variable-weight wave when the row arrives (time-based, so it never rests half-weight). */
export function verbs(root: ParentNode = d) {
  if (!motion() || !('IntersectionObserver' in w)) return;
  $$('.verb-row', root).forEach((row) => {
    const items = $$('.verb', row);
    const heads = items.map((v) => $('h3', v)).filter((h): h is HTMLElement => !!h);
    heads.forEach((h) => {
      h.style.setProperty('--vw', '62');
      h.style.setProperty('--vg', '200');
    });
    items.forEach((v, i) => fadeUp(v, 0.88, 10, 1000, i * 80));
    onEnter(row, 0.85, () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const t = clamp((now - t0) / 1600, 0, 1);
        heads.forEach((h, i) => {
          const p = sub(t, i * 0.1, i * 0.1 + 0.6);
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
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
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
  // Re-check as soon as a wrapper changes size (rotation, window resize), not after a debounce.
  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(apply);
    els.forEach((el) => ro.observe(el));
  } else {
    addEventListener('resize', apply);
  }
}

let started = false;
/** Run once per page from Base.astro. Page modules may call reveals/spines/verbs on their own roots. */
export function init() {
  if (started) return;
  started = true;
  markNav();
  theme();
  smoothScroll();
  anchors();
  scrollRegions();
  reveals();
  spines();
  verbs();
}
