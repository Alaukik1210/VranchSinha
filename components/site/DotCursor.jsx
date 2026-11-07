"use client";

import { useEffect, useRef } from "react";
import { bindLens, lensReady, moveLens, openLens, redrawLens } from "@/lib/visionLens";

/**
 * The cursor: a dot that opens into an eye over anything clickable
 * and a hand over anything draggable.
 *
 * It is one white shape in difference blend, so it reads black on the light
 * ground, white on dark, and inverts whatever sits inside it. Position is
 * written straight from the pointer event with no easing, so it never trails.
 * The dot expands into the eye and collapses back along the same curve. Over a
 * link with data-pill it opens into a pill showing where it goes; over a sticker
 * or sign it gives way to a small glove that closes on press. Both sit outside the blend,
 * so they keep their real colours and stay readable. Over the bill it opens the big
 * eye (see lib/visionLens) and stays on as the dot at its centre, the one undistorted
 * point in the lens, to aim with. Touch screens keep their own behaviour, and the native cursor is
 * only hidden once this is running.
 */

const HOT = "a, button, summary, label, [role='button'], [data-hot]";
const DRAG = ".peel-sticker, .sign";
const PILL = "[data-pill]";
const VISION = "[data-vision]";

// The dot and the eye as the same points, so each one travels in a straight line
// to its partner and the whole outline moves as one. A polygon morph has none of
// the late surge that animating border-radius gives the eye's tips.
const outline = (a, b, shape) =>
  Array.from({ length: 64 }, (_, i) => {
    const t = (i / 64) * Math.PI * 2;
    const [x, y] = shape(t);
    return `${(40 + a * x).toFixed(2)}px ${(24 + b * y).toFixed(2)}px`;
  }).join(",");
const round = (t) => [Math.cos(t), Math.sin(t)];
const almond = (t) => [Math.cos(t), Math.sin(t) * Math.abs(Math.sin(t))];
const MORPH = {
  "--dot": `polygon(${outline(6, 6, round)})`,
  "--eye": `polygon(${outline(32, 17, almond)})`,
  "--gone": `polygon(${outline(0, 0, round)})`,
};

export default function DotCursor() {
  const ref = useRef(null);
  const handRef = useRef(null);
  const pillRef = useRef(null);
  const eyeRef = useRef(null);

  useEffect(() => {
    bindLens(eyeRef.current);
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    const el = ref.current;
    const hand = handRef.current;
    const pill = pillRef.current;
    const text = pill.firstChild;
    let half = 0; // the pill's half width, to keep it on screen
    let x = 0;
    let y = 0;

    const place = () => {
      const px = half ? Math.min(window.innerWidth - half - 10, Math.max(half + 10, x)) : x;
      pill.style.transform = `translate3d(${px}px, ${y}px, 0)`;
    };

    const aim = (target) => {
      const vision = Boolean(target?.closest?.(VISION)) && lensReady();
      const link = target?.closest?.(PILL); // the details stay live inside the big eye
      const drag = !link && Boolean(target?.closest?.(DRAG));
      el.classList.toggle("is-pill", Boolean(link));
      pill.classList.toggle("is-pill", Boolean(link));
      pill.classList.toggle("on-eye", vision);
      if (link && text.textContent !== link.dataset.pill) text.textContent = link.dataset.pill;
      half = link ? text.offsetWidth / 2 : 0;
      el.classList.toggle("is-hand", drag);
      hand.classList.toggle("is-hand", drag);
      el.classList.toggle("is-vision", vision);
      openLens(vision);
      el.classList.toggle("is-eye", !vision && !drag && !link && Boolean(target?.closest?.(HOT)));
      place();
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      el.style.transform = hand.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      moveLens(x, y);
      el.classList.add("is-on");
      hand.classList.add("is-on");
      aim(e.target);
    };
    // Scrolling slides things under a still pointer.
    const onScroll = () => {
      aim(document.elementFromPoint(x, y));
      redrawLens();
    };
    const onLeave = () => {
      el.classList.remove("is-on");
      hand.classList.remove("is-on");
    };
    const onDown = () => hand.classList.add("is-grip");
    const onUp = () => hand.classList.remove("is-grip");

    root.classList.add("has-dot");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("blur", onUp); // let go in another window
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-dot");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ref} className="dot-cursor" aria-hidden="true">
        <span className="dot-shape" style={MORPH} />
      </div>
      <canvas ref={eyeRef} className="vision-eye" aria-hidden="true" />
      <div ref={pillRef} className="dot-pill" aria-hidden="true">
        <span />
      </div>
      <div ref={handRef} className="dot-hand" aria-hidden="true">
        <span />
      </div>
    </>
  );
}
