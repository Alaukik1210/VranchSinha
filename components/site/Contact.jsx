"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Playground from "./Playground";
import { CONTACT } from "@/lib/work";

// The disciplines behind the work. A few carry the portfolio's colours; the
// rest stay neutral so the pile reads as one considered palette.
const TAGS = [
  { label: "UI/UX design", tone: "#F2B61F", ink: "#111" },
  { label: "Wireframing" },
  { label: "Prototyping", tone: "#1542A1", ink: "#fff" },
  { label: "Design systems" },
  { label: "Brand identity", tone: "#E23535", ink: "#fff" },
  { label: "Typography" },
  { label: "User research" },
  { label: "Interaction design", tone: "#894BC7", ink: "#fff" },
  { label: "Art direction" },
  { label: "Information architecture" },
  { label: "Motion", tone: "#077301", ink: "#fff" },
  { label: "Usability testing" },
  { label: "Figma" },
  { label: "Front-end" },
];

const NAME = "Vranch Sinha";

/**
 * The footer. The page lifts off it (the wrapper clips a fixed layer), and
 * it's built like a closing spread: an invitation and the address on top,
 * a playground of discipline tags you can throw around in the middle, plain
 * columns, and the name set across the full width, whose letters rise
 * toward the pointer.
 */
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const m = () => setSmall(window.innerWidth < 768);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  function copy() {
    navigator.clipboard?.writeText(CONTACT.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  const items = TAGS.map((t) => ({
    key: t.label,
    node: (
      <span
        className="block whitespace-nowrap rounded-full font-medium tracking-[-0.01em] leading-none"
        style={{
          background: t.tone ?? "#232326",
          color: t.ink ?? "var(--paper)",
          boxShadow: t.tone ? undefined : "inset 0 0 0 1px rgba(236,235,231,0.14)",
          fontSize: small ? "0.875rem" : "1.25rem",
          padding: small ? "0.7rem 1rem" : "1rem 1.6rem",
        }}
      >
        {t.label}
      </span>
    ),
  }));

  return (
    // Desktop: the page lifts off a fixed, one-screen footer (the wrapper
    // clips a fixed layer). Phones: a normal footer that grows to fit, since a
    // short screen can't hold every row in one viewport.
    <div id="contact" data-reveal-wrap className="relative md:h-[100svh]" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <footer className="relative md:fixed md:bottom-0 md:left-0 w-full md:h-[100svh] bg-[var(--ink-2)] overflow-hidden flex flex-col">
        {/* Invitation + address */}
        <div className="footer-head gutter pt-[calc(var(--u)*96)] md:pt-[calc(var(--u)*112)] grid lg:grid-cols-12 gap-x-8 gap-y-8 items-end">
          <div className="lg:col-span-7">
            <p className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-5 md:mb-7">Contact</p>
            <h2 className="optical font-funnel text-[11vw] md:text-[8vw] lg:text-[5.2vw] leading-[0.98] tracking-[-0.04em]">
              Have a project
              <br />
              <span className="text-[var(--mute)]">in mind?</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pb-[0.8vw] max-w-[46ch] lg:max-w-none">
            <p className="text-[length:calc(var(--u)*17)] md:text-[length:calc(var(--u)*19)] leading-[1.5] text-[var(--mute)] mb-5">
              Tell me what you&apos;re building and where you want it to go.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${CONTACT.email}`} className="link-quiet text-[length:calc(var(--u)*19)] md:text-[length:calc(var(--u)*22)] tracking-[-0.01em] border-b border-[var(--line)] pb-1">
                {CONTACT.email}
              </a>
              <button
                type="button"
                onClick={copy}
                className="press shrink-0 rounded-full border border-[var(--line)] px-3 h-8 text-[length:calc(var(--u)*12)] hover:border-[var(--paper)] transition-colors duration-200"
                aria-live="polite"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Playground: a closed box the tags drop into and can be thrown around. */}
        <Playground key={small ? "s" : "l"} items={items} className="h-[calc(var(--u)*300)] md:h-auto md:flex-1 md:min-h-[calc(var(--u)*220)] mt-8 md:mt-0" />

        {/* Columns */}
        <div className="footer-cols gutter grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-6 py-6 md:py-8 border-t border-[var(--line)] text-[length:calc(var(--u)*14)] md:text-[length:calc(var(--u)*15)]">
          <nav aria-label="Footer" className="md:col-span-3 flex flex-col gap-1.5">
            <span className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-1">Index</span>
            <Link href="/#work" className="link-quiet">Work</Link>
            <Link href="/#identity" className="link-quiet">Identity</Link>
            <Link href="/#about" className="link-quiet">About</Link>
          </nav>
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <span className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-1">Elsewhere</span>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex items-center gap-1">
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <a href={CONTACT.resume} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex items-center gap-1">
              Résumé <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <span className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-1">Direct</span>
          </div>
          <div className="md:col-span-3 flex flex-col gap-1.5 md:items-end">
            <span className="font-mono-ui text-[length:calc(var(--u)*11)] uppercase text-[var(--mute)] mb-1">© 2026</span>
            <button
              type="button"
              onClick={() => (window.lenis ? window.lenis.scrollTo(0, { duration: 1.8 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
              className="link-quiet text-left md:text-right"
            >
              Back to top ↑
            </button>
          </div>
        </div>

        <Wordmark />
      </footer>
    </div>
  );
}

/** The name across the full width. Letters rise toward the pointer. */
function Wordmark() {
  const ref = useRef(null);
  const letters = useRef([]);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.7 });
    io.observe(el.closest("[data-reveal-wrap]") || el);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return () => io.disconnect();
    const footer = el.closest("footer");
    const move = (e) => {
      for (const l of letters.current) {
        if (!l) continue;
        const r = l.getBoundingClientRect();
        const dx = Math.abs(e.clientX - (r.left + r.width / 2));
        const t = Math.max(0, 1 - dx / 260);
        l.style.transform = `translate3d(0, ${-t * t * 12}%, 0)`;
      }
    };
    const leave = () => letters.current.forEach((l) => l && (l.style.transform = ""));
    footer.addEventListener("pointermove", move);
    footer.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      footer.removeEventListener("pointermove", move);
      footer.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="gutter pt-4 md:pt-0 pb-3 md:pb-5" aria-hidden="true">
      <p className="optical font-funnel whitespace-nowrap text-[min(17.2vw,22vh)] leading-[1] tracking-[-0.06em] flex">
        {[...NAME].map((c, i) => (
          // Headroom above the glyph so the hover lift never clips.
          <span key={i} className="inline-block overflow-hidden pt-[0.2em] -mt-[0.2em] pb-[0.18em] -mb-[0.18em]">
            <span
              className="wm-rise inline-block whitespace-pre"
              data-shown={shown}
              style={{ transitionDelay: shown ? `${i * 35}ms` : "0ms" }}
            >
              <span
                ref={(n) => {
                  letters.current[i] = n;
                }}
                className="wm-letter inline-block whitespace-pre"
              >
                {c}
              </span>
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}
