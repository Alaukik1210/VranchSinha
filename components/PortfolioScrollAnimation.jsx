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

      
      <div className="absolute top-[145vh]  w-full  pointer-events-none bg-white h-[80vh] rounded-t-[75px]   z-0">
       <div className="">

       </div>
      </div>
      <div className="absolute top-[160vh]  w-full z-20 pointer-events-none">
        <Footer />
      </div>
</div>
    </div>
  );
}
