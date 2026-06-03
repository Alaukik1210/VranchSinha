"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#keynotes" },
  { label: "Work", href: "#discography" },
  { label: "Contact", href: "#contact" },
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

  // Nav clicks. "Contact" must land at the very bottom of the rising footer —
  // the #contact element sits at the TOP of a 110vh panel, so a plain hash jump
  // stops short. Scroll to the document's max instead so the contact bar is in view.
  const handleNav = (href) => (e) => {
    setOpen(false);
    if (href !== "#contact") return; // let Lenis handle the rest natively
    e.preventDefault();
    const bottom = document.documentElement.scrollHeight;
    if (window.lenis) window.lenis.scrollTo(bottom, { duration: 1.4, lock: true });
    else window.scrollTo({ top: bottom, behavior: "smooth" });
  };

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
              onClick={handleNav(item.href)}
              className={`${pillClasses} px-5 lg:px-6 py-2.5 lg:py-3 text-sm`}
            >
              {item.label}
            </a>
          ))}

          {/* Resume — downloads the PDF directly */}
          <a
            href="/resume.pdf"
            download="Vranch-Sinha-Resume.pdf"
            className="rounded-full px-5 lg:px-6 py-2.5 lg:py-3 text-sm tracking-wide font-light bg-[#DCC0F7] text-[#0E0E0E] transition-all duration-300 hover:scale-105 hover:bg-white flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M12 3v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 17v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
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
                  onClick={handleNav(item.href)}
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
                download="Vranch-Sinha-Resume.pdf"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navItems.length * 0.08, duration: 0.4 }}
                className="mt-2 flex items-center gap-2 rounded-full bg-[#DCC0F7] px-7 py-3 text-2xl font-light tracking-wide text-[#0E0E0E]"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path d="M12 3v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 17v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Resume
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
