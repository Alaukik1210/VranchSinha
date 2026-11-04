"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import { EASE, Lines, Rise } from "./kit";

export default function CaseStudyPage({ p, next }) {
  const reduce = useReducedMotion();
  const cover = useRef(null);
  const [open, setOpen] = useState(null);

  // Cover opens from a framed window to full bleed as you start scrolling.
  const { scrollYProgress } = useScroll({ target: cover, offset: ["start 80%", "start start"] });
  const inset = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [6, 0]);
  const clipPath = useTransform(inset, (i) => `inset(0% ${i}% 0% ${i}% round ${i * 4}px)`);
  const { scrollYProgress: pass } = useScroll({ target: cover, offset: ["start end", "end start"] });
  const coverY = useTransform(pass, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <article className="relative" style={{ "--tone": p.tone }}>
      {/* Header */}
      <header className="gutter pt-[calc(var(--u)*120)] md:pt-[calc(var(--u)*160)] pb-12 md:pb-16">
        <Link href="/#work" className="link-quiet inline-flex items-center gap-2 text-[length:calc(var(--u)*14)] text-[var(--mute)] mb-10 md:mb-14">
          <ArrowLeft size={15} />
          All work
        </Link>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          className="font-mono-ui text-[length:calc(var(--u)*12)] uppercase mb-5"
          style={{ color: p.tone }}
        >
          {p.kind}
          {p.concept ? " · Concept" : ""}
        </motion.p>
        <Lines as="h1" delay={0.3} className="optical font-funnel text-[15vw] md:text-[11vw] leading-[0.95] tracking-[-0.05em]">
          <span>{p.name}</span>
        </Lines>

        <div className="mt-10 md:mt-14 grid lg:grid-cols-12 gap-x-8 gap-y-10">
          <Rise delay={0.5} className="lg:col-span-7 max-w-[60ch] text-[length:calc(var(--u)*19)] md:text-[length:calc(var(--u)*23)] leading-[1.5] tracking-[-0.01em]">
            {p.summary}
          </Rise>
          <Rise delay={0.6} className="lg:col-span-4 lg:col-start-9 flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-16 lg:gap-6">
            <div>
              <p className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-2">Role</p>
              <ul className="text-[length:calc(var(--u)*16)] leading-[1.7]">
                {p.roles.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            {p.href ? (
              <div>
                <p className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-2">Live</p>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex items-center gap-1.5 text-[length:calc(var(--u)*16)] border-b border-[var(--line)] pb-1">
                  {p.hrefLabel}
                  <ArrowUpRight size={15} />
                </a>
              </div>
            ) : null}
          </Rise>
        </div>
      </header>

      {/* Cover */}
      <motion.button
        ref={cover}
        type="button"
        onClick={() => setOpen(0)}
        style={{ clipPath }}
        className="relative block w-full overflow-hidden cursor-zoom-in"
        aria-label={`Open ${p.name} cover`}
      >
        <span className="relative block w-full" style={{ aspectRatio: `${p.cover.w} / ${p.cover.h}`, maxHeight: "92vh" }}>
          <motion.span style={{ y: coverY }} className="absolute inset-[-7%_0] block">
            <Image src={p.cover.src} alt={`${p.name} cover`} fill priority sizes="100vw" className="object-cover" />
          </motion.span>
        </span>
      </motion.button>

      {/* Metrics */}
      {p.metrics?.length ? (
        <section className="gutter pt-20 md:pt-32" aria-label="Results">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line)] rounded-[calc(var(--u)*18)] overflow-hidden">
            {p.metrics.map((m, i) => (
              <Rise key={m.label} delay={i * 0.06} className="bg-[var(--ink)] p-6 md:p-8">
                <p className="font-funnel text-[8.4vw] md:text-[3.4vw] leading-[1.05] tracking-[-0.03em]" style={{ color: p.tone }}>
                  {m.value}
                </p>
                <p className="mt-3 text-[length:calc(var(--u)*14)] text-[var(--mute)]">{m.label}</p>
              </Rise>
            ))}
          </div>
        </section>
      ) : null}

      {/* Story */}
      <section className="gutter pt-20 md:pt-32 grid lg:grid-cols-12 gap-x-8 gap-y-6" aria-label="The story">
        <Rise className="lg:col-span-3 font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] lg:pt-2">The work</Rise>
        <div className="lg:col-span-8 lg:col-start-5 grid md:grid-cols-2 gap-6 md:gap-10 text-[length:calc(var(--u)*16)] md:text-[length:calc(var(--u)*18)] leading-[1.65] text-[var(--mute)]">
          {p.body.map((para, i) => (
            <Rise key={i} delay={i * 0.08}>
              {para}
            </Rise>
          ))}
        </div>
      </section>

      {/* Screens: alternating widths so the gallery has rhythm */}
      <section className="gutter pt-20 md:pt-32 grid md:grid-cols-12 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10" aria-label="Screens">
        {p.screens.map((s, i) => {
          const span = ["md:col-span-12", "md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"][i % 5];
          const tall = s.h > s.w;
          return (
            <Rise key={s.src} delay={(i % 2) * 0.08} className={span}>
              <button type="button" onClick={() => setOpen(i + 1)} className="group block w-full text-left cursor-zoom-in" aria-label={`Open ${s.title}`}>
                <span
                  className="relative block w-full overflow-hidden rounded-[calc(var(--u)*14)] md:rounded-[calc(var(--u)*18)] bg-[var(--ink-2)]"
                  style={{ aspectRatio: tall ? "4 / 5" : `${s.w} / ${s.h}` }}
                >
                  <Image
                    src={s.src}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover object-top transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                  />
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-4 text-[length:calc(var(--u)*14)]">
                  <span>{s.title}</span>
                  <span className="text-[var(--mute)]">{s.tag}</span>
                </span>
              </button>
            </Rise>
          );
        })}
      </section>

      {/* Next project */}
      <NextProject next={next} />

      <Lightbox
        items={[{ src: p.cover.src, title: p.name, tag: p.kind }, ...p.screens]}
        index={open}
        onClose={() => setOpen(null)}
        accent={p.tone}
      />
    </article>
  );
}

function NextProject({ next }) {
  // Hover washes the band in the next project's colour, rising from the
  // bottom edge. Type stays static so nothing clips.
  return (
    <section className="mt-32 md:mt-48" aria-label="Next project">
      <Link
        href={`/work/${next.slug}`}
        className="next-band group relative block overflow-hidden border-t border-[var(--line)]"
        style={{ "--tone": next.tone, "--tone-ink": next.toneInk }}
      >
        <span aria-hidden="true" className="next-fill absolute inset-0" />
        <span className="gutter relative flex flex-col gap-6 py-16 md:py-24">
          <span className="next-ink font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)]">Next project</span>
          <span className="flex items-end justify-between gap-6">
            <span className="next-ink optical font-funnel text-[14vw] md:text-[9vw] leading-[0.98] tracking-[-0.05em]">
              {next.name}
            </span>
            <ArrowUpRight className="next-ink next-arrow shrink-0 w-10 h-10 md:w-16 md:h-16 mb-[1vw]" strokeWidth={1.25} />
          </span>
        </span>
      </Link>
    </section>
  );
}
