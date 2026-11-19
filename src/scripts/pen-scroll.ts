// Scroll marks and tallies (Red Pen 5, design/README.md §8). Any element can ask
// the pen for a mark with an attribute; no component needed:
//
//   data-pen="underline"            the pen underlines it when it scrolls into view
//   data-pen="circle" data-pen-on="hover"   ...or when a pointer rests on it (and on focus)
//   data-pen-delay="400"            wait before drawing (ms)
//   data-pen-heavy                  the heavy stroke
//   data-tally                      a number that counts up to its own text when in view
//
// The final state of everything is in the HTML: a mark is decoration (aria-hidden SVG),
// and a tally's element always holds its final value; the count-up only rewrites it
// while it runs. Reduced motion: marks draw at once, tallies do not run.
import { mark, layer, reducedMotion, type MarkKind } from './pen';

const still = reducedMotion();
const motion = () => document.documentElement.classList.contains('motion');
document.documentElement.classList.add('pen-ready');

const inView = (el: Element, fn: () => void, threshold = 0.6) => {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.disconnect();
        fn();
      }
    },
    { threshold, rootMargin: '0px 0px -8% 0px' },
  );
  io.observe(el);
};

const draw = (el: HTMLElement, animate: boolean) => {
  const kind = el.dataset.pen as MarkKind;
  const target = el.querySelector<HTMLElement>('[data-pen-target]') ?? el;
  return mark(el, target, kind, {
    animate,
    heavy: el.hasAttribute('data-pen-heavy'),
    delay: Number(el.dataset.penDelay ?? 0),
    key: el.dataset.penKey ?? el.textContent?.slice(0, 24),
  });
};

const redraw = (el: HTMLElement) => {
  layer(el).replaceChildren();
  draw(el, false);
};

for (const el of document.querySelectorAll<HTMLElement>('[data-pen]')) {
  const hover = el.dataset.penOn === 'hover';
  if (hover) {
    const host = el.closest<HTMLElement>('[data-pen-zone]') ?? el;
    let drawn = false;
    const on = () => {
      if (drawn) return;
      drawn = true;
      draw(el, !still);
    };
    const off = () => {
      drawn = false;
      layer(el).replaceChildren();
    };
    host.addEventListener('pointerenter', on);
    host.addEventListener('focusin', on);
    host.addEventListener('pointerleave', off);
    host.addEventListener('focusout', off);
    continue;
  }
  let done = false;
  const start = () => {
    done = true;
    draw(el, !still);
  };
  if (still) start();
  else inView(el, start);
  new ResizeObserver(() => done && redraw(el)).observe(el);
}

// Tallies: count from zero to the element's own number, keeping its format (commas, decimals, prefix).
for (const el of document.querySelectorAll<HTMLElement>('[data-tally]')) {
  if (still || !motion()) continue;
  const final = el.textContent ?? '';
  const m = final.match(/^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/);
  if (!m) continue;
  const [, pre, num, post] = m;
  const target = Number(num.replace(/,/g, ''));
  const decimals = (num.split('.')[1] ?? '').length;
  const fmt = (v: number) => pre + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + post;
  el.style.fontVariantNumeric = 'tabular-nums';
  inView(el, () => {
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = final;
    };
    requestAnimationFrame(tick);
  }, 0.5);
}
