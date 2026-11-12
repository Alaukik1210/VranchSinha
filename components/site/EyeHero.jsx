"use client";

import { useEffect, useRef, useState } from "react";
import { drawEyeFrame, LOADER_END, LOOP_END, STAGE } from "@/lib/eyeFilm";

/**
 * Loader and hero in one canvas.
 *
 * On a fresh load the eye film plays full-bleed: the wall of eyes converges
 * to a single dot (0 → 8.2 s). The camera then eases back from that dot to
 * the hero framing, the page chrome and the type ring fade in, and the eye
 * cycle runs from the dot back to the same dot (8.2 → 29.3 s) on a loop.
 * In-app navigation home skips straight to the loop.
 *
 * The film is drawn live, so it is sharp at any size and costs no download.
 * Drawing pauses while the hero is off-screen or the tab is hidden.
 */

const FPS = 60;
const F_LOADER = Math.round(LOADER_END * FPS); // 492, the dot
const F_LOOP = Math.round(LOOP_END * FPS); // 1758, the same dot
const SETTLE_MS = 1300; // camera pull-back from loader framing to hero framing
const STILL_FRAME = 26.9 * FPS; // reduced motion: the blue eye, wide open

const RING = "Shift the perspective ✦ Change the outcome ✦ ";

let played = false; // per page load

const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

// h is the hero's height; full is the canvas's, which on phones runs on under the
// browser's toolbar so the intro fills the whole screen. The film is centred on the
// hero, so it covers the larger of the two halves.
function framing(w, h, full = h) {
  const cover = Math.max(w / STAGE.W, (2 * Math.max(h / 2, full - h / 2)) / STAGE.H);
  // The ring fills the space between the top bar and the bottom line, so it
  // never collides with them (landscape phones are the tight case). The eye
  // stays inside it: most frames reach ~480 stage units from the centre, the
  // odd spike pokes through the type.
  const u = Math.min(1.6, Math.max(1, w / 1440));
  const free = h - 2 * (w < 768 ? 88 : 96) * u;
  const room = Math.max(60, Math.min(w * 0.9, free * 0.98, 1100 * u) / 2);
  const hero = (room * 0.81) / 480;
  // The ring sits behind the canvas and tighter than the eye's reach, so the
  // bigger shapes pass over the type.
  const ring = room * 0.8;
  return { cover, hero, ring };
}

export default function EyeHero() {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(played ? "loop" : "intro"); // intro → settle → loop
  const [ring, setRing] = useState(0);
  const skipRef = useRef(null);
  const measureRef = useRef(null);
  const [ringFs, setRingFs] = useState(0);

  // Size the ring type so two passes of the line fill the circle exactly,
  // with natural spacing (textLength then only absorbs rounding).
  useEffect(() => {
    if (!ring) return;
    let alive = true;
    const fit = () => {
      const t = measureRef.current;
      if (!t || !alive) return;
      const len = t.getComputedTextLength(); // at 100px
      // The path sits 0.36em inside the ring's edge: 2π(r − 0.36·fs) = 2·len·fs/100.
      if (len > 0) setRingFs((2 * Math.PI * ring) / ((2 * len) / 100 + 2 * Math.PI * 0.36));
    };
    document.fonts.ready.then(fit);
    return () => {
      alive = false;
    };
  }, [ring]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A link straight to a section skips the film: it would play out of view.
    const fresh = !played && !window.location.hash;
    played = true;

    let w = 0;
    let h = 0;
    let vh = 0; // the hero's height, where the film is centred
    let dpr = 1;
    let fr = framing(1, 1);
    const size = () => {
      const r = canvas.getBoundingClientRect();
      // A phone's toolbar sliding in or out fires a resize that changes nothing here, and
      // setting a canvas's size clears and reallocates it, mid-scroll.
      if (r.width === w && r.height === h && canvas.parentElement.clientHeight === vh) return;
      w = r.width;
      h = r.height;
      vh = canvas.parentElement.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      fr = framing(w, vh, h);
      setRing(fr.ring);
    };
    size();

    const draw = (frame, scale) => {
      const s = scale * dpr;
      // Stage centre on canvas centre.
      const base = [s, 0, 0, s, (w * dpr) / 2 - STAGE.CX * s, (vh * dpr) / 2 - STAGE.CY * s];
      drawEyeFrame(ctx, frame, base, canvas.width, canvas.height);
    };

    // Timeline state, in ms.
    let mode = reduce ? "still" : fresh ? "intro" : "loop";
    let t0 = performance.now();
    let settleAt = 0;
    let loopAt = t0;
    let raf = 0;
    // A page opened in a background tab starts its clock when first seen.
    let visible = !document.hidden;

    const unlock = () => {
      document.documentElement.classList.remove("is-intro");
      window.lenis?.start();
    };

    const finishIntro = () => {
      if (mode !== "intro") return;
      mode = "settle";
      settleAt = performance.now();
      setPhase("settle");
    };
    skipRef.current = finishIntro;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (mode === "intro") {
        const f = ((now - t0) / 1000) * FPS;
        if (f >= F_LOADER) {
          draw(F_LOADER, fr.cover);
          finishIntro();
          return;
        }
        draw(f, fr.cover);
      } else if (mode === "settle") {
        const u = Math.min(1, (now - settleAt) / SETTLE_MS);
        draw(F_LOADER, fr.cover + (fr.hero - fr.cover) * ease(u));
        if (u >= 1) {
          mode = "loop";
          loopAt = now;
          setPhase("loop");
          document.documentElement.dataset.intro = "done";
          unlock();
        }
      } else if (mode === "loop") {
        const span = F_LOOP - F_LOADER;
        const f = F_LOADER + ((((now - loopAt) / 1000) * FPS) % span);
        draw(f, fr.hero);
      }
    };

    if (mode !== "intro") unlock(); // held from the first byte, but no intro this time

    if (mode === "still") {
      raf = requestAnimationFrame(() => {
        document.documentElement.dataset.intro = "done";
        setPhase("loop");
        draw(STILL_FRAME, fr.hero);
      });
    } else {
      if (mode === "loop") {
        document.documentElement.dataset.intro = "done";
        requestAnimationFrame(() => setPhase("loop"));
      }
      if (mode === "intro") {
        // Nothing scrolls until the intro is over. SmoothScroll starts after this, and
        // stops itself when it sees the class.
        document.documentElement.classList.add("is-intro");
        window.scrollTo(0, 0);
      }
      raf = requestAnimationFrame(tick);
    }

    // Pause off-screen; resume the loop where it left off.
    let pausedAt = visible ? 0 : t0;
    const setVisible = (v) => {
      if (v === visible) return;
      visible = v;
      const now = performance.now();
      if (!v) pausedAt = now;
      else {
        const gap = now - pausedAt;
        t0 += gap;
        settleAt += gap;
        loopAt += gap;
      }
    };
    // The intro always runs to its end, or the page would wait on it forever.
    const seen = (onScreen) => !document.hidden && (onScreen || mode === "intro" || mode === "settle");
    const io = new IntersectionObserver(([e]) => setVisible(seen(e.isIntersecting)));
    io.observe(canvas);
    const onVis = () => setVisible(seen(canvas.getBoundingClientRect().bottom > 0));
    document.addEventListener("visibilitychange", onVis);

    const onResize = () => {
      size();
      if (mode === "still") draw(STILL_FRAME, fr.hero);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      unlock();
    };
  }, []);

  const intro = phase === "intro";
  const shown = phase === "loop";
  const r = ring;
  const ringR = Math.max(0, r - ringFs * 0.36);
  const circ = 2 * Math.PI * ringR;

  return (
    <section
      className="eye-hero relative h-[100svh] min-h-[320px] overflow-x-clip"
      aria-label="Introduction"
      onClick={intro ? () => skipRef.current?.() : undefined}
    >
      {/* Type ring */}
      {r > 0 ? (
        <div
          aria-hidden="true"
          className={`eye-ring pointer-events-none absolute left-1/2 top-1/2 ${shown ? "is-on" : ""}`}
          style={{ width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r }}
        >
          <svg viewBox={`0 0 ${r * 2} ${r * 2}`} className="eye-ring-spin h-full w-full overflow-visible">
            <defs>
              <path
                id="eye-ring-path"
                d={`M ${r},${r} m -${ringR},0 a ${ringR},${ringR} 0 1,1 ${ringR * 2},0 a ${ringR},${ringR} 0 1,1 -${ringR * 2},0`}
              />
            </defs>
            <text ref={measureRef} className="eye-ring-text" style={{ fontSize: 100 }} opacity="0">
              {RING}
            </text>
            <text className="eye-ring-text" style={{ fontSize: ringFs }}>
              <textPath href="#eye-ring-path" textLength={circ - 2} lengthAdjust="spacing">
                {RING}
                {RING}
              </textPath>
            </text>
          </svg>
        </div>
      ) : null}

      {/* The film draws over the ring (its ground is transparent). */}
      <canvas ref={canvasRef} className="eye-canvas" aria-hidden="true" />

      <h1 className="sr-only">Vranch Sinha, product and brand designer. Shift the perspective. Change the outcome.</h1>

      {/* Chrome (the nav is the GlassNav capsule, outside this section) */}
      <div className={`eye-chrome gutter absolute inset-x-0 bottom-0 pb-[calc(var(--u)*28)] ${shown ? "is-on" : ""}`}>
        <p className="leading-[1.5]">
          Product &amp; brand designer.
          <span className="block text-[var(--eye-mute)]">Building identities, shaping experiences, connecting the dots.</span>
        </p>
      </div>

      {/* In negative, so it reads over the white and the black of the film alike. */}
      {intro ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            skipRef.current?.();
          }}
          className="eye-skip"
        >
          Skip intro
        </button>
      ) : null}
    </section>
  );
}
