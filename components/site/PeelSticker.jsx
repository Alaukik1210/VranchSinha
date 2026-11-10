"use client";

import { useEffect, useId, useRef } from "react";

/**
 * A vinyl sticker you can peel off and stick somewhere else.
 *
 * At rest it lies flat with no hint. Press: the edge under the finger peels
 * back (a fold line sweeps in from that side; the flap is the sticker's
 * silhouette reflected across the fold, shaded like the paper backing) and
 * the sticker lifts. Drag: it travels with the pointer, tilting with the
 * motion. Release: the flap smooths back down and the sticker presses on with
 * a small squash.
 *
 * Geometry is in a unit space (radius ≈ 1); the SVG is redrawn by attribute
 * updates inside one rAF loop that sleeps when everything has settled.
 */

function poly(n, outer, inner, rot = 0) {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? inner : outer;
    d += `${i ? "L" : "M"}${(Math.cos(a) * r).toFixed(4)},${(Math.sin(a) * r).toFixed(4)}`;
  }
  return d + "Z";
}
// Scalloped edge: n bumps around a circle.
function scallop(n, r, bump) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const p0 = [Math.cos(a0) * r, Math.sin(a0) * r];
    const p1 = [Math.cos(a1) * r, Math.sin(a1) * r];
    d += `${i ? "" : `M${p0[0].toFixed(4)},${p0[1].toFixed(4)}`}A${bump},${bump} 0 0,1 ${p1[0].toFixed(4)},${p1[1].toFixed(4)}`;
  }
  return d + "Z";
}
const CIRCLE = "M-1,0a1,1 0 1,0 2,0a1,1 0 1,0 -2,0Z";
const DIAMOND = "M0,-1.02Q0.1,-1.02 0.18,-0.94L0.94,-0.18Q1.02,-0.1 1.02,0Q1.02,0.1 0.94,0.18L0.18,0.94Q0.1,1.02 0,1.02Q-0.1,1.02 -0.18,0.94L-0.94,0.18Q-1.02,0.1 -1.02,0Q-1.02,-0.1 -0.94,-0.18L-0.18,-0.94Q-0.1,-1.02 0,-1.02Z";
const STAR8 =
  "M0,-0.78 L0.09,-0.22 L0.42,-0.42 L0.22,-0.09 L0.78,0 L0.22,0.09 L0.42,0.42 L0.09,0.22 L0,0.78 L-0.09,0.22 L-0.42,0.42 L-0.22,0.09 L-0.78,0 L-0.22,-0.09 L-0.42,-0.42 L-0.09,-0.22Z";
const INK = "#0a0a0a";

export const STICKERS = {
  smiley: {
    color: "#FFC81F",
    shape: poly(18, 1, 0.84),
    glyph: (
      <g fill="none" stroke={INK} strokeWidth="0.055" strokeLinecap="round">
        <circle r="0.58" />
        <ellipse cx="-0.2" cy="-0.16" rx="0.07" ry="0.13" fill={INK} stroke="none" />
        <ellipse cx="0.2" cy="-0.16" rx="0.07" ry="0.13" fill={INK} stroke="none" />
        <path d="M-0.34,0.1 Q0,0.48 0.34,0.1" />
      </g>
    ),
  },
  globe: {
    color: "#B83DF0",
    shape: poly(16, 1, 0.86, Math.PI / 16),
    glyph: (
      <g fill="none" stroke={INK} strokeWidth="0.045">
        <ellipse rx="0.64" ry="0.42" />
        <ellipse rx="0.32" ry="0.42" />
        <path d="M0,-0.42V0.42M-0.64,0H0.64M-0.56,-0.2H0.56M-0.56,0.2H0.56" />
      </g>
    ),
  },
  pinwheel: {
    color: "#2F6BFF",
    shape: poly(18, 1, 0.82),
    // Four half-discs, each on a half-axis from the centre, bulging the same way round.
    glyph: (
      <g fill={INK}>
        {[0, 90, 180, 270].map((r) => (
          <path key={r} transform={`rotate(${r})`} d="M0,0 L0,-0.6 A0.3,0.3 0 0,1 0,0 Z" />
        ))}
      </g>
    ),
  },
  star: {
    color: "#1FCB6A",
    shape: CIRCLE,
    glyph: <path fill={INK} d={STAR8} />,
  },
  rays: {
    color: "#FF7A1A",
    shape: CIRCLE,
    glyph: (
      <g stroke={INK} strokeWidth="0.03" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} transform={`rotate(${i * 15})`} d="M0,-0.72V0.72" />
        ))}
      </g>
    ),
  },
  blob: {
    color: "#F5338F",
    shape: scallop(9, 0.72, 0.27),
    glyph: <circle r="0.3" fill={INK} />,
  },
  cross: {
    color: "#F2362B",
    shape: CIRCLE,
    glyph: (
      <g stroke={INK} strokeWidth="0.3" strokeLinecap="round">
        <path d="M-0.4,-0.4L0.4,0.4M0.4,-0.4L-0.4,0.4" />
      </g>
    ),
  },
};

// Spring step (underdamped settings give the press-on squash).
function spring(s, target, dt, k, c) {
  const a = k * (target - s.v) - c * s.vel;
  s.vel += a * dt;
  s.v += s.vel * dt;
}

let topZ = 30;

export default function PeelSticker({ kind, className = "", style, rotate = 0 }) {
  const id = useId().replace(/:/g, "");
  const def = STICKERS[kind];
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const frontClip = useRef(null);
  const flap = useRef(null);
  const backGrad = useRef(null);
  const foldShade = useRef(null);
  const foldGrad = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const st = {
      fold: { v: 0, vel: 0 },
      lift: { v: 0, vel: 0 },
      tilt: { v: 0, vel: 0 },
      dir: { x: 0.7, y: 0.7 },
      foldT: 0,
      liftT: 0,
      tiltT: 0,
      x: 0,
      y: 0,
      drag: null,
      raf: 0,
      last: 0,
    };

    const draw = () => {
      const { x: dx, y: dy } = st.dir;
      const f = Math.max(0, st.fold.v);
      const k = 1.12 - f; // fold line: dot(p, dir) = k. Rests past the widest shape (the scallop reaches 1.09).
      const px = -dy;
      const py = dx;
      const P = (a, b) => `${(dx * a + px * b).toFixed(4)},${(dy * a + py * b).toFixed(4)}`;
      frontClip.current.setAttribute("points", [P(k, 4), P(k, -4), P(k - 6, -4), P(k - 6, 4)].join(" "));
      // Reflection across the fold line.
      const m = [1 - 2 * dx * dx, -2 * dx * dy, -2 * dx * dy, 1 - 2 * dy * dy, 2 * k * dx, 2 * k * dy];
      flap.current.setAttribute("transform", `matrix(${m.map((v) => v.toFixed(5)).join(" ")})`);
      flap.current.style.display = f > 0.004 ? "" : "none";
      for (const [g, a, b] of [
        [backGrad.current, k, 1.15],
        [foldGrad.current, k, k - 0.42],
      ]) {
        g.setAttribute("x1", (dx * a).toFixed(4));
        g.setAttribute("y1", (dy * a).toFixed(4));
        g.setAttribute("x2", (dx * b).toFixed(4));
        g.setAttribute("y2", (dy * b).toFixed(4));
      }
      foldShade.current.style.opacity = Math.min(1, f * 5).toFixed(3);

      const lift = st.lift.v;
      const s = 1 + lift * 0.07;
      wrap.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) rotate(${rotate + st.tilt.v}deg) scale(${s.toFixed(4)})`;
      const blur = 1.5 + lift * 18;
      const oy = 1 + lift * 14;
      svgRef.current.style.filter = `drop-shadow(0 ${oy.toFixed(1)}px ${blur.toFixed(1)}px rgba(0,0,0,${(0.2 + lift * 0.1).toFixed(3)}))`;
    };

    const tick = (now) => {
      const dt = Math.min(0.033, (now - st.last) / 1000);
      st.last = now;
      spring(st.fold, st.foldT, dt, 380, 26);
      spring(st.lift, st.liftT, dt, 520, 24);
      spring(st.tilt, st.tiltT, dt, 300, 22);
      if (st.drag) {
        st.tiltT *= Math.pow(0.02, dt); // tilt relaxes when the hand slows
        edgeScroll(dt);
      }
      draw();
      const moving =
        [st.fold, st.lift, st.tilt].some((s) => Math.abs(s.vel) > 0.002) ||
        Math.abs(st.fold.v - st.foldT) > 0.002 ||
        Math.abs(st.lift.v - st.liftT) > 0.002 ||
        Math.abs(st.tilt.v - st.tiltT) > 0.05;
      st.raf = moving || st.drag ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!st.raf) {
        st.last = performance.now();
        st.raf = requestAnimationFrame(tick);
      }
    };

    // Peel from the side nearest the pointer, in the sticker's own (rotated) frame.
    const aim = (e) => {
      const r = wrap.getBoundingClientRect();
      const vx = e.clientX - (r.left + r.width / 2);
      const vy = e.clientY - (r.top + r.height / 2);
      const L = Math.hypot(vx, vy);
      if (L < 4) return;
      const a = (-(rotate + st.tilt.v) * Math.PI) / 180;
      const x = vx / L;
      const y = vy / L;
      st.dir = { x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a) };
    };

    // The sticker can go anywhere on the page. It moves with the hand, the page under it
    // included, and stays inside the page.
    const scrollTop = () => window.lenis?.animatedScroll ?? window.scrollY;
    const follow = () => {
      const d = st.drag;
      let nx = d.ox + d.lx - d.sx;
      let ny = d.oy + d.ly - d.sy + (scrollTop() - d.scroll);
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2 - st.x;
      const cy = r.top + r.height / 2 - st.y;
      const hw = r.width / 2;
      const hh = r.height / 2;
      const page = document.documentElement;
      nx = Math.min(page.clientWidth - hw - cx, Math.max(hw - cx, nx));
      ny = Math.min(page.scrollHeight - scrollTop() - hh - cy, Math.max(-scrollTop() + hh - cy, ny));
      st.x = nx;
      st.y = ny;
    };
    // Held near the top or bottom of the screen, the page scrolls to take it further.
    const edgeScroll = (dt) => {
      const d = st.drag;
      const band = Math.min(90, window.innerHeight * 0.12);
      const over = d.ly < band ? d.ly - band : d.ly > window.innerHeight - band ? d.ly - (window.innerHeight - band) : 0;
      if (!over) return;
      const by = (over / band) * 900 * dt;
      if (window.lenis) window.lenis.scrollTo(window.lenis.animatedScroll + by, { immediate: true, force: true });
      else window.scrollBy({ top: by, behavior: "instant" });
      follow();
    };
    const onScroll = () => {
      if (!st.drag) return;
      follow();
      kick();
    };
    const onDown = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      wrap.setPointerCapture(e.pointerId);
      aim(e);
      (wrap.parentElement || wrap).style.zIndex = String(++topZ);
      st.drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: st.x, oy: st.y, lx: e.clientX, ly: e.clientY, vx: e.clientX, lt: performance.now(), scroll: scrollTop() };
      st.foldT = 0.42;
      st.liftT = 1;
      wrap.dataset.dragging = "";
      kick();
    };
    const onMove = (e) => {
      const d = st.drag;
      if (!d || e.pointerId !== d.id) return;
      d.lx = e.clientX;
      d.ly = e.clientY;
      follow();
      const now = performance.now();
      const vx = (e.clientX - d.vx) / Math.max(8, now - d.lt);
      d.vx = e.clientX;
      d.lt = now;
      st.tiltT = Math.max(-14, Math.min(14, st.tiltT * 0.6 + vx * 9));
      // Swinging the hand lifts the flap a little more.
      st.foldT = 0.42 + Math.min(0.12, Math.abs(vx) * 0.06);
      kick();
    };
    const onUp = (e) => {
      const d = st.drag;
      if (!d || e.pointerId !== d.id) return;
      st.drag = null;
      st.foldT = 0;
      st.liftT = 0;
      st.tiltT = 0;
      st.lift.vel -= 2.2; // pressed on: squash below rest, spring back
      delete wrap.dataset.dragging;
      kick();
    };
    // A narrower window mustn't leave one off the side of the page.
    const onResize = () => {
      const r = wrap.getBoundingClientRect();
      const over = r.right - document.documentElement.clientWidth;
      if (over > 0) st.x -= over;
      if (r.left < 0) st.x -= r.left;
      draw();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    wrap.addEventListener("lostpointercapture", onUp);
    draw();
    return () => {
      cancelAnimationFrame(st.raf);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("lostpointercapture", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [rotate]);

  return (
    <div ref={wrapRef} className={`peel-sticker ${className}`} style={style} aria-hidden="true">
      <svg ref={svgRef} viewBox="-1.08 -1.08 2.16 2.16" className="block h-full w-full overflow-visible">
        <defs>
          <clipPath id={`f-${id}`}>
            <polygon ref={frontClip} />
          </clipPath>
          <clipPath id={`s-${id}`}>
            <path d={def.shape} />
          </clipPath>
          <linearGradient id={`b-${id}`} ref={backGrad} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#c9c4b8" />
            <stop offset="0.35" stopColor="#ebe8e1" />
            <stop offset="1" stopColor="#fbfaf7" />
          </linearGradient>
          <linearGradient id={`d-${id}`} ref={foldGrad} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="0.32" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#f-${id})`}>
          <path d={def.shape} fill={def.color} />
          <g clipPath={`url(#s-${id})`}>
            {def.glyph}
            {/* Shadow the lifted flap casts along the fold */}
            <rect ref={foldShade} x="-2" y="-2" width="4" height="4" fill={`url(#d-${id})`} />
          </g>
          {/* The flap: the peeled part, folded back over the front */}
          <g ref={flap} style={{ display: "none" }}>
            <path d={def.shape} fill={`url(#b-${id})`} />
          </g>
        </g>
      </svg>
    </div>
  );
}
