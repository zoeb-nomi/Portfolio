/* The home "Shipped" panels' scrub (src/components/home/Shipped.astro).
   The markup is already in its final state; with reduced motion this script does nothing. Otherwise each panel is
   put in its start state and replayed as a latched scrub: it plays forward once as the panel scrolls in and never
   reverses. Numbers appear whole (opacity and a 6px rise); the CrossSource figure is an odometer, not a count-up.
   Ambient ticks (the dial hand, the flowing dashes) run only while their panel is on screen. */
import { gsap as G, ScrollTrigger as STg, $, $$, motion, clamp, lerp, sub, revealNumber, expoOut } from './ds';

type Ctl = { render: (t: number) => void; tick?: (dt: number) => void; arm?: () => void };
const q = (s: string, r?: ParentNode) => $<HTMLElement>(s, r) as HTMLElement;
const qa = (s: string, r?: ParentNode) => $$<HTMLElement>(s, r);
const qs = (s: string, r?: ParentNode) => $<SVGElement>(s, r) as SVGElement;
const expoInOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2);
const quartOut = (t: number) => 1 - Math.pow(1 - t, 4);

/* before -> arrow -> after: the shared start/finish of every panel */
function valsCtl(m: HTMLElement) {
  const b = q('.v-before .v-num', m), s = $<HTMLElement>('.v-strike', m), ar = q('.v-arrow', m), av = q('.v-after', m);
  const dim = s ? 0.4 : 0.55;
  return (t: number) => {
    b.style.opacity = lerp(1, dim, sub(t, 0.15, 0.6)).toFixed(3);
    if (s) s.style.setProperty('--k', expoOut(sub(t, 0.05, 0.45)).toFixed(4));
    const ea = expoOut(sub(t, 0.55, 0.8));
    ar.style.transform = `translateX(${lerp(-16, 0, ea).toFixed(1)}px)`;
    ar.style.opacity = lerp(0.25, 1, ea).toFixed(3);
    revealNumber(av, sub(t, 0.68, 0.98));
  };
}

/* odometer: one column per changing digit; each column steps through every digit a real counter passes */
function odoHTML(from: string, to: string) {
  const a = Math.round(parseFloat(from) * 1000), b = Math.round(parseFloat(to) * 1000);
  let h = '<span class="odo" aria-hidden="true">';
  for (let i = 0; i < to.length; i++) {
    const c = to.charAt(i);
    if (c === '.' || from.charAt(i) === c) { h += `<span class="ofix">${c}</span>`; continue; }
    const place = Math.pow(10, to.length - 1 - i), list: number[] = [];
    let last: number | null = null;
    for (let n = a; n <= b; n++) { const d = Math.floor(n / place) % 10; if (d !== last) { list.push(d); last = d; } }
    h += `<span class="oc" data-a="${a}" data-b="${b}" data-p="${place}"><span class="ocs">${list.map((d) => `<span>${d}</span>`).join('')}</span></span>`;
  }
  return h + `</span><span class="sr">${to}</span>`;
}
function setOdo(el: HTMLElement, e: number) {
  qa('.oc', el).forEach((c) => {
    const a = +(c.dataset.a as string), b = +(c.dataset.b as string), P2 = +(c.dataset.p as string), v = lerp(a, b, clamp(e, 0, 1));
    const fl = Math.floor(v + 1e-9);
    let pos = 0, last = Math.floor(a / P2) % 10;
    for (let n = a + 1; n <= fl; n++) { const d = Math.floor(n / P2) % 10; if (d !== last) { pos++; last = d; } }
    if (fl < b) { const nx = Math.floor((fl + 1) / P2) % 10; if (nx !== last) pos += v - fl; }
    if (e >= 1) pos = Math.round(pos);
    q('.ocs', c).style.transform = `translate3d(0,${(-pos * 0.92).toFixed(4)}em,0)`;
  });
}

function instead(m: HTMLElement): Ctl {
  const vals = valsCtl(m), bar = q('.vi-bar', m), band = q('.vi-band', m), one = q('.vi-one', m);
  const svg = qs('.vi-watch', m), hand = qs('.w-hand', m), sweep = qs('.w-sweep', m), range = qs('.w-range', m);
  const [dialMax, bandFrom, finalMin] = (svg.dataset.dial as string).split(' ').map(Number);
  const r2 = +(sweep.getAttribute('r') as string), Cc = 2 * Math.PI * r2, CX = 60, CY = 70;
  const e0 = bandFrom / dialMax, e1 = finalMin / dialMax;
  let eNow = e1, phase = 0;
  return {
    render(t) {
      vals(t);
      const e = expoInOut(sub(t, 0.08, 0.84));
      eNow = lerp(e0, e1, e);
      bar.style.transform = `scaleX(${eNow.toFixed(4)})`;
      band.style.opacity = lerp(1, 0.45, sub(t, 0.12, 0.55)).toFixed(3);
      one.style.opacity = sub(t, 0.5, 0.72).toFixed(3);
      sweep.setAttribute('stroke-dasharray', `${(eNow * Cc).toFixed(2)} ${Cc.toFixed(2)}`);
      range.style.opacity = lerp(1, 0.4, sub(t, 0.12, 0.55)).toFixed(3);
    },
    tick(dt) {
      phase += dt / 1.5;
      if (phase > 1.3) phase = 0;
      hand.setAttribute('transform', `rotate(${(quartOut(clamp(phase, 0, 1)) * eNow * 360).toFixed(2)} ${CX} ${CY})`);
    },
  };
}

function keka(m: HTMLElement): Ctl {
  const vals = valsCtl(m);
  const wires = qa('.s-wire', m) as unknown as SVGElement[], ants = qa('.s-ants', m) as unknown as SVGElement[], heads = qa('.s-head', m) as unknown as SVGElement[];
  const sq = qa('.vk-cl i', m);
  let flow = 0;
  return {
    render(t) {
      vals(t);
      wires.forEach((w, i) => w.setAttribute('stroke-dashoffset', (1 - expoOut(sub(t, i * 0.05, 0.14 + i * 0.05))).toFixed(4)));
      heads.forEach((h, i) => (h.style.opacity = sub(t, 0.1 + i * 0.05, 0.16 + i * 0.05).toFixed(3)));
      ants.forEach((a) => (a.style.opacity = (sub(t, 0.18, 0.26) * 0.9).toFixed(3)));
      sq.forEach((s, k) => {
        const p = expoOut(sub(t, 0.3 + k * 0.011, 0.42 + k * 0.011));
        s.style.opacity = p.toFixed(3);
        s.style.transform = p < 1 ? `translate3d(0,${((1 - p) * -8).toFixed(1)}px,0)` : 'none';
      });
    },
    tick(dt) {
      flow = (flow + dt * 20) % 160;
      ants.forEach((a) => a.setAttribute('stroke-dashoffset', (-flow).toFixed(1)));
    },
  };
}

function crosssource(m: HTMLElement): Ctl {
  const vals = valsCtl(m);
  const av = q('.v-after', m), beforeTxt = (q('.v-before .v-num', m).textContent || '').trim(), afterTxt = (av.textContent || '').trim();
  av.innerHTML = odoHTML(beforeTxt, afterTxt);
  const odo = q('.odo', av);
  const svg = qs('.vc-gauge', m);
  const [CX, CY, R, gMin, gMax] = (svg.dataset.g as string).split(' ').map(Number);
  const vB = parseFloat(beforeTxt), vS = parseFloat(afterTxt);
  const A = (v: number) => 200 + ((v - gMin) / (gMax - gMin)) * 140;
  const P = (a: number, r: number) => [CX + r * Math.cos((a * Math.PI) / 180), CY + r * Math.sin((a * Math.PI) / 180)];
  const needle = qs('.g-needle-g', m), gain = qs('.g-gain', m), c994 = qs('.g-strict', m);
  const units = qa('.vc-u i[data-gone]', m).map((sqr, k) => ({ sq: sqr, st: q('b', sqr), k }));
  let armed = false, played = false, odoE = -1;
  function setE(e: number) {
    if (e === odoE) return;
    odoE = e;
    const a = A(lerp(vB, vS, e));
    setOdo(odo, e);
    needle.setAttribute('transform', `rotate(${(a - 270).toFixed(3)} ${CX} ${CY})`);
    if (e > 0.002) {
      const g1 = P(A(vB), R - 96), g2 = P(a, R - 96);
      gain.setAttribute('d', `M${g1[0].toFixed(1)} ${g1[1].toFixed(1)} A${R - 96} ${R - 96} 0 0 1 ${g2[0].toFixed(1)} ${g2[1].toFixed(1)}`);
    } else gain.setAttribute('d', '');
    c994.style.opacity = sub(e, 0.8, 1).toFixed(3);
  }
  return {
    arm() { armed = true; setE(0); },
    render(t) {
      vals(t);
      av.style.opacity = '1';
      av.style.transform = 'none';
      if (armed && !played && t >= 0.22) {
        played = true;
        const o = { e: 0 };
        G.to(o, { e: 1, duration: 2.2, ease: 'power2.inOut', onUpdate: () => setE(o.e), onComplete: () => setE(1) });
      }
      units.forEach((u) => {
        const p = expoOut(sub(t, 0.42 + u.k * 0.08, 0.62 + u.k * 0.08));
        u.st.style.transform = `rotate(-40deg) scaleX(${p.toFixed(3)})`;
        u.sq.style.opacity = lerp(1, 0.2, sub(t, 0.55 + u.k * 0.08, 0.75 + u.k * 0.08)).toFixed(3);
      });
    },
  };
}

const BUILD: Record<string, (m: HTMLElement) => Ctl> = { instead, keka, crosssource };

function mount() {
  if (!motion()) return; /* the markup is the finished page */
  const panels = qa('.panel').filter((p) => p.querySelector('.viz[data-viz]'));
  if (!panels.length) return;
  G.registerPlugin(STg);
  const ctls = panels.map((p) => BUILD[q('.viz', p).dataset.viz as string](q('.viz', p)));
  const vis = panels.map(() => false);
  panels.forEach((p, i) => {
    let mxp = 0;
    ctls[i].arm?.();
    ctls[i].render(0);
    STg.create({
      trigger: p,
      start: 'top 80%',
      end: 'top 15%',
      onUpdate: (self) => {
        if (self.progress <= mxp) return;
        mxp = self.progress;
        ctls[i].render(mxp);
      },
    });
  });
  const io = new IntersectionObserver((es) => es.forEach((en) => (vis[panels.indexOf(en.target as HTMLElement)] = en.isIntersecting)));
  panels.forEach((p) => io.observe(p));
  G.ticker.add((_t, dtm) => {
    const s = Math.min(dtm, 64) / 1000;
    for (let i = 0; i < ctls.length; i++) if (vis[i] && ctls[i].tick) (ctls[i].tick as (dt: number) => void)(s);
  });
}

mount();
