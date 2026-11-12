// The motion and interaction layer (design/README.md §Motion; BUILD_BRIEF §3).
//
// Library: anime.js v4, modular imports only (animate, timeline, stagger):
// about 15 KB gzipped, loaded only on the pages that include <Motion /> (home,
// /builds/, the three case studies, /writing/). First paint never waits on it:
// it is a deferred module, and every element's final state is in the HTML.
//
// Rules this file keeps:
//   - Animation runs only when <html> has `.motion` (set in the head when JS
//     runs, IntersectionObserver exists and reduced motion is off). The head
//     script removes `.motion` again if this module has not booted in 4 s.
//   - Pre-reveal states live in CSS under `.motion`; anime animates inline
//     values from that state to the final one, then clears them.
//   - The H1 text never animates; only its underline draws.
//   - Nothing animates layout: transforms, opacity and stroke offsets only.
//   - Interaction that is not animation (click/tap-to-open ledger rows, Replay
//     buttons) works with reduced motion too; it just does not tween.
//   - Numbers are never tweened: every numeral renders its final value.

import { animate } from 'animejs/animation';
import { createTimeline } from 'animejs/timeline';
import { stagger } from 'animejs/utils';

declare global {
  interface Window {
    __zmMotion?: boolean;
  }
}

const root = document.documentElement;
window.__zmMotion = true;
const moving = (): boolean => root.classList.contains('motion');

const EASE = 'outCubic';
const DUR = { fast: 120, base: 200, slow: 600, story: 600 };

/** Clear the inline values anime left so the CSS final state takes over. */
const clear = (els: Iterable<Element>, ...props: string[]) => {
  for (const el of els) for (const p of props) (el as HTMLElement).style.removeProperty(p);
};

/** Run `fn` once, when `el` is at least `threshold` in view. */
function onceInView(el: Element, fn: () => void, threshold = 0.5): void {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.disconnect();
        fn();
      }
    },
    { threshold, rootMargin: '0px 0px -6% 0px' },
  );
  io.observe(el);
}

// ------------------------------------------------------------ line draws
function draw(els: HTMLElement[], delay = 0): void {
  if (!els.length) return;
  animate(els, {
    scaleX: [0, 1],
    duration: DUR.slow,
    delay: stagger(90, { start: delay }),
    ease: EASE,
    onComplete: () => {
      els.forEach((el) => el.classList.add('is-in'));
      clear(els, 'transform');
    },
  });
}

function pop(els: HTMLElement[], delay = 0): void {
  if (!els.length) return;
  animate(els, {
    opacity: [0, 1],
    scale: [0.4, 1],
    duration: DUR.base * 2,
    delay,
    ease: 'outBack(2)',
    onComplete: () => {
      els.forEach((el) => el.classList.add('is-in'));
      clear(els, 'opacity', 'transform');
    },
  });
}

function playFigure(fig: Element): void {
  draw(Array.from(fig.querySelectorAll<HTMLElement>('[data-draw]')));
  pop(Array.from(fig.querySelectorAll<HTMLElement>('[data-pop]')), DUR.slow - 120);
}

// ------------------------------------------------------------ Fig. 0
function playFig0(fig: HTMLElement): void {
  fig.classList.remove('is-done');
  const steps = Array.from(fig.querySelectorAll<HTMLElement>('[data-f0-step]'));
  const conns = Array.from(fig.querySelectorAll<HTMLElement>('[data-f0-conn]'));
  const cloud = fig.querySelector<SVGPathElement>('[data-f0-cloud]');
  const note = fig.querySelector<HTMLElement>('[data-f0-note]');
  const stamp = fig.querySelector<HTMLElement>('[data-f0-stamp]');

  const tl = createTimeline({
    defaults: { ease: EASE },
    onComplete: () => {
      fig.classList.add('is-done');
      clear(steps, 'clip-path', 'transform');
      clear(conns, 'transform');
      if (cloud) clear([cloud], 'stroke-dasharray', 'stroke-dashoffset');
      if (note) clear([note], 'clip-path');
      if (stamp) clear([stamp], 'clip-path', 'transform');
    },
  });

  // Step 0 (the output) rises, then the revision cloud rings the bad citation.
  // Reveals are clip-path wipes, never fades: text stays at full contrast throughout.
  const WIPE = ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'];
  tl.add(steps[0], { clipPath: WIPE, translateY: [8, 0], duration: DUR.story }, 150);
  if (cloud) {
    cloud.style.strokeDasharray = '100';
    tl.add(cloud, { strokeDashoffset: [100, 0], duration: 700, ease: 'inOutSine' }, 650);
  }
  if (note) tl.add(note, { clipPath: WIPE, duration: 360 }, 1250);
  // Steps 1-4: each connector grows, then its step rises (about 0.45 s apart).
  steps.slice(1).forEach((step, i) => {
    const at = 1450 + i * 420;
    if (conns[i]) tl.add(conns[i], { scaleY: [0, 1], duration: 220 }, at);
    tl.add(step, { clipPath: WIPE, translateY: [8, 0], duration: DUR.story }, at + 120);
  });
  // The stamp lands at about 3.2 s.
  if (stamp) {
    tl.add(stamp, { clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], duration: 1 }, 3200);
    tl.add(stamp, { scale: [1.6, 1], rotate: [-12, -3], duration: 380, ease: 'outBack(1.6)' }, 3200);
  }
}

// ------------------------------------------------------------ TradeFrame path
const flowTimers = new WeakMap<Element, number>();

function playFlow(fig: HTMLElement): void {
  const parts = Array.from(fig.querySelectorAll<HTMLElement>('[data-step]'));
  if (!parts.length) return;
  const max = Math.max(...parts.map((p) => Number(p.dataset.step)));
  window.clearTimeout(flowTimers.get(fig));
  let k = 0;
  const tick = () => {
    parts.forEach((p) => p.classList.toggle('on', Number(p.dataset.step) === k));
    if (k <= max) {
      k += 1;
      flowTimers.set(fig, window.setTimeout(tick, 850));
    } else {
      parts.forEach((p) => p.classList.remove('on'));
    }
  };
  tick();
}

// ------------------------------------------------------------ ledger rows
/** Open/close a ledger row's panel on click, tap or Enter (native <details>);
 *  animate its height when motion is on. No hover behaviour (v3.1 review). */
function wireLedger(row: HTMLDetailsElement): void {
  const panel = row.querySelector<HTMLElement>('[data-panel]');
  const summary = row.querySelector('summary');
  if (!panel || !summary) return;
  let busy = false;

  const reveal = () => {
    const fig = panel.querySelector('[data-mini-figure]');
    if (fig && moving()) playFigure(fig);
  };

  // Without motion the native toggle does everything; just draw the figure on open.
  row.addEventListener('toggle', () => {
    if (row.open && !busy) reveal();
  });
  if (!moving()) return;

  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (busy) return;
    busy = true;
    panel.style.overflow = 'hidden';
    if (!row.open) {
      // Collapse first so the opening frame never flashes at full height.
      panel.style.height = '0px';
      row.open = true;
      reveal();
      animate(panel, {
        height: [0, panel.scrollHeight],
        opacity: [0, 1],
        duration: 260,
        ease: EASE,
        onComplete: () => {
          busy = false;
          clear([panel], 'height', 'opacity', 'overflow');
        },
      });
    } else {
      animate(panel, {
        height: [panel.scrollHeight, 0],
        opacity: [1, 0],
        duration: 200,
        ease: 'inCubic',
        onComplete: () => {
          row.open = false;
          busy = false;
          clear([panel], 'height', 'opacity', 'overflow');
        },
      });
    }
  });
}

// ------------------------------------------------------------ boot
function boot(): void {
  // Replay buttons exist in the HTML, hidden; they are only useful with motion.
  const anim = moving();

  // Ledger rows (interaction works under reduced motion too).
  document.querySelectorAll<HTMLDetailsElement>('[data-ledger] details').forEach(wireLedger);

  // Replay controls.
  document.querySelectorAll<HTMLButtonElement>('[data-replay]').forEach((btn) => {
    if (!anim) return;
    btn.hidden = false;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (btn.dataset.replay === 'fig0') {
        const fig = btn.closest<HTMLElement>('[data-fig0]');
        if (fig) {
          // Bring the whole figure into view first, so the replay is seen from step 0.
          fig.scrollIntoView({ block: 'start' });
          requestAnimationFrame(() => playFig0(fig));
        }
      } else {
        const id = btn.getAttribute('aria-controls');
        const target = id ? document.getElementById(id) : btn.closest<HTMLElement>('[data-flow]');
        if (target) playFlow(target);
      }
    });
  });

  if (!anim) return;

  // H1 underline: the pen draws under "quietly." (the text itself never moves).
  document.querySelectorAll<HTMLElement>('[data-underline]').forEach((u) => {
    animate(u, {
      scaleX: [0, 1],
      duration: DUR.slow,
      delay: 250,
      ease: 'inOutCubic',
      onComplete: () => {
        u.classList.add('is-in');
        clear([u], 'transform');
      },
    });
  });

  // Fig. 0 plays on load.
  document.querySelectorAll<HTMLElement>('[data-fig0]').forEach((fig) => requestAnimationFrame(() => playFig0(fig)));

  // Readings: the dimension line draws from the datum to the value. The numeral
  // itself is never tweened (no intermediate values are ever shown).
  document.querySelectorAll<HTMLElement>('[data-reading]').forEach((rd, i) => {
    onceInView(rd, () => {
      const d = i * 120;
      draw(Array.from(rd.querySelectorAll<HTMLElement>('[data-draw]')), d);
      pop(Array.from(rd.querySelectorAll<HTMLElement>('[data-pop]')), d + DUR.slow - 120);
    });
  });

  // Mini figures outside ledger panels (case-study Fig. 1, About Fig. 2).
  document.querySelectorAll<HTMLElement>('[data-mini-figure]').forEach((fig) => {
    if (fig.closest('[data-panel]')) return;
    onceInView(fig, () => playFigure(fig), 0.6);
  });

  // TradeFrame decision path: plays once in view.
  document.querySelectorAll<HTMLElement>('[data-flow]').forEach((fig) => onceInView(fig, () => playFlow(fig), 0.6));

  // Section ticks grow on the top rule as each section enters view.
  document.querySelectorAll<HTMLElement>('[data-tick]').forEach((t) => onceInView(t.parentElement ?? t, () => draw([t]), 0.15));

  // Ledger rows settle in (B-22): 10px, 70 ms apart.
  document.querySelectorAll<HTMLElement>('[data-ledger]').forEach((ledger) => {
    const rows = Array.from(ledger.querySelectorAll<HTMLElement>('.l-item'));
    onceInView(
      ledger,
      () =>
        animate(rows, {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 420,
          delay: stagger(70),
          ease: EASE,
          onComplete: () => {
            ledger.classList.add('is-in');
            clear(rows, 'opacity', 'transform');
          },
        }),
      0.1,
    );
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
