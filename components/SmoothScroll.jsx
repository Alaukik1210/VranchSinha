"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum smooth-scroll layer.
 * - Disabled automatically when the user prefers reduced motion or on coarse
 *   pointers below a small viewport (keeps low-end mobile snappy).
 * - Drives the native window scroll so framer-motion's `useScroll` stays in sync.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // native touch scrolling on mobile = better perf
      touchMultiplier: 1.5,
      anchors: true, // let Lenis smoothly handle in-page #hash links
    });

    // Expose for in-app programmatic scrolling (e.g. nav, buttons).
    window.lenis = lenis;
    // Held while the intro plays. However the hold lifts (the intro ending, or the
    // first-byte script's safety timer), scrolling comes back with it.
    const root = document.documentElement;
    let held = null;
    if (root.classList.contains("is-intro")) {
      lenis.stop();
      held = new MutationObserver(() => {
        if (root.classList.contains("is-intro")) return;
        held.disconnect();
        lenis.start();
      });
      held.observe(root, { attributes: true, attributeFilter: ["class"] });
    }

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      held?.disconnect();
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return children;
}
