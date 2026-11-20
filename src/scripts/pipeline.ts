/* The home Pipeline scene (src/components/home/PipelineScene.astro).
   167 real audit outputs flow through five stations on a canvas; a short pinned scroll walks the stations,
   Skip and the rail jump, and a bottom-panel inspector traces one output end to end.
   Rules kept from design/README.md §8: calm fades only, no count-ups, the scene pauses off screen and with the
   tab hidden, Skip is always visible, reduced motion and no-JS show the completed run as a still.
   Every visible string comes from the page's JSON (#pipeline-data, from pipelineHome in src/data/copy.ts). */
import { $, $$, swap, motion, sceneRGB, clamp, lerp, sub } from './ds';
import { gsap as G, ScrollTrigger as STg } from './gsap';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;
const q = (s: string, r?: ParentNode) => $<HTMLElement>(s, r) as HTMLElement;
const qa = (s: string, r?: ParentNode) => $$<HTMLElement>(s, r);
const fill = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));

function mount() {
  const root = q('#pipeline');
  const dataEl = q('#pipeline-data');
  if (!root || !dataEl) return;
  const canvas = $<HTMLCanvasElement>('canvas', root);
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  const D: Any = JSON.parse(dataEl.textContent || '{}');
  const TX = D.scene;
  const TR = D.trace;
  const live = motion();

  /* start at the top (a deep link keeps its hash) */
  if (!location.hash) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  const E = {
    expoOut: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    cubicInOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    cubicOut: (t: number) => 1 - Math.pow(1 - t, 3),
  };
  const sstep = (v: number) => {
    v = clamp(v, 0, 1);
    return v * v * (3 - 2 * v);
  };

  const hero = q('.hero', root);
  const labels = qa('.slabel', root);
  const labelSub = labels.map((l) => q('.sb', l));
  const cards = qa('.card', root);
  const railBtns = qa('.rail button', root);
  const rail = q('.rail', root);
  const tblk: Record<string, Any> = {};
  qa('.tblk', root).forEach((el) => {
    tblk[el.dataset.h as string] = { el, b: q('b', el), x: -1e4, y: -1e4, o: -1 };
  });
  const probe: Any = q('.probe', root);
  const probeB = q('b', probe);
  const probeS: Any = q('.st', probe);
  const hint = q('.hint', root);
  const hudm = q('.hudm', root);
  const scrim = q('.scrim', root);
  const phud = q('.phud', root);
  const hud = {
    run: q('.h-run', root), fl: q('.h-fl', root), ck: q('.h-ck', root), pr: q('.h-pr', root), rj: q('.h-rj', root),
    last: q('.h-last', root), mck: q('.m-ck', root), mrj: q('.m-rj', root),
  } as Record<string, Any>;
  const bkRows: Record<string, Any> = {};
  qa('.bk-row', root).forEach((r) => {
    bkRows[r.dataset.id as string] = { lv: q('.lv', r), n: q('.lvn', r), v: -1 };
  });

  /* colours come from the scene tokens and are re-read on theme change */
  let BG = '', INK = '', RED = '', SBG = '15,14,13', SINK = '243,238,228', SRED = '229,70,58';
  const readColors = () => {
    SBG = sceneRGB('--scene-bg');
    SINK = sceneRGB('--scene-ink');
    SRED = sceneRGB('--scene-red');
    BG = `rgb(${SBG})`;
    INK = `rgb(${SINK})`;
    RED = `rgb(${SRED})`;
  };
  readColors();
  const F11 = "500 11px 'IBM Plex Mono', ui-monospace, Menlo, monospace";
  const DASH = [2, 4], NODASH: number[] = [], AXL = ['0%', '25%', '50%', '75%', '100%'];
  const S = [100, 300, 500, 700, 900], START = 52, TEND = 975, END = 990, CHECK = 700;
  const N: number = D.totals.n, PASSN: number = D.totals.passed;
  const LAB_U = [-30, -88, -78, -60, -30];
  let lowEnd = (navigator.hardwareConcurrency || 8) <= 4, SPAWN = lowEnd ? 0.42 : 0.32;
  const GAP = 4.2;
  const MOBILE = 900; /* the grid's phone/tablet break: below it the scene runs vertical in portrait */

  function mulberry32(a: number) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(167);
  const AUDIT: Any[] = [];
  D.audit.forEach((g: Any) => {
    for (let i = 0; i < g.n; i++) AUDIT.push({ g, fail: i < g.failed });
  });
  for (let i = AUDIT.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1)), tmp = AUDIT[i];
    AUDIT[i] = AUDIT[j];
    AUDIT[j] = tmp;
  }

  const TRAY: Record<string, Any> = { CrossSource: { cols: 3, cap: 3 }, 'mirror-eval': { cols: 13, cap: 65 }, 'screener-eval': { cols: 6, cap: 18 } };
  const TRAY_U = 56, SP = 8, HN = ['CrossSource', 'mirror-eval', 'screener-eval'];
  (function () {
    let tot = 36;
    HN.forEach((h) => (tot += TRAY[h].cols * SP));
    let t0 = CHECK - tot / 2;
    HN.forEach((h) => {
      const b = TRAY[h];
      b.t0 = t0;
      b.w = b.cols * SP;
      b.rows = Math.ceil(b.cap / b.cols);
      t0 += b.w + 18;
    });
  })();
  const STACK = { cols: 9, t0: 900 - 36, u0: 44 };

  /* particle pool: no allocations in the frame loop */
  const FLOW = 0, EJECT = 1, TRAYD = 2, DROP = 3, STACKG = 4, STACKD = 5;
  const FREE: Any[] = [], parts: Any[] = [];
  for (let pi = 0; pi < 320; pi++) {
    FREE.push({ t: 0, pt: 0, u: 0, u0: 0, ph: 0, v: 0, o: null, run: 0, state: 0, m: 1, ox: 0, oy: 0, vx: 0, vy: 0, a: 0, flash: 0, checked: false, k: 0, eu: 0, st: 0, su: 0, sx: -1e4, sy: -1e4, sz: 3, ddx: 0, ddy: 0, hx: new Float32Array(128), hn: 0, hlt: 0, hlast: 0 });
  }
  const FL: Any[] = [];
  for (let fi = 0; fi < 12; fi++) FL.push({ t: 0, u: 0, d: 0, life: 0 });
  let flI = 0;
  const TOK: Any[] = [];
  for (let ti = 0; ti < 7; ti++) TOK.push({ on: false, t0: 0 });
  const STAMP: Any[] = [];
  for (let si0 = 0; si0 < 6; si0++) STAMP.push({ fail: false, t0: -9 });
  let stI = 0;

  /* state */
  let W = 0, H = 0, dpr = 1, vert = false, s0 = 1, gridPat: Any = null;
  let spawnIdx = 0, spawnRun = 1, spawnT = 0, gapT = 0, simOn = false, spin = 1;
  let run = 1, checked = 0, rejected = 0, shipped = 0, runDone = false, doneT = 0, clearing = false, clearT = 0, lastCheckT = 0;
  const rejBy: Record<string, number> = {}, rejById: Record<string, number> = {}, slotBy: Record<string, number> = {};
  const stN = [0, 0, 0, 0, 0], slotGlow = [0, 0, 0, 0, 0];
  let stackN = 0, retrieveK = 0, draftK = 0;
  const resetCounts = () => {
    checked = 0; rejected = 0; shipped = 0; stackN = 0;
    HN.forEach((h) => { rejBy[h] = 0; slotBy[h] = 0; });
    D.audit.forEach((a: Any) => { rejById[a.id] = 0; });
    for (let i = 0; i < 5; i++) stN[i] = 0;
  };
  resetCounts();
  let lastVerdict: Any = null, gatePulse = 0, time = 0, dp = 0, staticMode = false;
  let cx0 = -1e4, cy0 = -1e4, mx = -1e4, my = -1e4, hoverLabel = -1, hover = -1, probeP: Any = null, traced: Any = null, traceBlend = 0;
  const lit = [0, 0, 0, 0, 0], I = { grid: 1, track: 1 }, stP = [{ v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }];
  const cam = { t: 500, u: 10, z: 1, ax: 0.5, ay: 0.6 }, scam = { t: 500, u: 10, z: 1, ax: 0.5, ay: 0.6 }, fcam = { t: 500, u: 0, z: 2.1, ax: 0.56, ay: 0.5 };
  let stTrig: Any = null, introDone = false, cardShown = -1, cardV = 0, cardLift = false, heroA = -1, heroT = 1, railShown: boolean | null = null, actShown = -2, scrimV = -1;
  let lastTextT = 0, frameAvg = 16, frameN = 0, budgetChecked = false;
  let insOpen = false;

  function spawn(t: number) {
    const p = FREE.pop();
    if (!p) return;
    const o = AUDIT[spawnIdx];
    p.t = t; p.pt = t; p.u = 0; p.u0 = (rnd() - 0.5) * 20; p.ph = rnd() * 6.283; p.v = 52 + rnd() * 8; p.o = o; p.run = spawnRun; p.state = FLOW; p.m = 1;
    p.ox = 0; p.oy = 0; p.vx = 0; p.vy = 0; p.a = 0; p.flash = 0; p.checked = false; p.k = 0; p.sx = -1e4; p.sy = -1e4; p.hn = 0; p.hlt = t; p.hlast = 0;
    hpush(p, t, 0);
    parts.push(p);
    if (spawnRun === run) stN[0]++;
    spawnIdx++;
  }
  function kill(idx: number) {
    const p = parts[idx];
    if (p === traced) { traced = null; insHere(-1); }
    if (p === probeP) probeP = null;
    parts[idx] = parts[parts.length - 1];
    parts.pop();
    FREE.push(p);
  }
  function hpush(p: Any, t: number, u: number) {
    const k = (p.hn % 64) * 2;
    p.hx[k] = t; p.hx[k + 1] = u; p.hn++;
  }
  function setTray(p: Any, h: string, k: number) {
    const b = TRAY[h];
    p.st = b.t0 + (k % b.cols) * SP + SP / 2;
    p.su = TRAY_U + Math.floor(k / b.cols) * SP;
  }
  function setStack(p: Any, k: number) {
    p.st = STACK.t0 + (k % STACK.cols) * SP + SP / 2;
    p.su = STACK.u0 + Math.floor(k / STACK.cols) * SP;
  }

  /* scroll segments and camera */
  const P0 = 0.07, PS = 0.176, PE = P0 + 5 * PS, FU = [-16, -26, -22, 32, 26];
  let K: Any[] = [];
  let VOV = { t: 500, u: 8, z: 1, ax: 0.56, ay: 0.63 };
  const overview = () => (vert ? VOV : { t: 500, u: 12, z: 1, ax: 0.5, ay: 0.6 });
  const focus = (i: number) => (vert ? { t: S[i], u: FU[i], z: 1.62, ax: 0.5, ay: 0.3 } : { t: S[i], u: FU[i], z: 1.56, ax: 0.665, ay: 0.48 });
  function keys() {
    const ov = overview(), k: Any[] = [[0, ov], [0.04, ov]];
    for (let i = 0; i < 5; i++) {
      const a = P0 + PS * i;
      k.push([a + 0.035, focus(i)], [a + PS - 0.035, focus(i)]);
    }
    k.push([PE + 0.035, ov], [1, ov]);
    return k;
  }
  function camAt(p: number) {
    for (let k = 0; k < K.length - 1; k++) {
      const a = K[k], b = K[k + 1];
      if (p <= b[0]) {
        const l = b[0] === a[0] ? 1 : sub(p, a[0], b[0]), e = E.cubicInOut(l);
        scam.t = lerp(a[1].t, b[1].t, e); scam.u = lerp(a[1].u, b[1].u, e);
        scam.z = Math.exp(lerp(Math.log(a[1].z), Math.log(b[1].z), e));
        scam.ax = lerp(a[1].ax, b[1].ax, e); scam.ay = lerp(a[1].ay, b[1].ay, e);
        break;
      }
    }
    const tb = E.cubicInOut(traceBlend);
    cam.t = lerp(scam.t, fcam.t, tb); cam.u = lerp(scam.u, fcam.u, tb);
    cam.z = Math.exp(lerp(Math.log(scam.z), Math.log(fcam.z), tb));
    cam.ax = lerp(scam.ax, fcam.ax, tb); cam.ay = lerp(scam.ay, fcam.ay, tb);
  }
  const sc = () => s0 * cam.z;
  const X = (t: number, u: number) => (vert ? cam.ax * W - (u - cam.u) * s0 * cam.z : cam.ax * W + (t - cam.t) * s0 * cam.z);
  const Y = (t: number, u: number) => (vert ? cam.ay * H + (t - cam.t) * s0 * cam.z : cam.ay * H + (u - cam.u) * s0 * cam.z);
  function activeStation() {
    if (!live || staticMode || dp < P0) return -1;
    if (dp >= PE) return 5;
    return Math.min(4, Math.floor((dp - P0) / PS));
  }

  function resize() {
    const r = (canvas as HTMLCanvasElement).getBoundingClientRect();
    W = r.width; H = r.height;
    if (!W || !H) return;
    dpr = Math.min(lowEnd ? 1.5 : W < 720 ? 1.75 : 2, window.devicePixelRatio || 1);
    (canvas as HTMLCanvasElement).width = Math.round(W * dpr);
    (canvas as HTMLCanvasElement).height = Math.round(H * dpr);
    vert = W < MOBILE && H > W * 1.1;
    root.classList.toggle('vert', vert);
    s0 = vert ? (H * 0.56) / 920 : Math.min((W * 0.9) / 920, (H * 0.56) / 230);
    /* phone: fit the vertical track between the hero and the Skip control so they never overlap */
    if (vert) {
      const hr = hero.getBoundingClientRect(), rr = root.getBoundingClientRect();
      const top = Math.max(H * 0.2, hr.bottom - rr.top) + 22, bot = H - 74, av = Math.max(H * 0.34, bot - top);
      s0 = Math.min((H * 0.56) / 920, av / 1000);
      VOV = { t: 500, u: 8, z: 1, ax: 0.56, ay: (top + (500 - 30) * s0) / H };
    }
    K = keys();
    const tile = document.createElement('canvas'), ts = Math.round(120 * dpr);
    tile.width = tile.height = ts;
    const tg = tile.getContext('2d') as CanvasRenderingContext2D;
    tg.fillStyle = `rgba(${SINK},.035)`;
    const lw = Math.max(1, Math.round(dpr));
    if (!lowEnd) for (let qq0 = 24; qq0 < 120; qq0 += 24) { const qq = Math.round(qq0 * dpr); tg.fillRect(qq, 0, lw, ts); tg.fillRect(0, qq, ts, lw); }
    tg.fillStyle = `rgba(${SINK},.06)`; tg.fillRect(0, 0, lw, ts); tg.fillRect(0, 0, ts, lw);
    gridPat = ctx!.createPattern(tile, 'repeat');
    for (let n = 0; n < parts.length; n++) parts[n].sx = -1e4;
  }

  /* simulation */
  function stageOf(p: Any) {
    if (p.state === EJECT || p.state === TRAYD || p.state === DROP) return TX.stage.tray;
    if (p.state === STACKG || p.state === STACKD) return TX.stage.shipped;
    const t = p.t, st = D.stations;
    const i = t < 200 ? 0 : t < 400 ? 1 : t < 600 ? 2 : t < CHECK ? 3 : 4;
    return `${st[i].no} ${st[i].name}`;
  }
  function update(rdt: number) {
    time += rdt;
    if (!simOn) return;
    const dt = rdt * spin, rate = hover >= 0 ? 0.03 : 1;
    let i, n, p;
    if (spawnIdx < N) {
      spawnT += dt * rate;
      while (spawnT >= SPAWN && spawnIdx < N) { spawnT -= SPAWN; spawn(START); }
    } else {
      gapT += dt * rate;
      if (gapT >= GAP) { gapT = 0; spawnIdx = 0; spawnRun++; }
    }
    gatePulse = Math.max(0, gatePulse - rdt * 2.6);
    for (i = 0; i < 5; i++) slotGlow[i] = Math.max(0, slotGlow[i] - rdt * 1.2);
    for (i = 0; i < FL.length; i++) if (FL[i].life > 0) FL[i].life -= rdt;
    for (n = parts.length - 1; n >= 0; n--) {
      p = parts[n];
      const cur = p.run === run && !runDone;
      if (p.state === FLOW) {
        const tm = hover >= 0 && p.t < S[hover] + 26 ? 0.03 : 1;
        p.m += (tm - p.m) * Math.min(1, rdt * 6);
        p.pt = p.t;
        p.t += p.v * p.m * dt;
        let uu = p.u0 + Math.sin(time * 0.5 + p.ph) * 1.2;
        if (p.t > CHECK) uu = lerp(uu, clamp(uu, -7, 7) * 0.9, sstep((p.t - CHECK) / 120));
        if (p.t > 880) uu *= 1 - sstep((p.t - 880) / 80) * 0.85;
        p.u = uu;
        p.a = Math.min(1, p.a + rdt * 2.4);
        for (let s1 = 1; s1 < 5; s1++) {
          if (p.pt < S[s1] && p.t >= S[s1]) {
            if (cur && s1 !== 3) stN[s1]++;
            if (s1 === 1) { const kk = retrieveK++ % 5; slotGlow[kk] = 1; const f = FL[flI++ % FL.length]; f.t = p.t; f.u = p.u; f.d = kk; f.life = 0.6; }
            if (s1 === 2) { const dk = draftK++ % 7; if (dk === 0) for (let z = 0; z < 7; z++) TOK[z].on = false; TOK[dk].on = true; TOK[dk].t0 = time; }
          }
        }
        if (!p.checked && p.pt < CHECK && p.t >= CHECK) {
          p.checked = true; lastCheckT = time;
          if (cur) checked++;
          const h = p.o.g.harness, sp = STAMP[stI++ % STAMP.length];
          sp.t0 = time; sp.fail = p.o.fail;
          if (p.o.fail) {
            gatePulse = 1;
            if (cur && slotBy[h] < TRAY[h].cap) { rejected++; rejBy[h]++; rejById[p.o.g.id]++; setTray(p, h, slotBy[h]++); p.state = EJECT; p.k = 0; p.eu = p.u; }
            else { p.state = DROP; p.k = 0; }
          }
          if (cur) lastVerdict = p.o;
        }
        if (p.t >= END) {
          if (cur && stackN < PASSN) { p.state = STACKG; p.k = 0; setStack(p, stackN++); shipped++; stN[4]++; }
          else { kill(n); continue; }
        }
        if (p.t - p.hlt > 14) { p.hlt = p.t; hpush(p, p.t, p.u); }
      } else if (p.state === EJECT || p.state === STACKG) {
        p.k = Math.min(1, p.k + rdt / (p.state === EJECT ? 1.25 : 1.3));
        const e = E.cubicInOut(p.k), it = 1 - e;
        let c0t, c0u, c1t, c1u;
        if (p.state === EJECT) { c0t = CHECK; c0u = p.eu; c1t = CHECK + (p.st - CHECK) * 0.2 + 6; c1u = p.su + 24; }
        else { c0t = END; c0u = 0; c1t = END + 16; c1u = p.su + 6; }
        p.t = it * it * c0t + 2 * it * e * c1t + e * e * p.st;
        p.u = it * it * c0u + 2 * it * e * c1u + e * e * p.su;
        if (time - p.hlast > 0.06) { p.hlast = time; hpush(p, p.t, p.u); }
        if (p.k >= 1) { p.state = p.state === EJECT ? TRAYD : STACKD; hpush(p, p.t, p.u); }
      } else if (p.state === DROP) {
        p.k += rdt; p.u += rdt * 30; p.a = Math.max(0, 1 - p.k / 0.9);
        if (p.a <= 0) { kill(n); continue; }
      } else if (clearing && (p.state === TRAYD || p.state === STACKD)) {
        p.u += rdt * 40; p.a = Math.max(0, p.a - rdt * 1.6);
      }
      if (p.flash > 0) p.flash = Math.max(0, p.flash - rdt * 2.2);
      if (p.ox !== 0 || p.oy !== 0 || p.vx !== 0 || p.vy !== 0) {
        p.vx += -p.ox * 38 * rdt; p.vy += -p.oy * 38 * rdt;
        p.vx *= Math.max(0, 1 - 7 * rdt); p.vy *= Math.max(0, 1 - 7 * rdt);
        p.ox += p.vx * rdt; p.oy += p.vy * rdt;
        if (Math.abs(p.ox) < 0.01 && Math.abs(p.vx) < 0.01 && Math.abs(p.oy) < 0.01 && Math.abs(p.vy) < 0.01) { p.ox = p.oy = p.vx = p.vy = 0; }
      }
    }
    if (!runDone && checked >= N && (shipped >= PASSN || time - lastCheckT > 14)) { runDone = true; doneT = time; }
    if (staticMode) return;
    if (runDone && !clearing && time - doneT > 3.2) { clearing = true; clearT = time; }
    if (clearing && time - clearT > 1.6) {
      for (n = parts.length - 1; n >= 0; n--) { const qp = parts[n]; if (qp.state === TRAYD || qp.state === STACKD) kill(n); }
      run++; resetCounts(); clearing = false; runDone = false; lastVerdict = null;
    }
  }

  /* drawing: no shadowBlur, no per-frame allocation, fills batched by colour */
  const ts2 = () => 120 * dpr;
  const mv = (t: number, u: number) => ctx!.moveTo(X(t, u), Y(t, u));
  const ln = (t: number, u: number) => ctx!.lineTo(X(t, u), Y(t, u));
  const seg = (t1: number, u1: number, t2: number, u2: number) => { mv(t1, u1); ln(t2, u2); };
  function rectW(t: number, u: number, w: number, h: number, fill0: boolean) {
    const x0 = X(t, u), y0 = Y(t, u), x1 = X(t + w, u + h), y1 = Y(t + w, u + h);
    const x = x0 < x1 ? x0 : x1, y = y0 < y1 ? y0 : y1, ww = Math.abs(x1 - x0), hh = Math.abs(y1 - y0);
    if (fill0) ctx!.fillRect(x, y, ww, hh);
    else ctx!.strokeRect(x + 0.5, y + 0.5, ww, hh);
  }
  function draw() {
    const c = ctx as CanvasRenderingContext2D, s = sc(), act = activeStation();
    let i, n, p, q0;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalAlpha = 1;
    c.fillStyle = BG;
    c.fillRect(0, 0, W, H);
    if (gridPat && I.grid > 0) {
      const off = (((cam.t * s * 0.35) % 120) + 120) % 120;
      c.save(); c.globalAlpha = I.grid; c.setTransform(1, 0, 0, 1, vert ? 0 : -off * dpr, vert ? -off * dpr : 0);
      c.fillStyle = gridPat; c.fillRect(0, 0, (canvas as HTMLCanvasElement).width + ts2(), (canvas as HTMLCanvasElement).height + ts2()); c.restore();
    }
    c.strokeStyle = INK; c.fillStyle = INK;
    /* track + axis */
    const tEnd = lerp(START - 12, TEND, I.track);
    c.globalAlpha = 0.36; c.lineWidth = 1.5; c.beginPath(); seg(START - 12, 0, tEnd, 0); c.stroke(); c.lineWidth = 1;
    c.globalAlpha = 0.22; c.beginPath();
    for (q0 = 0; q0 <= 20; q0++) { const tt = START + ((TEND - START) * q0) / 20; if (tt > tEnd) break; const mj = q0 % 5 === 0; seg(tt, mj ? 16 : 18, tt, mj ? 24 : 21); }
    c.stroke();
    if (s * 46 > 18) {
      c.globalAlpha = 0.55; c.font = F11; c.textAlign = vert ? 'right' : 'center'; c.textBaseline = 'middle';
      for (q0 = 0; q0 <= 4; q0++) { const ta = START + ((TEND - START) * q0) / 4; if (ta > tEnd) break; c.fillText(AXL[q0], X(ta, vert ? 33 : 32), Y(ta, vert ? 33 : 32)); }
    }
    /* emitter */
    c.globalAlpha = 0.5 * stP[0].v; c.beginPath(); c.arc(X(START, 0), Y(START, 0), Math.max(4, 5 * s), 0, 6.283); c.stroke();
    c.lineWidth = 1; c.strokeStyle = INK;
    /* Retrieve: five passage slots with doc_id ticks */
    const ia = stP[1].v;
    for (i = 0; i < 5; i++) {
      const gl = slotGlow[i];
      c.globalAlpha = (0.05 + 0.12 * gl) * ia; rectW(258 + i * 18, -74, 14, 22, true);
      c.globalAlpha = (0.35 + 0.25 * gl) * ia; rectW(258 + i * 18, -74, 14, 22, false);
      c.globalAlpha = (0.25 + 0.3 * gl) * ia; c.beginPath();
      for (let tk = 0; tk < 3; tk++) seg(260 + i * 18, -69 + tk * 5, 260 + i * 18 + (tk === 2 ? 6 : 10), -69 + tk * 5);
      c.stroke();
    }
    for (i = 0; i < FL.length; i++) { const fl = FL[i]; if (fl.life <= 0) continue; c.globalAlpha = Math.min(0.35, fl.life * 0.6); c.beginPath(); seg(fl.t, fl.u, 265 + fl.d * 18, -52); c.stroke(); }
    /* Draft: citation tokens snapping onto the draft line */
    const ia2 = stP[2].v;
    c.globalAlpha = 0.4 * ia2; c.beginPath(); seg(450, -48, 556, -48); c.stroke();
    for (i = 0; i < 7; i++) {
      const tkn = TOK[i]; if (!tkn.on) continue;
      const e = E.cubicOut(clamp((time - tkn.t0) / 0.6, 0, 1)), uu = lerp(-62, -55, e), tx = 452 + i * 15;
      c.globalAlpha = (0.25 + 0.6 * e) * ia2; rectW(tx, uu, 11, 6, true);
      const age = time - tkn.t0;
      if (age < 0.5) { c.globalAlpha = (1 - age / 0.5) * 0.25; c.beginPath(); seg(500, -6, tx + 5.5, uu + 6); c.stroke(); }
    }
    /* stations: corner brackets */
    for (i = 0; i < 5; i++) {
      const ist = stP[i].v; if (ist <= 0) continue;
      const L = lit[i], cx = S[i], h = 19 * (1 + 0.25 * (1 - E.cubicOut(ist))), cc = 6;
      c.strokeStyle = i === 3 ? RED : INK; c.globalAlpha = (i === 3 ? 0.55 + 0.45 * L : 0.45 + 0.5 * L) * ist; c.lineWidth = i === act ? 2 : 1.5;
      c.beginPath();
      seg(cx - h, -h, cx - h + cc, -h); seg(cx - h, -h, cx - h, -h + cc); seg(cx + h, -h, cx + h - cc, -h); seg(cx + h, -h, cx + h, -h + cc);
      seg(cx - h, h, cx - h + cc, h); seg(cx - h, h, cx - h, h - cc); seg(cx + h, h, cx + h - cc, h); seg(cx + h, h, cx + h, h - cc);
      c.stroke();
      if (hover === i) { c.strokeStyle = INK; c.globalAlpha = 0.55; c.setLineDash(DASH); c.beginPath(); c.arc(X(cx, 0), Y(cx, 0), (h + 10) * s, 0, 6.283); c.stroke(); c.setLineDash(NODASH); }
    }
    c.lineWidth = 1;
    /* Check: the red gate, verdict stamps */
    const ia3 = stP[3].v;
    c.strokeStyle = RED; c.globalAlpha = (0.75 + 0.15 * gatePulse) * ia3; c.lineWidth = 2; c.beginPath(); seg(CHECK, -24, CHECK, 24); c.stroke(); c.lineWidth = 1.6;
    let lastSt = 0;
    for (i = 1; i < STAMP.length; i++) if (STAMP[i].t0 > STAMP[lastSt].t0) lastSt = i;
    {
      const stp = STAMP[lastSt], k2 = (time - stp.t0) / 0.9;
      if (!(k2 < 0 || k2 > 1)) {
        const bs = 6 * s, al = (1 - sstep(k2)) * 0.7, bx = X(CHECK, -37), by = Y(CHECK, -37);
        c.strokeStyle = stp.fail ? RED : INK; c.globalAlpha = al; c.strokeRect(bx - bs, by - bs, bs * 2, bs * 2); c.beginPath();
        if (stp.fail) { c.moveTo(bx - bs * 0.5, by - bs * 0.5); c.lineTo(bx + bs * 0.5, by + bs * 0.5); c.moveTo(bx + bs * 0.5, by - bs * 0.5); c.lineTo(bx - bs * 0.5, by + bs * 0.5); }
        else { c.moveTo(bx - bs * 0.55, by); c.lineTo(bx - bs * 0.1, by + bs * 0.45); c.lineTo(bx + bs * 0.6, by - bs * 0.5); }
        c.stroke();
      }
    }
    c.lineWidth = 1;
    /* tray blocks */
    c.strokeStyle = RED; c.setLineDash(DASH); c.globalAlpha = (0.32 + 0.4 * lit[3]) * ia3;
    for (i = 0; i < 3; i++) { const b = TRAY[HN[i]]; rectW(b.t0 - 3, TRAY_U - 7, b.w + 6, b.rows * SP + 6, false); }
    c.setLineDash(NODASH); c.fillStyle = RED; c.globalAlpha = 0.07 * ia3;
    const z = 4.6 * s;
    for (i = 0; i < 3; i++) {
      const b = TRAY[HN[i]];
      for (let k3 = slotBy[HN[i]]; k3 < b.cap; k3++) { const stt = b.t0 + (k3 % b.cols) * SP + SP / 2, suu = TRAY_U + Math.floor(k3 / b.cols) * SP; c.fillRect(X(stt, suu) - z / 2, Y(stt, suu) - z / 2, z, z); }
    }
    c.globalAlpha = 0.25 * ia3; c.beginPath(); seg(CHECK, 24, CHECK, TRAY_U - 8); c.stroke();
    /* Ship: guard rails + shipped stack frame */
    const ia4 = stP[4].v;
    c.strokeStyle = INK; c.globalAlpha = (0.45 + 0.5 * lit[4]) * ia4; c.lineWidth = 1.5; c.beginPath(); seg(790, -10, 960, -10); seg(790, 10, 960, 10); c.stroke(); c.lineWidth = 1;
    c.globalAlpha = 0.22 * ia4; c.setLineDash(DASH); rectW(STACK.t0 - 3, STACK.u0 - 7, STACK.cols * SP + 6, 9 * SP + 6, false);
    c.beginPath(); seg(TEND, 3, STACK.t0 + STACK.cols * SP + 3, STACK.u0 - 7); c.stroke(); c.setLineDash(NODASH);
    /* trace line behind particles: wide faint pass then sharp pass */
    if (traced && traced.hn > 0) {
      for (let pass = 0; pass < 2; pass++) {
        c.strokeStyle = RED; c.globalAlpha = pass ? 0.95 : 0.18; c.lineWidth = pass ? 1.6 : 6; c.beginPath();
        const cnt = Math.min(64, traced.hn), st0 = traced.hn - cnt;
        mv(START, 0);
        for (let hI = 0; hI < cnt; hI++) { const kx = ((st0 + hI) % 64) * 2; ln(traced.hx[kx], traced.hx[kx + 1]); }
        c.lineTo(traced.sx, traced.sy); c.stroke();
      }
      c.lineWidth = 1; c.globalAlpha = 1; c.fillStyle = RED; c.beginPath(); c.arc(X(START, 0), Y(START, 0), 3.5, 0, 6.283); c.fill();
    }
    /* particles: positions first, then batched fills */
    for (n = 0; n < parts.length; n++) {
      p = parts[n];
      const psz = p.state === TRAYD || p.state === STACKD ? 4.6 : 2.6 + 1 * sstep((p.t - 470) / 60);
      const nx = X(p.t, p.u) + p.ox, ny = Y(p.t, p.u) + p.oy;
      p.sx = nx; p.sy = ny; p.sz = Math.max(2, psz * s);
    }
    c.fillStyle = INK; c.globalAlpha = 0.66;
    for (n = 0; n < parts.length; n++) { p = parts[n]; if (p.state === FLOW && !p.checked && p.a >= 1) c.fillRect(p.sx - p.sz / 2, p.sy - p.sz / 2, p.sz, p.sz); }
    c.globalAlpha = 0.98;
    for (n = 0; n < parts.length; n++) { p = parts[n]; if (p.a >= 1 && ((p.state === FLOW && p.checked) || p.state === STACKG || p.state === STACKD)) c.fillRect(p.sx - p.sz / 2, p.sy - p.sz / 2, p.sz, p.sz); }
    c.fillStyle = RED; c.globalAlpha = 1;
    for (n = 0; n < parts.length; n++) { p = parts[n]; if (p.a >= 1 && (p.state === EJECT || p.state === TRAYD || p.state === DROP)) c.fillRect(p.sx - p.sz / 2, p.sy - p.sz / 2, p.sz, p.sz); }
    for (n = 0; n < parts.length; n++) {
      p = parts[n]; if (p.a >= 1 || p.a <= 0) continue;
      const red = p.state === EJECT || p.state === TRAYD || p.state === DROP;
      c.fillStyle = red ? RED : INK; c.globalAlpha = red ? p.a : (p.checked ? 0.98 : 0.66) * p.a; c.fillRect(p.sx - p.sz / 2, p.sy - p.sz / 2, p.sz, p.sz);
    }
    c.strokeStyle = INK;
    /* traced marker */
    if (traced) { const rb = Math.max(9, 6 * s); c.strokeStyle = RED; c.globalAlpha = 1; c.lineWidth = 1.5; c.strokeRect(traced.sx - rb, traced.sy - rb, rb * 2, rb * 2); c.lineWidth = 1; }
    /* hover ring on the snap candidate */
    if (probeP && probeP !== traced) { const r3 = Math.max(11, 6.5 * s); c.strokeStyle = INK; c.globalAlpha = 0.85; c.lineWidth = 1.25; c.beginPath(); c.arc(probeP.sx, probeP.sy, r3, 0, 6.283); c.stroke(); c.lineWidth = 1; }
    c.globalAlpha = 1;
  }

  /* overlays: transforms only when moved; text at most 10 times a second and only when changed */
  const LX = [-1e4, -1e4, -1e4, -1e4, -1e4], LY = [-1e4, -1e4, -1e4, -1e4, -1e4], LO = [-1, -1, -1, -1, -1], LON: Any[] = [null, null, null, null, null];
  function placeOverlays(force: boolean) {
    const a = activeStation();
    let i;
    for (i = 0; i < 5; i++) {
      const u = vert ? Math.min(LAB_U[i], -36) : LAB_U[i], x = Math.round((X(S[i], u) + (vert ? 6 : 0)) * 2) / 2, y = Math.round(Y(S[i], u) * 2) / 2;
      if (x !== LX[i] || y !== LY[i]) { LX[i] = x; LY[i] = y; labels[i].style.transform = `translate3d(${x}px,${y}px,0)`; }
      const o = Math.round(stP[i].v * 100) / 100;
      if (o !== LO[i]) { LO[i] = o; labels[i].style.opacity = String(o); }
      const on = i === a || i === hover;
      if (on !== LON[i]) { LON[i] = on; labels[i].classList.toggle('on', on); }
    }
    // Vertical (phone) layout: every tray label hangs off the deepest tray, so the three share one left edge.
    const maxRows = Math.max(TRAY[HN[0]].rows, TRAY[HN[1]].rows, TRAY[HN[2]].rows);
    for (i = 0; i < 3; i++) {
      const hn = HN[i], b = TRAY[hn], tb = tblk[hn];
      let tx, ty;
      if (vert) { tx = X(0, TRAY_U + maxRows * SP + 2); ty = Y(b.t0 + b.w / 2, 0); }
      else { tx = X(b.t0 + b.w / 2, 0); ty = Y(0, TRAY_U + 5 * SP + 2); }
      tx = Math.round(tx * 2) / 2; ty = Math.round(ty * 2) / 2;
      if (tx !== tb.x || ty !== tb.y) { tb.x = tx; tb.y = ty; tb.el.style.transform = `translate3d(${tx}px,${ty}px,0)`; }
      const to = Math.round(stP[3].v * 100) / 100;
      if (force || to !== tb.o) { tb.o = to; tb.el.style.opacity = String(to); }
    }
    if (staticMode) return;
    if (probeP && probeP !== traced) {
      let px = probeP.sx + 16, py = probeP.sy + 14;
      if (px > W - 240) px = probeP.sx - 240;
      if (py > H - 120) py = probeP.sy - 60;
      probe.style.transform = `translate3d(${Math.round(px)}px,${Math.round(py)}px,0)`;
      if (probe._p !== probeP) { probe._p = probeP; texts(true); }
      if (!probe._on) { probe._on = 1; probe.classList.add('on'); }
    } else if (probe._on) { probe._on = 0; probe._p = null; probe.classList.remove('on'); }
  }
  const setT = (el: Any, v: string) => { if (el._t !== v) { el._t = v; el.textContent = v; } };
  function texts(now: boolean) {
    if (!now && time - lastTextT < 0.1) return;
    lastTextT = time;
    let i;
    const sb = TX.sub;
    setT(labelSub[0], fill(sb.prompt, { n: stN[0] }));
    setT(labelSub[1], fill(sb.retrieve, { n: stN[1] }));
    setT(labelSub[2], fill(sb.draft, { n: stN[2] }));
    setT(labelSub[3], fill(sb.check, { p: checked - rejected, r: rejected }));
    setT(labelSub[4], fill(sb.ship, { n: shipped }));
    for (i = 0; i < 3; i++) swap(tblk[HN[i]].b, rejBy[HN[i]]);
    if (staticMode) return;
    let fl = 0;
    for (i = 0; i < parts.length; i++) if (parts[i].state === FLOW) fl++;
    swap(hud.run, run); swap(hud.fl, fl); swap(hud.ck, checked); swap(hud.rj, rejected);
    swap(hud.pr, checked >= 5 ? (((checked - rejected) / checked) * 100).toFixed(1) + '%' : TX.na);
    swap(hud.mck, checked); swap(hud.mrj, rejected);
    const mark = (o: Any) => (o.fail ? TX.fail : TX.pass) + ' ';
    const lv = runDone
      ? fill(TX.runDone, { run, f: D.totals.failed, n: D.totals.n })
      : lastVerdict ? mark(lastVerdict) + lastVerdict.g.short + ' · ' + (lastVerdict.fail ? lastVerdict.g.fail : lastVerdict.g.pass) : TX.waiting;
    if ((hud.last as Any)._t !== lv) { (hud.last as Any)._t = lv; hud.last.textContent = lv; hud.last.classList.toggle('x', !!(lastVerdict && lastVerdict.fail && !runDone)); }
    D.audit.forEach((g: Any) => {
      const r = bkRows[g.id]; if (!r) return;
      const v = rejById[g.id] || 0;
      if (r.v !== v) { r.v = v; r.n.textContent = v; r.lv.style.transform = `scaleX(${(v / g.n).toFixed(4)})`; }
    });
    if (probe._p) {
      const o = probe._p.o;
      let st, x2 = '';
      if (probe._p.state === FLOW && !probe._p.checked) st = fill(TX.stage.awaiting, { stage: stageOf(probe._p) });
      else if (o.fail) { st = TX.fail + ' ' + o.g.fail; x2 = 'x'; }
      else st = TX.pass + ' ' + o.g.pass;
      setT(probeB, o.g.short); setT(probeS, st);
      if (probeS._x !== x2) { probeS._x = x2; probeS.className = 'st ' + x2; }
    }
    if (traced) insHere(insStage(traced));
  }
  function pickProbe() {
    probeP = null;
    if (mx < -9000 || hover >= 0 || insOpen) return;
    let best = 28 * 28;
    for (let n = 0; n < parts.length; n++) { const p = parts[n]; if (p.a < 0.3) continue; const dx = p.sx - mx, dy = p.sy - my, d = dx * dx + dy * dy; if (d < best) { best = d; probeP = p; } }
  }
  function pickAt(x: number, y: number, r: number) {
    let best = r * r, bp: Any = null;
    for (let n = 0; n < parts.length; n++) { const p = parts[n]; if (p.a < 0.3) continue; const dx = p.sx - x, dy = p.sy - y, d = dx * dx + dy * dy; if (d < best) { best = d; bp = p; } }
    return bp;
  }

  /* trace inspector: the whole path at once; arrows step, Esc or the close button ends it, page scroll is held while open */
  let hintUsed = false;
  try { hintUsed = localStorage.getItem('pipe-traced') === '1'; } catch { /* storage blocked */ }
  if (hintUsed) hint.classList.add('gone');
  const ins = q('.ins');
  const insH = q('.ins-h', ins), insM = q('.ins-m', ins), insPath = q('.ins-path', ins), insD = q('.ins-d', ins);
  let insO: Any = null, insSel = 3, insLi: HTMLElement[] = [], insNow = -2;
  function insStage(p: Any) {
    if (p.state === EJECT || p.state === TRAYD || p.state === DROP) return 3;
    if (p.state === STACKG || p.state === STACKD) return 4;
    const t = p.t;
    return t < 200 ? 0 : t < 400 ? 1 : t < 600 ? 2 : t < CHECK ? 3 : 4;
  }
  function insDetail(i: number) {
    const o = insO, g = o.g, st = D.stations[i], h = `<b>${st.no} ${st.name}.</b> `;
    if (i < 3) return h + st.title + ' <span class="lab">' + fill(TR.card, { s: st.readouts[0].s }) + '</span>';
    if (i === 3) return h + (o.fail ? fill(TR.caught, { x: g.fail }) : fill(TR.passedLine, { x: g.pass })) + ' ' + fill(TR.checkedBy, { short: g.short, f: g.failed, n: g.n });
    return h + (o.fail ? fill(TR.held, { h: g.harness }) : fill(TR.shipped, { p: D.totals.passed, n: D.totals.n }));
  }
  function insSet(i: number) {
    insSel = clamp(i, 0, 4);
    insLi.forEach((li, k) => { li.classList.toggle('sel', k === insSel); (li.querySelector('button') as HTMLElement).setAttribute('aria-current', k === insSel ? 'step' : 'false'); });
    insD.innerHTML = insDetail(insSel);
  }
  function insHere(k: number) {
    if (k === insNow) return;
    insNow = k;
    insLi.forEach((li, j) => li.classList.toggle('here', j === k));
  }
  const HOLD: Record<string, number> = { ' ': 1, PageUp: 1, PageDown: 1, ArrowUp: 1, ArrowDown: 1, Home: 1, End: 1, Spacebar: 1 };
  function insKey(e: KeyboardEvent) {
    if (!insOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); release(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); insSet(insSel + 1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); insSet(insSel - 1); return; }
    const onCtl = e.target && (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('button,a');
    if (HOLD[e.key] && !((e.key === ' ' || e.key === 'Spacebar') && onCtl)) e.preventDefault();
  }
  const holdScroll = (e: Event) => { if (insOpen) e.preventDefault(); };
  function openIns(p: Any) {
    insO = p.o;
    const g = insO.g, f = insO.fail, S0 = TR.steps;
    insH.textContent = g.short;
    insM.textContent = fill(TR.meta, { n: g.n, f: g.failed });
    insPath.innerHTML = D.stations.map((st: Any, i: number) => {
      const sv = i < 3 ? S0.passed : i === 3 ? (f ? S0.caught : S0.ok) : f ? S0.held : S0.shipped;
      const cl = (i === 3 && f ? 'x' : '') + (i === 4 && f ? ' off' : '');
      return `<li class="${cl}"><button type="button" data-i="${i}"><span class="sn">${st.no} ${st.name}<i class="now" aria-hidden="true"></i></span><span class="sv">${sv}</span></button></li>`;
    }).join('');
    insLi = qa('li', insPath);
    insLi.forEach((li, i) => (li.querySelector('button') as HTMLElement).addEventListener('click', () => insSet(i)));
    insNow = -2; insHere(insStage(p)); insSet(3);
    if (!insOpen) {
      insOpen = true;
      ins.classList.add('open'); ins.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('ins-open');
      window.addEventListener('wheel', holdScroll, { passive: false });
      window.addEventListener('touchmove', holdScroll, { passive: false });
    }
    try { q('.ins-x', ins).focus({ preventScroll: true }); } catch { /* no focus */ }
  }
  function closeIns() {
    if (!insOpen) return;
    insOpen = false; insO = null;
    ins.classList.remove('open'); ins.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('ins-open');
    window.removeEventListener('wheel', holdScroll);
    window.removeEventListener('touchmove', holdScroll);
  }
  function startTrace(p: Any) {
    if (!p) return;
    traced = p; fcam.t = p.t; fcam.u = p.u; openIns(p); texts(true);
    if (!hintUsed) { hintUsed = true; hint.classList.add('gone'); try { localStorage.setItem('pipe-traced', '1'); } catch { /* storage blocked */ } }
  }
  function release() { traced = null; closeIns(); }
  q('.ins-x', ins).addEventListener('click', release);

  function followTarget(rdt: number) {
    if (!traced) { traceBlend = Math.max(0, traceBlend - rdt * 1.6); return; }
    traceBlend = Math.min(1, traceBlend + rdt * 1.4);
    const p = traced, tt = p.t + (p.state === FLOW ? 14 : 0), tu = p.state === FLOW ? p.u * 0.5 : p.u, k = Math.min(1, rdt * 4);
    fcam.t += (tt - fcam.t) * k; fcam.u += (tu - fcam.u) * k; fcam.z = vert ? 1.9 : 2.1; fcam.ax = vert ? 0.5 : 0.56; fcam.ay = vert ? 0.42 : 0.5;
  }

  /* state derived from scroll every frame (idempotent): station, card, rail, hero */
  function syncState(rdt: number) {
    const a = activeStation();
    if (a !== actShown) { actShown = a; railBtns.forEach((b, i) => { b.classList.toggle('on', i === a); b.classList.toggle('done', a >= 0 && a <= 4 && i < a); }); }
    const showRail = introDone && !traced && a <= 4 && (a >= 0 || W >= MOBILE);
    if (showRail !== railShown) { railShown = showRail; rail.classList.toggle('show', showRail); hudm.classList.toggle('show', showRail); }
    /* card first: one at a time. The shown card exits fully before the wanted one enters. */
    const want = !introDone || traced ? -1 : a >= 0 && a <= 4 ? (hover >= 0 ? hover : a) : -1;
    if (cardShown !== want) {
      if (cardShown >= 0 && cardV > 0) cardV = Math.max(0, cardV - rdt / (a < 0 ? 0.14 : 0.22));
      if (cardShown < 0 || cardV <= 0) {
        if (cardShown >= 0) { cards[cardShown].classList.remove('vis', 'lift'); cards[cardShown].style.setProperty('--p', '0'); }
        cardShown = want; cardV = 0; cardLift = false;
        if (want >= 0) { cards[want].scrollTop = 0; cards[want].classList.add('vis'); }
      }
    } else if (cardShown >= 0 && cardV < 1 && heroT < 0.02) {
      cardV = cardV + (1 - cardV) * Math.min(1, rdt * 9);
      if (cardV > 0.996) cardV = 1;
    } /* a card enters only once the hero is gone */
    if (cardShown >= 0) {
      const c: Any = cards[cardShown];
      if (c._v !== cardV) { c._v = cardV; c.style.setProperty('--p', cardV.toFixed(3)); }
      const lf = hover === cardShown && hover >= 0;
      if (lf !== cardLift) { cardLift = lf; c.classList.toggle('lift', lf); }
    }
    /* hero second: fades with scroll and while tracing, and waits for any card to clear. A CSS var on the container, which GSAP never touches. */
    let ha = dp < 0.02 ? 1 : dp < P0 ? 1 - (dp - 0.02) / (P0 - 0.02) : 0;
    ha = Math.min(ha, 1 - E.cubicInOut(traceBlend));
    if (cardShown >= 0 && cardV > 0) ha = 0;
    heroT += (ha - heroT) * Math.min(1, rdt * 12);
    if (Math.abs(ha - heroT) < 0.004) heroT = ha;
    ha = Math.round(heroT * 200) / 200;
    if (ha !== heroA) { heroA = ha; hero.style.setProperty('--ha', String(ha)); hero.classList.toggle('off', ha < 0.02); }
    const sv = cardShown >= 0 ? Math.round(cardV * 100) / 100 : 0;
    if (sv !== scrimV) { scrimV = sv; scrim.style.opacity = String(sv); }
  }

  /* loop: paused off screen and when the tab is hidden */
  let raf = 0, last = 0, visible = true;
  function frame(now: number) {
    raf = 0;
    const rdt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    if (introDone && !budgetChecked && rdt > 0) {
      frameAvg = frameAvg * 0.95 + rdt * 1000 * 0.05;
      if (++frameN > 180) { budgetChecked = true; if (frameAvg > 24 && !lowEnd) { lowEnd = true; SPAWN = 0.42; resize(); } }
    }
    const target = stTrig ? stTrig.progress : 0;
    dp += (target - dp) * Math.min(1, rdt * 10);
    if (Math.abs(target - dp) < 0.0003) dp = target;
    if (!introDone && target > 0.03) skipIntro(); /* any scroll into the stations ends the intro */
    followTarget(rdt); camAt(dp);
    const canvasTop = stTrig && window.scrollY > stTrig.end ? stTrig.end - window.scrollY : 0;
    if (cx0 > -9000) { mx = cx0; my = cy0 - canvasTop; } else { mx = -1e4; my = -1e4; }
    const a = activeStation();
    let prox = -1;
    if (mx > -9000 && !traced) {
      let best = 40;
      for (let i = 0; i < 5; i++) { const dx = X(S[i], 0) - mx, dy = Y(S[i], 0) - my, d = Math.sqrt(dx * dx + dy * dy); if (d < best) { best = d; prox = i; } }
    }
    hover = hoverLabel >= 0 ? hoverLabel : prox;
    for (let k = 0; k < 5; k++) { const tg = a === -1 ? 0.45 : a === 5 ? 1 : k === a ? 1 : k < a ? 0.65 : 0.3; lit[k] += (tg - lit[k]) * Math.min(1, rdt * 5); }
    update(rdt); draw(); pickProbe(); placeOverlays(false); texts(false); syncState(rdt);
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }

  window.addEventListener('ds:theme', () => {
    readColors(); resize();
    if (staticMode) { camAt(0); draw(); placeOverlays(true); }
  });

  /* ---------- static: reduced motion shows the completed run as a still ---------- */
  if (!live) {
    staticMode = true;
    root.classList.add('is-static');
    resize(); camAt(0); simOn = true;
    let guard = 0;
    while (guard < 20000 && !(checked >= N && shipped >= PASSN)) { update(1 / 30); guard++; }
    for (let i2 = 0; i2 < 5; i2++) lit[i2] = 1;
    hover = -1; draw(); placeOverlays(true); texts(true);
    let rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { resize(); camAt(0); draw(); placeOverlays(true); }, 150); });
    return;
  }

  /* =================================================================
     LIVE WIRING (native scroll, ScrollTrigger only)
     ================================================================= */
  G.registerPlugin(STg);
  root.classList.add('is-live');
  document.documentElement.classList.add('pipe-live');
  resize(); camAt(0);

  stTrig = STg.create({ trigger: root, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 2.3), pin: true, anticipatePin: 1, invalidateOnRefresh: true });
  const scrollToY = (y: number) => window.scrollTo({ top: y, behavior: 'smooth' });
  const scrollToStation = (i: number) => scrollToY(stTrig.start + (P0 + PS * i + PS / 2) * (stTrig.end - stTrig.start));
  railBtns.forEach((b) => b.addEventListener('click', () => { if (traced) release(); scrollToStation(+(b.dataset.i as string)); }));
  const skipB = q('.skipb', root);
  skipB.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation(); /* the page-wide anchor handler would start a second, smooth scroll */
    if (traced) release();
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 60, t = q('#shipped');
    const go = () => window.scrollTo({ top: Math.max(stTrig ? stTrig.end + 2 : 0, t.getBoundingClientRect().top + window.scrollY - hh), behavior: 'auto' });
    go();
    /* an early click can land before fonts settle and the pin is re-measured: aim again after the next refresh */
    const again = () => { STg.removeEventListener('refresh', again); requestAnimationFrame(go); };
    STg.addEventListener('refresh', again);
    setTimeout(() => STg.removeEventListener('refresh', again), 4000);
    const k = $('#h-shipped');
    if (k) { k.setAttribute('tabindex', '-1'); try { k.focus({ preventScroll: true }); } catch { /* no focus */ } }
  });
  labels.forEach((b) => {
    const i = +(b.dataset.i as string);
    b.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') hoverLabel = i; });
    b.addEventListener('pointerleave', () => { if (hoverLabel === i) hoverLabel = -1; });
    b.addEventListener('focus', () => (hoverLabel = i));
    b.addEventListener('blur', () => { if (hoverLabel === i) hoverLabel = -1; });
    b.addEventListener('click', () => { if (traced) release(); scrollToStation(i); });
  });

  /* pointer: mouse only for the probe; touch scrolls freely and taps to trace */
  const BLOCK = '.card,.hero a,.rail,.phud,.site,.hint,.slabel,.skipb,.ins';
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') { cx0 = -1e4; return; }
    if ((e.target as HTMLElement).closest && (e.target as HTMLElement).closest(BLOCK)) { cx0 = -1e4; return; }
    cx0 = e.clientX; cy0 = e.clientY;
  }, { passive: true });
  canvas.addEventListener('pointerleave', () => (cx0 = -1e4));
  document.documentElement.addEventListener('mouseleave', () => (cx0 = -1e4));
  window.addEventListener('blur', () => (cx0 = -1e4));
  const canvasXY = (e: MouseEvent) => [e.clientX, e.clientY - (stTrig && window.scrollY > stTrig.end ? stTrig.end - window.scrollY : 0)];
  function tryTrace(e: MouseEvent, rad: number) {
    const xy = canvasXY(e), p = probeP && probeP !== traced ? probeP : pickAt(xy[0], xy[1], rad);
    if (p && p !== traced) startTrace(p);
    else if (!p && traced) release();
  }
  canvas.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && e.button === 0) tryTrace(e, 28); });
  canvas.addEventListener('click', (e) => { const pe = e as PointerEvent; if (pe.pointerType && pe.pointerType !== 'mouse') tryTrace(e, 32); });
  hint.addEventListener('click', () => {
    let best: Any = null;
    for (let n = 0; n < parts.length; n++) { const p = parts[n]; if (p.state === FLOW && p.t < 260 && (!best || p.t > best.t)) best = p; }
    startTrace(best || parts[parts.length - 1]);
  });
  window.addEventListener('keydown', insKey);

  /* resize and refresh: debounced */
  let rzT = 0;
  if ('ResizeObserver' in window) new ResizeObserver(() => resize()).observe(canvas);
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = window.setTimeout(() => STg.refresh(), 180); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { resize(); STg.refresh(); });
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) start(); }, { threshold: 0 }).observe(root);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });

  /* load sequence (hero readable in about 0.6 s; the scene keeps drawing behind it; skippable): track draws, stations snap in, first emission and headline, HUD last */
  I.grid = 0; I.track = 0; stP.forEach((o) => (o.v = 0));
  const hd = [q('#h1', hero), q('.hsub', hero)], ul = q('.ul', hero), idl = q('.id', hero), ctas = q('.ctas', hero);
  G.set(hd, { autoAlpha: 0, y: 10 }); G.set(ul, { scaleX: 0 }); G.set([idl, ctas], { autoAlpha: 0, y: 8 }); G.set(skipB, { autoAlpha: 0 });
  phud.style.setProperty('--hy', '100%'); G.set(hint, { autoAlpha: 0 });
  function emit() {
    if (simOn) return;
    simOn = true; spin = 2.5; spawn(START);
    const sp = { v: 2.5 };
    G.to(sp, { v: 1, duration: 3.2, ease: 'power2.out', onUpdate: () => { spin = sp.v; } });
  }
  const hy = { v: 100 };
  const intro = G.timeline({ delay: 0, onComplete: () => { introDone = true; } });
  intro.to(I, { grid: 1, duration: 1.2, ease: 'power2.out' }, 0).to(I, { track: 1, duration: 1.2, ease: 'power2.inOut' }, 0.1);
  for (let s3 = 0; s3 < 5; s3++) intro.to(stP[s3], { v: 1, duration: 0.8, ease: 'power2.out' }, 0.45 + s3 * 0.14);
  intro.call(emit, undefined, 1.25)
    .to(idl, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.05)
    .to(hd, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 }, 0.08)
    .to(ul, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 0.55)
    .to([ctas, skipB], { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.35)
    .to(hy, { v: 0, duration: 1, ease: 'power2.out', onUpdate: () => phud.style.setProperty('--hy', hy.v.toFixed(2) + '%') }, 2.05);
  if (!hintUsed) intro.to(hint, { autoAlpha: 1, duration: 0.6 }, 2.3);
  const SKIP_EVENTS = ['wheel', 'keydown', 'pointerdown', 'touchstart'];
  function skipIntro() {
    if (intro.progress() < 1) { intro.progress(1, false); introDone = true; }
    SKIP_EVENTS.forEach((ev) => window.removeEventListener(ev, skipIntro));
  }
  SKIP_EVENTS.forEach((ev) => window.addEventListener(ev, skipIntro, { passive: true }));
  start();
}

mount();
