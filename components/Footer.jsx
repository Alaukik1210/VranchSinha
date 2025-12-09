"use client";

import Image from "next/image";
import Aurora from "./Aurora";
import GradientText from "./GradientText";
export default function Footer() {
  return (
    <div className="w-full">
      <div className="h-[110vh] pt-12 w-full bg-[url('/footerbg.png')] scale-110 overflow-hidden bg-cover bg-center bg-no-repeat">
<div style={{ width: '100%', height: 900, position: 'relative' }}>
  <div className="flex justify-center  absolute text-[#dcc0f7] font-funnel font-light text-[130px] inset-60  tracking-tight">
   <GradientText
  colors={["#894fc3", "#dcc0f7", "#0E0E0E", "#ffff", "#894fc3"]}
  animationSpeed={5}
  showBorder={false}
  className="custom-class"
>
  Get in Touch
</GradientText>
    
    </div>
   <div className="absolute inset-0 -z-10">
    <Aurora
  colorStops={["#894fc3", "#dcc0f7", "#894fc3"]}
  blend={0.5}
  amplitude={1.0}
  speed={0.5}
/>
  </div>

        {/* changed this block only */}
        <div className="flex w-full h-full items-end  pb-12 pl-12">
          {/* Logo */}
          <div className="flex items-end">
            <Image
              src="/logo.svg"
              alt="logo"
              width={60}
              height={60}
              className="ml-30 mr-12"
            />
          </div>

          {/* Right side content */}
          <div className="flex justify-between gap-[50px] w-full items-end">
            <div className="text-[#DCC0F7] flex flex-col justify-end">
              <span className="text-4xl font-funnel leading-none block">
                Vranch Sinha
              </span>
              <div className="text-lg pl-4 leading-none mt-2">
                PORTFOLIO VOL. 1
              </div>
            </div>

            {/* 4 squares */}
            <div className="flex gap-8 mr-32 items-end">
              <div className="h-12 w-12 bg-[#DCC0F7] rounded-xl" />
              <div className="h-12 w-12 bg-[#DCC0F7] rounded-xl" />
              <div className="h-12 w-12 bg-[#DCC0F7] rounded-xl" />
              <div className="h-12 w-12 bg-[#DCC0F7] rounded-xl" />
            </div>
          </div>
        </div>
</div>
      </div>
    </div>
  );
}
