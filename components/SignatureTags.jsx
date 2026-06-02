"use client";
import { useState } from "react";
import Image from "next/image";

const data = {
  logos: ["/logo1.svg", "/logo2.svg", "/logo3.svg"],
  brandkits: ["/brand1.svg", "/brand2.svg", "/brand3.svg", "/brand4.svg"],
};

export default function SignatureTags() {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      id="signature-tags"
      className="h-auto md:h-screen text-white flex flex-col items-center relative px-6 py-16 md:py-0"
    >
      <div className="text-base sm:text-xl pt-24 md:pt-60 tracking-wider">
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
            {data.logos.map((src, i) => (
              <div
                key={i}
                className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden"
              >
                <Image src={src} alt="logo" fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Touch / mobile static row */}
          <div className="flex md:hidden gap-3 mt-5">
            {data.logos.map((src, i) => (
              <div
                key={i}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden"
              >
                <Image src={src} alt="logo" fill className="object-cover" />
              </div>
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
            {data.brandkits.map((src, i) => (
              <div
                key={i}
                className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden"
              >
                <Image src={src} alt="brand-kit" fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Touch / mobile static row */}
          <div className="flex md:hidden flex-wrap justify-center gap-3 mt-5">
            {data.brandkits.map((src, i) => (
              <div
                key={i}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden"
              >
                <Image src={src} alt="brand-kit" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
