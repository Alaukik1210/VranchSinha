"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * After a reload nobody asked for (see the first-byte script in the layout), the visitor
 * goes back where they were. The page's height settles late, and ScrollTrigger restores
 * older positions as it refreshes, so the spot is held for a few seconds, until the
 * visitor touches anything. A finished bill comes back finished, at the bill.
 */
export default function Resume() {
  useEffect(() => {
    const r = window.__resume;
    if (!r) return;
    const at = () => {
      const bill = r.b && document.querySelector(".bill");
      return bill ? bill.getBoundingClientRect().top + window.scrollY : r.y;
    };
    const hold = () => {
      window.lenis?.resize();
      const y = at();
      window.scrollTo({ top: y, behavior: "instant" });
      window.lenis?.scrollTo(y, { immediate: true, force: true });
    };
    const settling = new ResizeObserver(hold);
    settling.observe(document.body);
    ScrollTrigger.addEventListener("refresh", hold);
    const letGo = () => {
      settling.disconnect();
      ScrollTrigger.removeEventListener("refresh", hold);
      clearTimeout(timer);
      window.__resume = null; // later visits home are ordinary ones
    };
    const timer = setTimeout(letGo, 6000);
    const types = ["wheel", "touchstart", "keydown", "pointerdown"];
    types.forEach((t) => window.addEventListener(t, letGo, { once: true, passive: true }));
    hold();
    return () => {
      letGo();
      types.forEach((t) => window.removeEventListener(t, letGo));
    };
  }, []);
  return null;
}
