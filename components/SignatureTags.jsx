"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";

const data = {
  logos: ["/logo1.svg", "/logo2.svg", "/logo3.svg"],
  brandkits: ["/brand1.svg", "/brand2.svg", "/brand3.svg", "/brand4.svg"],
};

// One viewer for both sets, so arrowing past the last logo carries on into
// the brand kits.
const viewable = [
  ...data.logos.map((src, i) => ({ src, title: `Logo ${String(i + 1).padStart(2, "0")}`, tag: "Logos" })),
  ...data.brandkits.map((src, i) => ({ src, title: `Brand Kit ${String(i + 1).padStart(2, "0")}`, tag: "Brand Kits" })),
];

/** A thumbnail that opens the viewer. */
function Thumb({ src, alt, className, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(viewable.findIndex((v) => v.src === src))}
      aria-label={`Open ${alt}`}
      className={`relative rounded-xl overflow-hidden cursor-zoom-in transition-transform duration-300 hover:scale-105 hover:ring-2 hover:ring-white/40 ${className}`}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </button>
  );
}

export default function SignatureTags() {
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(null);

  return (
    <section
      id="signature-tags"
      className="h-auto md:h-screen text-white flex flex-col items-center relative px-6 py-16 md:py-0"
    >
      <Lightbox items={viewable} index={open} onClose={() => setOpen(null)} />

      <div className="text-base sm:text-xl pt-16 md:pt-40 tracking-wider">
        SIGNATURE TAGS
      </div>

      <div className="flex flex-col justify-center items-center md:h-2/3 w-full text-3xl sm:text-5xl md:text-6xl font-semibold relative gap-10 md:gap-0 mt-12 md:mt-0">
        {/* LOGOS ----------------------------------- */}
        <div
          className="flex flex-col md:flex-row md:justify-start items-center w-full md:w-[31%] cursor-pointer relative"
          onMouseEnter={() => setHovered("logos")}
          onMouseLeave={() => setHovered(null)}
        >
          <span
            className={`${
              hovered === "brand" ? "md:opacity-0" : "opacity-100"
            } transition-all duration-300 hover:text-[#9CD7F9]`}
          >
            LOGOS
          </span>

          {/* Desktop hover popup */}
          <div
            className={`hidden md:flex absolute left-[38%] top-[200%] z-20 -translate-y-1/2 gap-4 transition-all duration-500 ease-out ${
              hovered === "logos"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            }`}
          >
            {data.logos.map((src) => (
              <Thumb key={src} src={src} alt="logo" className="w-24 h-24 lg:w-32 lg:h-32" onOpen={setOpen} />
            ))}
          </div>

          {/* Touch / mobile static row */}
          <div className="flex md:hidden gap-3 mt-5">
            {data.logos.map((src) => (
              <Thumb key={src} src={src} alt="logo" className="w-16 h-16 sm:w-20 sm:h-20" onOpen={setOpen} />
            ))}
          </div>
        </div>

        {/* BRAND KITS ----------------------------------- */}
        <div
          className="flex flex-col md:flex-row md:justify-end items-center w-full md:w-[31%] cursor-pointer relative"
          onMouseEnter={() => setHovered("brand")}
          onMouseLeave={() => setHovered(null)}
        >
          <span
            className={`${
              hovered === "logos" ? "md:opacity-0" : "opacity-100"
            } transition-all hover:text-[#FFE481] duration-300`}
          >
            BRAND KITS
          </span>

          {/* Desktop hover popup */}
          <div
            className={`hidden md:flex absolute right-[65%] bottom-[0%] -translate-y-1/2 gap-4 transition-all duration-500 ease-out ${
              hovered === "brand"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            }`}
          >
            {data.brandkits.map((src) => (
              <Thumb key={src} src={src} alt="brand kit" className="w-24 h-24 lg:w-32 lg:h-32" onOpen={setOpen} />
            ))}
          </div>

          {/* Touch / mobile static row */}
          <div className="flex md:hidden flex-wrap justify-center gap-3 mt-5">
            {data.brandkits.map((src) => (
              <Thumb key={src} src={src} alt="brand kit" className="w-16 h-16 sm:w-20 sm:h-20" onOpen={setOpen} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
