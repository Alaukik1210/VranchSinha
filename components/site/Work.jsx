"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { SectionHead } from "./kit";
import CardVideo from "./CardVideo";
import { WORK } from "@/lib/work";

/**
 * Selected work as stacking cards. Each card pins near the top; as the next
 * one slides over it, it sinks back (scales down and dims), so the stack
 * reads as depth. Inside each card the cover drifts against the scroll, and
 * on hover a "View" disc follows the pointer.
 */
export default function Work() {
  return (
    <section id="work" className="relative pt-32 md:pt-48" aria-label="Selected work">
      <SectionHead
        lines={[<span key="a">Selected</span>, <span key="b" className="text-[var(--mute)]">work</span>]}
        aside="Identity, product and web projects, each carried from first concept through to launch."
      />

      <div className="gutter">
        {WORK.map((p, i) => (
          <Card key={p.slug} p={p} i={i} total={WORK.length} />
        ))}
      </div>
    </section>
  );
}

function Card({ p, i, total }) {
  const wrap = useRef(null);
  const card = useRef(null);
  const reduce = useReducedMotion();
  const last = i === total - 1;

  // While this card is pinned and the next one rises over it.
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce || last ? [1, 1] : [1, 0.9]);
  const dim = useTransform(scrollYProgress, [0, 1], reduce || last ? [0, 0] : [0, 0.6]);

  // Cover parallax across the card's whole pass.
  const { scrollYProgress: pass } = useScroll({ target: wrap, offset: ["start end", "end start"] });
  // Travel stays inside the cover's overscan (inset -10% top and bottom).
  const coverY = useTransform(pass, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  // Pointer-following "View" disc.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 260, damping: 26, mass: 0.5 });
  const discScale = useMotionValue(0);
  const discS = useSpring(discScale, { stiffness: 300, damping: 24 });

  function onMove(e) {
    if (e.pointerType !== "mouse") return;
    const r = card.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
    discScale.set(1);
  }

  return (
    <div ref={wrap} className="h-[100svh] md:h-[108vh]">
      <motion.div
        style={{ scale, transformOrigin: "50% 0%" }}
        className="sticky top-[calc(var(--u)*76)] md:top-[calc(var(--u)*88)] h-[calc(100svh-100px)] md:h-[calc(100vh-120px)]"
      >
        <Link
          href={`/work/${p.slug}`}
          ref={card}
          onPointerMove={onMove}
          onPointerLeave={() => discScale.set(0)}
          className="group relative block h-full w-full overflow-hidden rounded-[calc(var(--u)*20)] md:rounded-[calc(var(--u)*28)] bg-[var(--ink-2)] cursor-none md:cursor-none"
          aria-label={`${p.name}: ${p.kind}. Open case study`}
        >
          <motion.div style={{ y: coverY }} className="absolute inset-x-0 -top-[10%] -bottom-[10%]">
            {/* The still under the loop is its own first frame, so the card
                never shows a screenshot; screens live inside the case study. */}
            <Image
              src={p.video ? `${p.video}-poster.jpg` : p.cover.src}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
            />
            {p.video ? <CardVideo base={p.video} /> : null}
          </motion.div>
          {/* Legibility: a soft floor of shade under the type only. */}
          {/* Shade only under the label (bottom-left); the loops keep their
              own type and colour everywhere else. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_100%,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_45%,transparent_75%)]" />
          <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black pointer-events-none" />

          <ul className="absolute left-0 top-0 hidden md:flex gap-2 p-10 text-white">
            {p.roles.map((r) => (
              <li key={r} className="rounded-full bg-black/45 px-3.5 py-1.5 text-[length:calc(var(--u)*13)] ring-1 ring-white/15">
                {r}
              </li>
            ))}
          </ul>

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-white">
            <p className="text-[length:calc(var(--u)*14)] md:text-[length:calc(var(--u)*16)] text-white/75 mb-3 md:mb-4">
              {p.kind}
              {p.concept ? " · Concept" : ""}
            </p>
            <h3 className="optical font-funnel text-[11vw] md:text-[4.6vw] leading-[0.95] tracking-[-0.04em]">{p.name}</h3>
          </div>

          <span
            className="md:hidden absolute right-6 top-6 rounded-full bg-white text-black text-[length:calc(var(--u)*13)] px-4 py-2"
            aria-hidden="true"
          >
            View
          </span>

          {/* Outer layer follows the pointer; inner centres and scales. */}
          <motion.span
            aria-hidden="true"
            style={{ x: sx, y: sy }}
            className="hidden md:block pointer-events-none absolute left-0 top-0"
          >
            <motion.span
              style={{ scale: discS, color: p.toneInk }}
              className="-translate-x-1/2 -translate-y-1/2 flex w-[calc(var(--u)*112)] h-[calc(var(--u)*112)] rounded-full items-center justify-center text-[length:calc(var(--u)*14)] font-medium"
            >
              <span className="absolute inset-0 rounded-full" style={{ background: p.tone }} />
              <span className="relative">View case</span>
            </motion.span>
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}
