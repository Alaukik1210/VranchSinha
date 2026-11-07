import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Fades every .story-rise inside `root` up into place as it scrolls into view. */
export function useRise(root) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const blocks = root.current.querySelectorAll(".story-rise");
    gsap.set(blocks, { autoAlpha: 0, y: 24 });
    const triggers = ScrollTrigger.batch(blocks, {
      start: "top 92%",
      once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07 }),
    });
    return () => triggers.forEach((t) => t.kill());
  }, [root]);
}
