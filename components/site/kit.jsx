"use client";

import { Children, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Shared motion vocabulary. Kept deliberately small so the whole site moves
 * the same way:
 *  - EASE (strong ease-out) for anything entering,
 *  - EASE_IO for things moving across the screen,
 *  - springs only where the pointer drives motion (in the components).
 */
export const EASE = [0.23, 1, 0.32, 1];
export const EASE_IO = [0.77, 0, 0.175, 1];

/**
 * Masked line reveal. Pass lines as children (one element or string per
 * line); each slides up from behind its own mask, staggered.
 */
export function Lines({ children, className = "", delay = 0, once = true, as: Tag = "div", stagger = 0.08 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const lines = Children.toArray(children);
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pt-[0.06em] -mt-[0.06em] pb-[0.2em] -mb-[0.2em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%" }}
            animate={inView || reduce ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Fade-and-rise for supporting content. */
export function Rise({ children, className = "", delay = 0, y = 28, as = "div" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * A paragraph whose words light up as it scrolls through the viewport.
 * Words start at 18% and reach full strength in reading order.
 */
export function ScrubWords({ text, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.26em]">
      {children}
    </motion.span>
  );
}

/** Parallax: moves its child against the scroll by `amount` px over its pass. */
export function Parallax({ children, amount = 80, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="relative h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Section header used everywhere, so titles and their supporting text share
 * one grid: title on the left (7 of 12 columns), text on the right, sitting
 * on the title's baseline.
 */
export function SectionHead({ label, lines, aside, className = "" }) {
  return (
    <div className={`gutter grid lg:grid-cols-12 gap-x-8 gap-y-6 items-end mb-12 md:mb-16 lg:mb-20 ${className}`}>
      <div className="lg:col-span-7">
        {label ? (
          <Rise className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-5 md:mb-7">{label}</Rise>
        ) : null}
        <Lines as="h2" className="optical font-funnel text-[13vw] md:text-[9.5vw] lg:text-[6.2vw] leading-[0.94] tracking-[-0.045em]">
          {lines}
        </Lines>
      </div>
      {aside ? (
        <Rise
          delay={0.1}
          className="max-w-[46ch] lg:max-w-none lg:col-span-4 lg:col-start-9 text-[length:calc(var(--u)*17)] md:text-[length:calc(var(--u)*19)] leading-[1.5] tracking-[-0.005em] text-[var(--mute)] lg:pb-[0.95vw]"
        >
          {aside}
        </Rise>
      ) : null}
    </div>
  );
}
