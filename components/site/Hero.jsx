"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE } from "./kit";
import { useIntroDone } from "./Intro";

// WebGL only on the client. It mounts immediately (behind the loader) so
// shaders compile before anything is shown.
const GlassShield = dynamic(() => import("./GlassShield"), { ssr: false });

function RevealLine({ children, delay, ready, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block overflow-hidden py-[0.1em] -my-[0.1em] ${className}`}>
      <motion.span
        className="block"
        initial={reduce ? false : { y: "110%" }}
        animate={ready || reduce ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Shown if WebGL isn't available: the name as plain type. */
function NameFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-5">
      <p className="font-funnel text-center tracking-[-0.05em] leading-[0.9] text-[24vw] md:text-[13vw]">Vranch Sinha</p>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const scrollRef = useRef(0);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (scrollRef.current = reduce ? 0 : v));
  const chromeFade = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[calc(var(--u)*600)] overflow-hidden" aria-label="Introduction">
      <h1 className="sr-only">Vranch Sinha, independent designer for brand identity and digital product</h1>

      <div className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}>
        <GlassShield ready={ready} scroll={scrollRef} narrow={narrow} fallback={<NameFallback />} />
      </div>

      <motion.div
        style={{ opacity: chromeFade }}
        className="gutter pointer-events-none relative z-10 h-full flex flex-col justify-between pt-[calc(var(--u)*104)] md:pt-[calc(var(--u)*124)] pb-6 md:pb-8"
      >
        <div className="flex items-start justify-between gap-8">
          <p className="max-w-[36ch] text-[length:calc(var(--u)*16)] md:text-[length:calc(var(--u)*18)] leading-[1.45] tracking-[-0.005em]">
            <RevealLine ready={ready} delay={0.45}>Independent designer for</RevealLine>
            <RevealLine ready={ready} delay={0.5}>brand identity and digital product.</RevealLine>
            <RevealLine ready={ready} delay={0.58} className="text-[var(--mute)]">
              Clarity, systems and detail,
            </RevealLine>
            <RevealLine ready={ready} delay={0.63} className="text-[var(--mute)]">
              from the first mark to the final pixel.
            </RevealLine>
          </p>
          <p className="hidden md:block text-right font-mono-ui text-[length:calc(var(--u)*11)] leading-[1.9] uppercase text-[var(--mute)]">
            <RevealLine ready={ready} delay={0.55}>Brand identity</RevealLine>
            <RevealLine ready={ready} delay={0.6}>Digital product</RevealLine>
            <RevealLine ready={ready} delay={0.65}>Creative development</RevealLine>
          </p>
        </div>

        <div className="flex items-end justify-between text-[length:calc(var(--u)*13)] md:text-[length:calc(var(--u)*14)]">
          <RevealLine ready={ready} delay={0.75} className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)]">
            Drag to rotate
          </RevealLine>
          <RevealLine ready={ready} delay={0.8}>
            <a href="#work" className="link-quiet pointer-events-auto inline-flex items-center gap-2">
              Selected work
              <span aria-hidden="true" className="link-arrow">↓</span>
            </a>
          </RevealLine>
        </div>
      </motion.div>
    </section>
  );
}
