"use client";

import { ScrubWords, Rise } from "./kit";

export default function Statement() {
  return (
    <section className="gutter pt-32 md:pt-48 grid lg:grid-cols-12 gap-x-8" aria-label="Approach">
      <Rise className="lg:col-span-3 font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-8 lg:mb-0 lg:pt-[1.1vw]">
        Approach
      </Rise>
      <ScrubWords
        className="lg:col-span-9 font-funnel text-[8vw] md:text-[6vw] lg:text-[3.9vw] leading-[1.08] tracking-[-0.03em] text-pretty"
        text="Good design is felt before it is noticed. Clear in intent, consistent as a system, and resolved down to the smallest detail. Every identity and interface I make is held to that standard."
      />
    </section>
  );
}
