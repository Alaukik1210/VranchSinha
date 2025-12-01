"use client";

import Production from "@/components/Production";
import Footer from "@/components/Footer";

export default function PortfolioScrollAnimation() {
  return (
    <div className="relative h-[250vh] z-[9999] ">
      {/* Production (bottom layer) */}
      <div className="sticky top-0 h-screen z-10">
        <Production />
      </div>

      {/* Footer rising ABOVE Production */}
      <div className="">
        <div className="absolute top-[125vh] w-full pointer-events-none bg-white h-[80vh] rounded-t-[75px] z-0 overflow-hidden">
          <div
    className="absolute inset-0 opacity-90 mix-blend-normal pointer-events-none mb-20 "
    style={{
      backgroundImage: "url('/noise.png')",
      backgroundSize: "1600px 1000px", // adjust density
      backgroundRepeat: "no-repeat",
    }}
  />
        </div>
        <div className="absolute top-[140vh] w-full rounded-t-[75px] overflow-hidden z-20 pointer-events-none">
          <Footer />
        </div>
      </div>
    </div>
  );
}
