"use client";

import { Rise, SectionHead } from "./kit";

/**
 * The five capabilities, each carrying one of the portfolio's original
 * colours. On hover the colour floods the row edge to edge (the fill bleeds
 * past the gutter while the type stays on the grid) and the detail appears.
 * On touch screens the detail is always shown.
 */
const ITEMS = [
  {
    title: "Brand identity",
    color: "#F2B61F",
    ink: "#111",
    note: "Marks, typography and colour, built as one system that scales from an app icon to signage.",
  },
  {
    title: "Visual direction",
    color: "#E23535",
    ink: "#fff",
    note: "Art direction and the principles that keep a brand coherent across every touchpoint.",
  },
  {
    title: "Digital product",
    color: "#1542A1",
    ink: "#fff",
    note: "Interfaces shaped around real behaviour, with the motion and detail that make them feel effortless.",
  },
  {
    title: "Human-centred flows",
    color: "#077301",
    ink: "#fff",
    note: "Onboarding, checkout and everything between, designed around how people actually decide.",
  },
  {
    title: "Systems & structure",
    color: "#894BC7",
    ink: "#fff",
    note: "Information architecture and component libraries that give a team a shared, durable foundation.",
  },
];

export default function Capabilities() {
  return (
    <section className="pt-32 md:pt-48" aria-label="Capabilities">
      <SectionHead
        lines={[<span key="a">Capabilities</span>]}
        aside="Brand and product designed as one system, so the identity holds in every screen and the product still feels like the brand."
      />

      <div className="gutter">
      <ul className="border-b border-[var(--line)]">
        {ITEMS.map((it, i) => (
          <Rise as="li" key={it.title} delay={i * 0.04}>
            <div
              className="cap-row relative border-t border-[var(--line)]"
              style={{ "--cap": it.color, "--cap-ink": it.ink }}
            >
              <span aria-hidden="true" className="cap-fill absolute inset-y-0 -left-5 -right-5 md:-left-10 md:-right-10" />
              <div className="relative grid grid-cols-[40px_1fr] md:grid-cols-12 items-center gap-x-8 gap-y-2 py-6 md:py-8">
                <span className="cap-ink font-mono-ui text-[length:calc(var(--u)*11)] text-[var(--mute)] md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="cap-ink font-funnel text-[7.4vw] md:text-[4.6vw] lg:text-[3.1vw] leading-[1.05] tracking-[-0.03em] md:col-span-6">
                  {it.title}
                </span>
                <span className="cap-note cap-ink col-start-2 md:col-start-9 md:col-span-4 text-[length:calc(var(--u)*15)] md:text-[length:calc(var(--u)*16)] leading-[1.5] text-[var(--mute)]">
                  {it.note}
                </span>
              </div>
            </div>
          </Rise>
        ))}
      </ul>
      </div>
    </section>
  );
}
