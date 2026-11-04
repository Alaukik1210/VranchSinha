"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import { Rise, SectionHead } from "./kit";
import { SIDE } from "@/lib/work";

/**
 * The side project. The hero shot opens from a framed window to full bleed
 * as it scrolls in, and the image inside settles from a slight over-scale.
 */
export default function Side() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const clipPath = useTransform(scrollYProgress, (p) => {
    const i = reduce ? 0 : 10 * (1 - p);
    return `inset(${i}% ${i}% ${i}% ${i}% round ${reduce ? 0 : 24 * (1 - p)}px)`;
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.18, 1]);

  const all = [{ ...SIDE.cover, title: SIDE.name }, ...SIDE.shots];

  return (
    <section className="pt-32 md:pt-48" aria-label="Side project">
      <SectionHead
        label="Side project"
        lines={[<span key="a">{SIDE.name}</span>]}
        aside={
          <>
            A WebGL tribute to Argentina, taken from an empty folder to a live launch in a single day.
            <a
              href={SIDE.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet mt-5 flex items-center gap-1.5 text-[var(--paper)]"
            >
              {SIDE.hrefLabel}
              <ArrowUpRight size={17} />
            </a>
          </>
        }
      />

      <motion.button
        ref={ref}
        type="button"
        onClick={() => setOpen(0)}
        style={{ clipPath }}
        className="relative block w-full aspect-[16/9] md:aspect-[1920/938] overflow-hidden cursor-zoom-in"
        aria-label={`Open ${SIDE.name} screenshots`}
      >
        <motion.div style={{ scale: imgScale }} className="absolute inset-0">
          <Image src={SIDE.cover.src} alt={`${SIDE.name}, the hero with a 3D gold crest`} fill sizes="100vw" className="object-cover" />
        </motion.div>
      </motion.button>

      <div className="gutter mt-5 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-6">
        {SIDE.shots.map((s, i) => (
          <Rise key={s.src} delay={i * 0.05}>
            <button type="button" onClick={() => setOpen(i + 1)} className="group block w-full text-left cursor-zoom-in" aria-label={`Open ${s.title}`}>
              <span className="relative block aspect-[1400/684] overflow-hidden rounded-[calc(var(--u)*12)]">
                <Image
                  src={s.src}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-3 block text-[length:calc(var(--u)*14)] text-[var(--mute)]">{s.title}</span>
            </button>
          </Rise>
        ))}
      </div>

      <Lightbox items={all} index={open} onClose={() => setOpen(null)} accent="var(--lilac)" />
    </section>
  );
}
