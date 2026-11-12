// The motion and interaction layer (design/README.md §Motion; BUILD_BRIEF §3).
//
// Library: anime.js v4, modular imports only (animate, stagger):
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
const DUR = { fast: 120, base: 200, slow: 600 };

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

// ------------------------------------------------------------ Fig. 0, the audit sheet
// One red scan line sweeps the sheet once; the failed squares turn red as it passes: each band's red overlay
// (AuditSheet.astro, .as-red) is revealed by a clip-path whose edge moves with the line, so the whole sweep
// is seven animated elements. Then the ledger strip under the H1 wipes in.
const SWEEP = 1100;
const WIPE = ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'];
const fig0Timers = new WeakMap<Element, number>();

function playFig0(fig: HTMLElement): void {
  const bands = fig.querySelector<HTMLElement>('[data-f0-bands]');
  const scan = fig.querySelector<HTMLElement>('[data-f0-scan]');
  const reds = Array.from(fig.querySelectorAll<HTMLElement>('[data-f0-red]'));
  const strip = document.querySelector<HTMLElement>('[data-fig0-strip]');

  // Start frame: every square paper-white (the overlays clipped away), the strip clipped away.
  reds.forEach((r) => (r.style.clipPath = WIPE[0]));
  if (strip) {
    strip.classList.remove('is-in');
    strip.style.clipPath = WIPE[0];
  }
  fig.dataset.state = 'run';

  // The line crosses the sheet in SWEEP; each overlay's clip edge crosses with it.
  if (bands && scan) {
    scan.style.visibility = 'visible';
    animate(scan, {
      translateX: [0, bands.clientWidth],
      duration: SWEEP,
      ease: 'linear',
      onComplete: () => {
        scan.style.visibility = 'hidden';
        clear([scan], 'transform');
      },
    });
  }
  if (reds.length) {
    animate(reds, {
      clipPath: WIPE,
      duration: SWEEP,
      ease: 'linear',
      onComplete: () => clear(reds, 'clip-path'),
    });
  }

  // The strip wipes in once the line has crossed the sheet (a clip, never a fade: full contrast throughout).
  if (strip) {
    window.clearTimeout(fig0Timers.get(fig));
    fig0Timers.set(
      fig,
      window.setTimeout(() => {
        animate(strip, {
          clipPath: WIPE,
          duration: 360,
          ease: EASE,
          onComplete: () => {
            strip.classList.add('is-in');
            clear([strip], 'clip-path');
          },
        });
      }, SWEEP + 80),
    );
  }
}

// ------------------------------------------------------------ contribution heatmap
/** One chronological sweep (~1.2 s): cells draw in by date, the total counts up from
 *  0 to the real total (integers, so every value shown is one the year passed through),
 *  then the most recent week gets one soft red pulse. Final state is in the HTML;
 *  titles (date and count) and the accessible summary are untouched. */
function playHeatmap(graph: HTMLElement): void {
  const cells = Array.from(graph.querySelectorAll<HTMLElement>('.cg-cell')).sort((a, b) =>
    (a.dataset.date ?? '').localeCompare(b.dataset.date ?? ''),
  );
  if (!cells.length) return graph.classList.add('is-in');
  const SWEEP = 1200;
  const per = SWEEP / cells.length;
  const finish = () => {
    graph.classList.add('is-in');
    clear(cells, 'transform', 'opacity');
    cells.slice(-7).forEach((c) => {
      c.classList.add('cg-pulse');
      c.addEventListener('animationend', () => c.classList.remove('cg-pulse'), { once: true });
    });
  };
  animate(cells, { scale: [0, 1], opacity: [0, 1], duration: 220, delay: stagger(per), ease: EASE, onComplete: finish });

  const totalEl = graph.querySelector<HTMLElement>('[data-cg-total]');
  const total = Number(graph.dataset.total);
  if (totalEl && Number.isFinite(total) && total > 0) {
    const state = { v: 0 };
    totalEl.textContent = '0';
    graph.classList.add('is-counting');
    animate(state, {
      v: total,
      duration: SWEEP,
      ease: 'linear',
      onUpdate: () => {
        totalEl.textContent = String(Math.round(state.v));
      },
      onComplete: () => {
        totalEl.textContent = graph.dataset.total ?? String(total);
      },
    });
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
          // The sheet is short and Replay sits in its caption row; just make sure all of it is on screen.
          fig.scrollIntoView({ block: 'nearest' });
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

  // Fig. 0 plays on load: the scan line sweeps the sheet once, then the strip wipes in.
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

  // Contribution heatmap: one chronological sweep on first view.
  document.querySelectorAll<HTMLElement>('[data-contrib-graph]').forEach((g) => onceInView(g, () => playHeatmap(g), 0.3));

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
