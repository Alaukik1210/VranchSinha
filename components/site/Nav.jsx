"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, EASE_IO } from "./kit";
import Mark from "./Mark";
import { CONTACT } from "@/lib/work";

const LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Identity", href: "/#identity" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Plain, quiet navigation: links dim on hover, the résumé is a simple pill.
 * Transparent over the hero; a solid bar once the page has moved, so it
 * stays legible over imagery without blend modes (which would force the
 * WebGL hero to recomposite every frame).
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) window.lenis?.stop();
    else window.lenis?.start();
  }, [open]);

  return (
    <>
      <header className="nav-bar fixed inset-x-0 top-0 z-[80]" data-solid={solid && !open}>
        <div className="gutter flex items-center justify-between h-[calc(var(--u)*68)] md:h-[calc(var(--u)*80)]">
          <Link href="/" className="flex items-center gap-3" aria-label="Vranch Sinha, home">
            <Mark className="w-7 h-7" />
            <span className="hidden sm:inline text-[length:calc(var(--u)*15)] tracking-[-0.01em]">Vranch Sinha</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-[length:calc(var(--u)*15)]">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="link-quiet">
                {l.label}
              </Link>
            ))}
            <a
              href={CONTACT.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-10 px-5 rounded-full border border-[var(--line)] hover:border-[var(--paper)] transition-colors duration-300"
            >
              Résumé
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden h-10 px-4 rounded-full border border-[var(--line)] text-[length:calc(var(--u)*14)]"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE_IO }}
            className="gutter fixed inset-0 z-[70] bg-[var(--ink-2)] flex flex-col justify-end pb-10 pt-28"
          >
            <nav aria-label="Menu" className="flex flex-col">
              {[...LINKS, { label: "Résumé", href: CONTACT.resume, external: true }].map((l, i) => (
                <span key={l.label} className="overflow-hidden border-b border-[var(--line)]">
                  <motion.a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    onClick={() => setOpen(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.05 }}
                    className="block py-4 font-funnel text-[length:calc(var(--u)*40)] leading-[1.05] tracking-[-0.03em]"
                  >
                    {l.label}
                  </motion.a>
                </span>
              ))}
            </nav>
            <p className="mt-8 text-[length:calc(var(--u)*14)] text-[var(--mute)]">{CONTACT.email}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
