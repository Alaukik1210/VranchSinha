"use client";

import Image from "next/image";
import { Parallax, Rise, SectionHead } from "./kit";
import { EXPERIENCE } from "@/lib/work";

export default function About() {
  return (
    <section id="about" className="pt-32 md:pt-48" aria-label="About">
      <SectionHead
        label="About"
        lines={[<span key="a">A designer&apos;s eye,</span>, <span key="b" className="text-[var(--mute)]">an engineer&apos;s rigour</span>]}
      />

      <div className="gutter grid lg:grid-cols-12 gap-x-8 gap-y-12">
        <div className="lg:col-span-4">
          <Parallax amount={30} className="rounded-[calc(var(--u)*18)] aspect-[4/5] w-[62%] md:w-[44%] lg:w-full max-w-[calc(var(--u)*380)]">
            <Image
              src="/vranch-photo.jpg"
              alt="Vranch Sinha"
              fill
              sizes="(max-width: 768px) 90vw, 380px"
              className="object-cover scale-[1.08]"
            />
          </Parallax>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="grid gap-6 text-[length:calc(var(--u)*17)] md:text-[length:calc(var(--u)*19)] leading-[1.6] text-[var(--mute)] max-w-[60ch]">
            <Rise>
              <span className="text-[var(--paper)]">
                I&apos;m Vranch Sinha, an independent designer working across brand identity and digital product.
              </span>{" "}
              My work is rooted in clarity: fewer, better decisions, carried consistently from the mark to the
              smallest interface state.
            </Rise>
            <Rise delay={0.08}>
              Because I also build, what I design survives the journey to production. Typography, colour, motion
              and interaction are resolved once and delivered intact, rather than reinterpreted at handoff.
            </Rise>
          </div>

          <ul className="mt-14 md:mt-20 border-b border-[var(--line)]">
            {EXPERIENCE.map((e, i) => (
              <Rise as="li" key={e.org} delay={i * 0.05} className="border-t border-[var(--line)]">
                <div className="grid grid-cols-[48px_1fr] md:grid-cols-[56px_1fr_1.2fr] items-center gap-x-5 md:gap-x-8 gap-y-3 py-5 md:py-6">
                  <span className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#1d1d20] ring-1 ring-white/10 overflow-hidden">
                    <Image src={e.logo} alt="" fill sizes="56px" className="object-contain p-2" />
                  </span>
                  <span>
                    <span className="block text-[length:calc(var(--u)*17)] md:text-[length:calc(var(--u)*18)] text-[var(--paper)]">{e.org}</span>
                    <span className="block text-[length:calc(var(--u)*14)] text-[var(--mute)]">{e.role}</span>
                  </span>
                  <span className="col-start-2 md:col-start-3 text-[length:calc(var(--u)*14)] md:text-[length:calc(var(--u)*15)] leading-[1.55] text-[var(--mute)]">
                    {e.note}
                  </span>
                </div>
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
