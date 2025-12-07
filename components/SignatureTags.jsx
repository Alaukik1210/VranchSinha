"use client";
import { useState } from "react";
import Image from "next/image";

export default function SignatureTags() {
  const [hovered, setHovered] = useState(null);

  const data = {
    logos: [
      "/logo1.svg",
      "/logo2.svg",
      "/logo3.svg",
    ],

    brandkits: [
      "/brand1.svg",
      "/brand2.svg",
      "/brand3.svg",
      "/brand4.svg",
     
    ],
  };

  return (
    <div className="h-auto md:h-screen text-white flex flex-col items-center relative">
      <div className="text-xl pt-60 tracking-wider">SIGNATURE TAGS</div>

      <div className="flex flex-col justify-center items-center h-2/3 w-full text-4xl md:text-6xl font-semibold relative">

        {/* LOGOS ----------------------------------- */}
        <div
          className="flex justify-start w-[90%] md:w-[31%] hover:text-[#9CD7F9] cursor-pointer relative"
          onMouseEnter={() => setHovered("logos")}
          onMouseLeave={() => setHovered(null)}
        >
            <span
             onMouseEnter={() => setHovered("logos")}
          onMouseLeave={() => setHovered(null)}
className={`${hovered === "brand" ? "opacity-0" : "opacity-100"} transition-all  duration-300`}
          >
          LOGOS
            </span>

          {/* HOVER IMAGE POPUP */}
          <div
            className={`
              absolute left-[38%] top-[200%] z-20
              -translate-y-1/2 flex gap-4
              transition-all duration-500 ease-out
              ${hovered === "logos" ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
            `}
          >
            {data.logos.map((src, i) => (
              <div key={i} className="relative w-20 h-20 md:w-32 md:h-32 rounded-xl overflow-hidden">
                <Image
                  src={src}
                  alt="logo"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* BRAND KITS ----------------------------------- */}
        <div
          className="flex justify-end w-[90%] md:w-[31%] cursor-pointer relative"
          
        >
          <span
             onMouseEnter={() => setHovered("brand")}
          onMouseLeave={() => setHovered(null)}
 className={`${hovered === "logos" ? "opacity-0" : "opacity-100"} transition-all hover:text-[#FFE481] duration-300`}
          >
          BRAND KITS
            </span>

          {/* HOVER IMAGE POPUP */}
          <div
            className={`
              absolute right-[65%] bottom-[0%] 
              -translate-y-1/2 flex gap-4
              transition-all duration-500 ease-out
              ${hovered === "brand" ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
            `}
          >
            {data.brandkits.map((src, i) => (
              <div key={i} className="relative w-20 h-20 md:w-32 md:h-32 rounded-xl overflow-hidden">
                <Image
                  src={src}
                  alt="brand-kit"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
