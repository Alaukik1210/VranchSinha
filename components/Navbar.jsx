"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { label: "Connect", href: "https://www.linkedin.com/in/vranchsinha", external: true },
];

const pillClasses =
  "liquid-glass [backdrop-filter:blur(7px)_saturate(1.8)_url(#liquid-lens)] " +
  "[-webkit-backdrop-filter:blur(16px)_saturate(1.6)] rounded-full " +
  "tracking-wide text-white font-light transition-all duration-300 hover:scale-105";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className="font-outfit">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="#home" aria-label="Home" className="cursor-pointer">
          <Image
            src="/logo.svg"
            alt="Vranch Sinha logo"
            width={50}
            height={100}
            className="w-9 h-auto sm:w-11 md:w-[50px]"
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`${pillClasses} px-5 lg:px-6 py-2.5 lg:py-3 text-sm`}
            >
              {item.label}
            </a>
          ))}

          {/* Resume — downloads the PDF directly */}
          <a
            href="/resume.pdf"
            download="Vranch Sinha Resume.pdf"
            className={`${pillClasses} px-5 lg:px-6 py-2.5 lg:py-3 text-sm`}
          >
            Resume
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`${pillClasses} md:hidden flex h-11 w-11 items-center justify-center`}
        >
          <span className="relative block h-4 w-5">
            <motion.span
              className="absolute left-0 top-0 block h-[2px] w-5 bg-white"
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute left-0 top-1/2 block h-[2px] w-5 -translate-y-1/2 bg-white"
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute bottom-0 left-0 block h-[2px] w-5 bg-white"
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-[#0E0E0E]/80 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          >
            {/* Close / back button — sits above the overlay so the menu can always
                be dismissed even though the hamburger toggle is behind the overlay. */}
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              // `.liquid-glass` (in pillClasses) sets `position: relative`, which
              // beats Tailwind's `.absolute` in the cascade — so pin the corner
              // with an inline style that overrides it.
              style={{ position: "absolute", top: "1.25rem", right: "1.25rem" }}
              className={`${pillClasses} flex h-11 w-11 items-center justify-center`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
              className="flex h-full flex-col items-center justify-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="text-white text-3xl font-light tracking-wide hover:text-[#DCC0F7] transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}

              {/* Resume — downloads the PDF directly */}
              <motion.a
                href="/resume.pdf"
                download="Vranch Sinha Resume.pdf"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navItems.length * 0.08, duration: 0.4 }}
                className={`${pillClasses} mt-2 px-7 py-3 text-2xl`}
              >
                Resume
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
