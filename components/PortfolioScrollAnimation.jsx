"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Production from "@/components/Production";
import Footer from "@/components/Footer";

export default function PortfolioScrollAnimation() {
  // Lazy-init from matchMedia on the FIRST client render (same pattern as
  // KeyNotes) so we never briefly apply the wrong variant on mobile.
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mobile-only entrance: the rounded footer panel slides up into view as you
  // scroll to it, so it reads as a "rise" reveal instead of sitting statically
  // stacked under Production. Desktop keeps its own sticky rise (driven by the
  // absolute md:top-[140vh] positioning below) and is left untouched.
  // Transform-only (no opacity) on purpose: if the in-view trigger ever fails
  // to fire, the panel is at worst shifted a little — never invisible.
  const mobileReveal = isMobile
    ? {
        initial: { y: 90 },
        whileInView: { y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.8, ease: "easeOut" },
      }
    : {};

  return (
    <div className="relative md:h-[250vh] z-[9999]">
      {/* Production — pinned only on desktop; flows normally on mobile */}
      <div className="md:sticky md:top-0 md:h-screen z-10">
        <Production />
      </div>

      {/* Footer — rises over Production on desktop; mobile gets its own
          scroll-triggered rise (mobileReveal) so it isn't static. */}
      <div>
        {/* Desktop-only rising white noise panel behind the footer */}
        <div className="hidden md:block absolute top-[125vh] w-full pointer-events-none bg-white h-[80vh] rounded-t-[75px] z-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-90 mix-blend-normal pointer-events-none mb-20"
            style={{
              backgroundImage: "url('/noise.png')",
              backgroundSize: "1800px 1000px",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        <motion.div
          {...mobileReveal}
          className="relative md:absolute md:top-[140vh] w-full rounded-t-[75px] overflow-hidden z-20"
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}
