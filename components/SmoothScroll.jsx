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

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return children;
}
