"use client";

import { useEffect, useRef } from "react";
import { useHintDone } from "@/lib/useHint";

const GAP = 14; // from the arrow's tip to what it points at, the same for every hint

/**
 * A small handwritten note with a hand-drawn arrow, there until it's been acted on.
 *
 * Give it a `target` and it measures that element and sets itself on the given `side`,
 * so the arrow lands the same distance away at every screen size. Below `at` pixels of
 * width it uses `narrow` and `narrowTarget`, for screens with no room beside it. `edge`
 * is what the gap is measured to, when the target sits inside something larger.
 */
export default function Hint({ id, children, className = "", target, narrowTarget = target, edge, side = "top", narrow = side, at = 0 }) {
  const done = useHintDone(id);
  const ref = useRef(null);

  useEffect(() => {
    if (!target) return;
    const hint = ref.current;
    const arrow = hint.querySelector("svg");

    const place = () => {
      const wide = window.innerWidth >= at;
      const goal = document.querySelector(wide ? target : narrowTarget);
      const box = hint.offsetParent;
      if (!goal || !box) return;
      hint.dataset.side = wide ? side : narrow;
      hint.style.left = hint.style.top = "0px";
      const t = goal.getBoundingClientRect();
      const e = (edge && document.querySelector(edge)?.getBoundingClientRect()) || t;
      const o = box.getBoundingClientRect();
      const h = hint.getBoundingClientRect();
      const a = arrow.getBoundingClientRect();
      const tip = { left: a.left - h.left, right: a.right - h.left, top: a.top - h.top, bottom: a.bottom - h.top };
      const mid = { x: (a.left + a.right) / 2 - h.left, y: (a.top + a.bottom) / 2 - h.top };
      const across = hint.dataset.side === "left" || hint.dataset.side === "right";
      const spot = {
        left: e.left - GAP - tip.right,
        right: e.right + GAP - tip.left,
        top: e.top - GAP - tip.bottom,
      }[hint.dataset.side];
      const x = across ? spot : (t.left + t.right) / 2 - h.width / 2;
      const y = across ? (t.top + t.bottom) / 2 - mid.y : spot;
      hint.style.left = `${x - o.left}px`;
      hint.style.top = `${y - o.top}px`;
      hint.dataset.placed = "";
    };

    place();
    const watch = new ResizeObserver(place);
    watch.observe(document.documentElement);
    document.fonts?.ready.then(place);
    // What it points at may still be animating in when it first comes into view.
    let settle = 0;
    const seen = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      place();
      clearTimeout(settle);
      settle = setTimeout(place, 1500);
    });
    seen.observe(hint);
    return () => {
      watch.disconnect();
      seen.disconnect();
      clearTimeout(settle);
    };
  }, [target, narrowTarget, edge, side, narrow, at]);

  return (
    <span ref={ref} className={`hint ${className} ${done ? "is-done" : ""}`} aria-hidden="true">
      <span>{children}</span>
      <svg viewBox="0 0 50 34">
        <path d="M3 5c5 13 15 21 26 21 6 0 11-2 16-6" />
        <path d="M36 17.5c3 .6 6.200 1.800 9.500 2.700-.8 3.200-1.300 6.300-2.800 9.300" />
      </svg>
    </span>
  );
}
