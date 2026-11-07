"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Route transition: every page mounts under a sheet that lifts away, and the
 * scroll resets to the top first so the new page starts where it should.
 */
// The sheet only covers in-app navigation; a fresh load has its own intro.
let mounted = false;

export default function Template({ children }) {
  const reduce = useReducedMotion();
  // A card opening from Selected work brings its own transition.
  const [first] = useState(() => !mounted || (typeof document !== "undefined" && "lens" in document.documentElement.dataset));

  useEffect(() => {
    mounted = true;
    if (window.location.hash || window.lensReturn !== undefined) return;
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {reduce || first ? null : (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[150] bg-[var(--ink-2)] pointer-events-none"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.05 }}
        />
      )}
      {children}
    </>
  );
}
