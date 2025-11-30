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

      
     <div className="absolute top-[145vh] w-full pointer-events-none bg-white h-[80vh] rounded-t-[75px] z-0 overflow-hidden">
  <div 
    className="absolute inset-0 opacity-60"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.5 0 0 0 0.4 0 0.3 0 0 0.15 0 0 0.6 0 0.5 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      backgroundSize: 'cover',
      mixBlendMode: 'multiply'
    }}
  />
</div>
      <div className="absolute top-[160vh]  w-full z-20 pointer-events-none">
        <Footer />
      </div>
</div>
    </div>
  );
}
