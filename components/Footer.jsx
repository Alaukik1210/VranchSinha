"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <div className="w-full">
      <div className="h-[100vh] pt-12 w-full bg-[url('/footerbg.png')] scale-110 overflow-hidden bg-cover bg-center bg-no-repeat">

        {/* changed this block only */}
        <div className="flex w-full h-full items-end pb-16">
          {/* Logo */}
          <div className="flex items-end">
            <Image
              src="/logo.svg"
              alt="logo"
              width={80}
              height={80}
              className="mx-32"
            />
          </div>

          {/* Right side content */}
          <div className="flex justify-between gap-[300px] w-full items-end">
            <div className="text-purple-300 flex flex-col justify-end">
              <span className="text-7xl font-funnel leading-none block">
                Vranch Sinha
              </span>
              <div className="text-2xl pl-4 leading-none mt-2">
                PORTFOLIO VOL. 1
              </div>
            </div>

            {/* 4 squares */}
            <div className="flex gap-12 mr-32 items-end">
              <div className="h-15 w-15 bg-purple-300 rounded-xl" />
              <div className="h-15 w-15 bg-purple-300 rounded-xl" />
              <div className="h-15 w-15 bg-purple-300 rounded-xl" />
              <div className="h-15 w-15 bg-purple-300 rounded-xl" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
