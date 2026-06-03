"use client";

import Production from "@/components/Production";
import Footer from "@/components/Footer";

export default function PortfolioScrollAnimation() {
  return (
    <div className="relative md:h-[250vh] z-[9999]">
      {/* Production — pinned only on desktop; flows normally on mobile */}
      <div className="md:sticky md:top-0 md:h-screen z-10">
        <Production />
      </div>

      {/* Footer — rises over Production on desktop; simple stacked flow on mobile */}
      <div>
        {/* Desktop-only rising white noise panel behind the footer */}
        <div className="hidden md:block absolute top-[125vh] w-full pointer-events-none bg-white h-[80vh] rounded-t-[75px] z-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-90 mix-blend-normal pointer-events-none mb-20"
            style={{
              backgroundImage: "url('/noise.png')",
              backgroundSize: "1800px 1000px",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        <div className="relative md:absolute md:top-[140vh] w-full rounded-t-[75px] overflow-hidden z-20 md:pointer-events-none">
          <Footer />
        </div>
      </div>
    </div>
  );
}
