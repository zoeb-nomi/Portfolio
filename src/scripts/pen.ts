// The pen (Red Pen 5, design/README.md §8): the one actor on the site. It draws
// proofreader's marks over real text: circle (query: this is wrong), strike
// (delete), caret (insert), underline (stress), tick (checked, fine), cross
// (rejected) and a leader (a line from a mark to its note in the margin).
//
// Marks are hand-drawn, not geometric: every path is generated from the target's
// box with a seeded wobble, so the same mark looks the same on every load and
// resize but no two marks match. The final state never depends on this file:
// without JS, CSS fallbacks in pen.css draw a plain version of each mark.
//
// Motion rules this file keeps:
//   - draw() only animates stroke-dashoffset (compositor-friendly, no layout).
//   - Duration scales with the path's length: a pen is faster on short marks.
//   - Under reduced motion every mark renders final at once (animate: false).

export type MarkKind = 'circle' | 'strike' | 'underline' | 'caret' | 'tick' | 'cross' | 'leader' | 'box';

export const MOTION = {
  mark: 560,
  markMin: 260,
  markMax: 900,
  stamp: 260,
  char: 16,
  easePen: 'cubic-bezier(.55, .05, .25, 1)',
  easeStamp: 'cubic-bezier(.3, 1.5, .5, 1)',
  easeDraw: 'cubic-bezier(.2, .7, .2, 1)',
} as const;

const SVGNS = 'http://www.w3.org/2000/svg';

export const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** mulberry32: a small seeded PRNG, so a mark's wobble is stable. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

type Pt = [number, number];

/** A smooth path through points (Catmull-Rom to cubic Bezier). */
function smooth(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The path for one mark over one box (coordinates in the host's space). */
export function markPath(kind: MarkKind, b: Box, seed: number, to?: Box): string {
  const r = rng(seed);
  const j = (n: number) => (r() - 0.5) * 2 * n; // jitter of +/- n px
  const { x, y, w, h } = b;
  switch (kind) {
    case 'circle': {
      // An ellipse that starts past 12 o'clock, runs a little over a full turn and overshoots: a pen, not a compass.
      const cx = x + w / 2 + j(2);
      const cy = y + h / 2 + j(1);
      const rx = w / 2 + 12 + j(3);
      const ry = h / 2 + 8 + j(2);
      const start = -Math.PI * (0.62 + r() * 0.1);
      const sweep = Math.PI * 2 * (1.08 + r() * 0.06);
      const n = 28;
      const pts: Pt[] = [];
      for (let i = 0; i <= n; i++) {
        const t = start + (sweep * i) / n;
        const drift = 1 + (i / n) * 0.06; // the loop opens as it closes
        pts.push([cx + Math.cos(t) * rx * drift + j(1.2), cy + Math.sin(t) * ry * drift + j(1)]);
      }
      return smooth(pts);
    }
    case 'strike': {
      const yy = y + h * 0.56;
      const a = j(2);
      return smooth([
        [x - 5, yy + a + 2],
        [x + w * 0.5, yy + j(1.4)],
        [x + w + 3, yy - a - 2],
      ]);
    }
    case 'underline': {
      const yy = y + h + 3;
      return smooth([
        [x - 3, yy + j(1)],
        [x + w * 0.35, yy + 1.5 + j(1)],
        [x + w * 0.7, yy + j(1)],
        [x + w + 6, yy - 2 + j(1)],
      ]);
    }
    case 'caret': {
      // A caret below the line at the box's right edge: the insert goes above.
      const cx = x + w + 2;
      const base = y + h + 7;
      return `M${(cx - 7).toFixed(1)} ${(base + 5).toFixed(1)} L${(cx + j(0.8)).toFixed(1)} ${(base - 7).toFixed(1)} L${(cx + 7).toFixed(1)} ${(base + 5 + j(1)).toFixed(1)}`;
    }
    case 'tick': {
      // A small check mark riding above the end of the word, in the space between lines.
      const s = Math.min(h * 0.7, 16);
      const ox = x + w - s * 0.6;
      const oy = y - s * 0.15;
      return smooth([
        [ox, oy - s * 0.05],
        [ox + s * 0.32, oy + s * 0.38 + j(1)],
        [ox + s * 0.95, oy - s * 0.62 + j(1.5)],
      ]);
    }
    case 'cross': {
      const s = Math.min(h, 20);
      const ox = x + w + 8;
      const oy = y + (h - s) / 2;
      return `M${ox} ${oy} L${ox + s + j(1)} ${oy + s} M${ox + s} ${oy + j(1)} L${ox} ${oy + s}`;
    }
    case 'box': {
      const p = 5;
      return smooth([
        [x - p, y - p + j(1)],
        [x + w + p + j(1), y - p],
        [x + w + p, y + h + p + j(1)],
        [x - p + j(1), y + h + p],
        [x - p + 2, y - p - 2],
      ]);
    }
    case 'leader': {
      // From the right of the mark to the left of its note, a loose S of ink.
      if (!to) return '';
      const x0 = x + w + 14;
      const y0 = y + h / 2;
      const x1 = to.x - 8;
      const y1 = to.y + Math.min(to.h, 20) / 2;
      const mx = (x0 + x1) / 2;
      return `M${x0.toFixed(1)} ${y0.toFixed(1)} C${(mx + j(6)).toFixed(1)} ${(y0 + j(4)).toFixed(1)} ${(mx + j(6)).toFixed(1)} ${(y1 + j(4)).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
  }
}

/** The layer every mark of a host is drawn into: one SVG over the host, never catching the pointer. */
export function layer(host: HTMLElement): SVGSVGElement {
  let svg = host.querySelector<SVGSVGElement>(':scope > svg.pen-layer');
  if (!svg) {
    svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'pen-layer');
    svg.setAttribute('aria-hidden', 'true');
    host.appendChild(svg);
  }
  return svg;
}

/** The boxes of an inline target, one per line it wraps onto, in the host's space. */
export function boxesOf(target: Element, host: HTMLElement): Box[] {
  const hr = host.getBoundingClientRect();
  return Array.from(target.getClientRects())
    .filter((r) => r.width > 1)
    .map((r) => ({ x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height }));
}

/** A box covering every line of the target (for a circle or a leader start). */
export function unionOf(boxes: Box[]): Box {
  const x0 = Math.min(...boxes.map((b) => b.x));
  const y0 = Math.min(...boxes.map((b) => b.y));
  const x1 = Math.max(...boxes.map((b) => b.x + b.w));
  const y1 = Math.max(...boxes.map((b) => b.y + b.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export interface DrawOpts {
  animate?: boolean;
  delay?: number;
  heavy?: boolean;
  /** CSS class on the path (pen, glow, graphite). */
  tone?: 'pen' | 'graphite';
  key?: string;
}

let maskSeq = 0;

/** The outline of a tapered stroke along a centre line: thin at both ends, full in the middle, a little heavier
 *  where the pen lands (a nib presses on the down-stroke). Returns a closed path for a fill. */
function taper(centre: SVGPathElement, maxW: number): string {
  const len = centre.getTotalLength();
  if (len < 2) return '';
  const n = Math.max(12, Math.min(90, Math.round(len / 4)));
  const pts: DOMPoint[] = [];
  for (let i = 0; i <= n; i++) pts.push(centre.getPointAtLength((len * i) / n));
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n, i + 1)];
    let nx = -(b.y - a.y);
    let ny = b.x - a.x;
    const m = Math.hypot(nx, ny) || 1;
    nx /= m;
    ny /= m;
    const w = (maxW / 2) * (0.18 + 0.82 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.55)) * (1.08 - 0.16 * t);
    left.push([pts[i].x + nx * w, pts[i].y + ny * w]);
    right.push([pts[i].x - nx * w, pts[i].y - ny * w]);
  }
  const ring = left.concat(right.reverse());
  return ring.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + 'Z';
}

/** Draw one mark into a layer. The pen's strokes are tapered fills (ink, not a CAD line); graphite stays a
 *  thin even line. Animation reveals the fill through a mask whose centre line draws on. Resolves when done. */
export function stroke(svg: SVGSVGElement, d: string, opts: DrawOpts = {}): Promise<SVGElement> {
  const tone = opts.tone ?? 'pen';
  const g = document.createElementNS(SVGNS, 'g');
  g.setAttribute('class', `pen-mark ${tone}${opts.heavy ? ' heavy' : ''}`);
  if (opts.key) g.dataset.key = opts.key;
  svg.appendChild(g);

  const subs = d.split(/(?=M)/).filter((x) => x.trim());
  const centres = subs.map((sd) => {
    const c = document.createElementNS(SVGNS, 'path');
    c.setAttribute('d', sd);
    return c;
  });

  if (tone === 'graphite') {
    for (const c of centres) {
      c.setAttribute('class', 'pen-path graphite');
      g.appendChild(c);
    }
  } else {
    const maxW = opts.heavy ? 5.2 : 3.4;
    // Measure the centre lines inside the layer (getTotalLength needs them in the document).
    for (const c of centres) {
      c.setAttribute('class', 'pen-centre');
      g.appendChild(c);
    }
    const ink = document.createElementNS(SVGNS, 'path');
    ink.setAttribute('class', 'pen-ink');
    ink.setAttribute('d', centres.map((c) => taper(c, maxW)).join(' '));
    for (const c of centres) c.remove();
    g.appendChild(ink);
    if (opts.animate) {
      const id = `pen-mask-${++maskSeq}`;
      const mask = document.createElementNS(SVGNS, 'mask');
      mask.setAttribute('id', id);
      mask.setAttribute('maskUnits', 'userSpaceOnUse');
      mask.setAttribute('x', '-5000');
      mask.setAttribute('y', '-5000');
      mask.setAttribute('width', '20000');
      mask.setAttribute('height', '20000');
      for (const c of centres) {
        c.setAttribute('class', 'pen-reveal');
        c.style.strokeWidth = `${maxW + 6}px`;
        mask.appendChild(c);
      }
      g.appendChild(mask);
      ink.setAttribute('mask', `url(#${id})`);
    }
  }

  if (!opts.animate) return Promise.resolve(g);

  const lines = Array.from(g.querySelectorAll<SVGPathElement>(tone === 'graphite' ? '.pen-path' : '.pen-reveal'));
  const total = lines.reduce((a, l) => a + l.getTotalLength(), 0);
  const dur = Math.max(MOTION.markMin, Math.min(MOTION.markMax, total * 1.5));
  let offset = opts.delay ?? 0;
  const runs = lines.map((l) => {
    const len = l.getTotalLength();
    const share = (dur * len) / (total || 1);
    l.style.strokeDasharray = `${len}`;
    l.style.strokeDashoffset = `${len}`;
    const a = l.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: share,
      delay: offset,
      easing: lines.length > 1 ? 'linear' : MOTION.easePen,
      fill: 'forwards',
    });
    offset += share;
    return a.finished;
  });
  return Promise.all(runs).then(() => {
    const ink = g.querySelector('.pen-ink');
    ink?.removeAttribute('mask');
    g.querySelector('mask')?.remove();
    for (const l of lines) {
      l.getAnimations().forEach((a) => a.cancel());
      l.style.strokeDasharray = '';
      l.style.strokeDashoffset = '';
    }
    return g;
  });
}

/** Draw a mark over a target inside a host. Multi-line targets get one mark per line (a circle gets one loop per line). */
export async function mark(host: HTMLElement, target: Element, kind: MarkKind, opts: DrawOpts = {}): Promise<void> {
  const svg = layer(host);
  const boxes = boxesOf(target, host);
  if (!boxes.length) return;
  const seed = hash((opts.key ?? '') + kind + (target.textContent ?? ''));
  // One mark per line for strike and circle; underline, caret and cross take the last line, a tick the first.
  const list = kind === 'tick' ? [boxes[0]] : kind === 'underline' || kind === 'caret' || kind === 'cross' ? [boxes[boxes.length - 1]] : boxes;
  for (let i = 0; i < list.length; i++) {
    await stroke(svg, markPath(kind, list[i], seed + i), { ...opts, delay: i === 0 ? opts.delay : 0 });
  }
}

/** A verdict lands: the element pops from a little small to its size. */
export function stamp(el: HTMLElement, animate = true, delay = 0): Promise<void> {
  el.classList.add('is-on');
  if (!animate) return Promise.resolve();
  const a = el.animate(
    [
      { opacity: 0, transform: 'scale(.86) rotate(-2deg)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: MOTION.stamp, delay, easing: MOTION.easeStamp, fill: 'backwards' },
  );
  return a.finished.then(() => undefined);
}

export const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
