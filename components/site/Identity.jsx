"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Lightbox from "@/components/Lightbox";
import { SectionHead } from "./kit";
import { MARKS } from "@/lib/work";

// A little disorder in the closed stack, so it reads as a real pile.
const LOOSE = [-5, 3, -2, 6, -4, 2, -6];
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Logos & brand kits as a deck. It pins, and as you scroll the loose stack
 * fans out into an arc; hovering lifts a card to the front, and any card
 * opens full size. Transform-only, so it stays smooth.
 */
export default function Identity() {
  const section = useRef(null);
  const [open, setOpen] = useState(null);
  const [vw, setVw] = useState(1440);
  const reduce = useReducedMotion();

  useEffect(() => {
    const m = () => setVw(window.innerWidth);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const spread = useTransform(scrollYProgress, (p) =>
    reduce ? 1 : easeInOut(Math.min(1, Math.max(0, (p - 0.04) / 0.62)))
  );

  const narrow = vw < 768;
  const card = narrow ? Math.round(vw * 0.28) : Math.min(270, Math.round(vw * 0.17));
  const step = narrow ? vw * 0.072 : Math.min(170, vw * 0.105);

  return (
    <section id="identity" ref={section} aria-label="Logos and brand kits" className="relative mt-32 md:mt-48 h-[240vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col pt-[calc(var(--u)*96)] md:pt-[calc(var(--u)*120)]">
        <SectionHead
          className="!mb-0"
          lines={[<span key="a">Logos &amp;</span>, <span key="b" className="text-[var(--mute)]">brand kits</span>]}
          aside="Marks and the visual systems built around them. Select any piece to see it full size."
        />

        <div className="relative flex-1">
          <div className="absolute left-1/2 top-[42%] w-0 h-0">
            {MARKS.map((m, i) => (
              <DeckCard
                key={m.src}
                m={m}
                i={i}
                n={MARKS.length}
                spread={spread}
                size={card}
                step={step}
                onOpen={() => setOpen(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox items={MARKS} index={open} onClose={() => setOpen(null)} accent="var(--lilac)" />
    </section>
  );
}

function DeckCard({ m, i, n, spread, size, step, onOpen }) {
  const d = i - (n - 1) / 2;
  const x = useTransform(spread, (v) => d * step * v - size / 2);
  const y = useTransform(spread, (v) => d * d * 9 * v - size / 2 + (1 - v) * i * -3);
  const rotate = useTransform(spread, (v) => d * 5.5 * v + LOOSE[i % LOOSE.length] * (1 - v));

  return (
    <motion.div style={{ x, y, rotate, width: size, height: size, zIndex: i }} className="deck-card absolute left-0 top-0">
      <button
        type="button"
        onClick={onOpen}
        className="deck-face block w-full h-full rounded-[calc(var(--u)*20)] overflow-hidden cursor-zoom-in shadow-[0_24px_50px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
        aria-label={`Open ${m.title}`}
      >
        <Image src={m.src} alt={m.title} fill sizes={`${size}px`} className="object-cover" />
      </button>
    </motion.div>
  );
}
