"use client";

import Image from "next/image";
import Aurora from "./Aurora";
import GradientText from "./GradientText";

// Bottom-right social links. Replace the placeholder hrefs with your real ones.
const socials = [
  {
    label: "Mail",
    href: "mailto:vranchhsinha@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "tel:+919336771392",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2" aria-hidden="true">
        <path
          d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vranch-sinha-18b32515a",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-1/2 w-1/2" aria-hidden="true">
        <path d="M6.94 8.5v9.5H4V8.5h2.94ZM5.47 4a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM20 18h-2.94v-5.1c0-1.3-.47-2.18-1.63-2.18-.89 0-1.42.6-1.65 1.18-.09.2-.11.5-.11.79V18H10.7s.04-8.6 0-9.5h2.94v1.35c.39-.6 1.09-1.46 2.65-1.46 1.94 0 3.4 1.27 3.4 4V18Z" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "https://www.behance.net/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-1/2 w-1/2" aria-hidden="true">
        <path d="M8.3 11.3c.86-.43 1.32-1.08 1.32-2.05 0-1.9-1.42-2.65-3.3-2.65H1.5v10.7h5c2 0 3.78-.96 3.78-3.18 0-1.37-.65-2.38-1.98-2.82ZM4 8.4h1.9c.74 0 1.4.2 1.4 1.06 0 .8-.52 1.12-1.27 1.12H4V8.4Zm2.1 6.9H4v-2.55h2.16c.9 0 1.47.38 1.47 1.3 0 .9-.67 1.25-1.53 1.25ZM22.5 9.1h-5V7.85h5V9.1Zm.5 4.55c0-2.4-1.4-4.4-3.95-4.4-2.47 0-4.16 1.86-4.16 4.3 0 2.53 1.6 4.27 4.16 4.27 1.94 0 3.2-.87 3.8-2.73h-2.1c-.21.55-.78.86-1.6.86-1.07 0-1.74-.63-1.84-1.7H23c.01-.13 0-.4 0-.6Zm-5.66-.83c.13-.96.7-1.6 1.7-1.6 1.05 0 1.5.7 1.56 1.6h-3.26Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <div id="contact" className="w-full">
      {/* Album-cover panel: the footerbg art is scaled 110% and bleeds past the
          rounded top of the rising panel so it clips cleanly over Production. */}
      <div className="h-[110vh] pt-12 w-full bg-[url('/footerbg.png')] scale-110 overflow-hidden bg-cover bg-center bg-no-repeat">
        <div className="relative w-full h-full flex flex-col">
          {/* Aurora background */}
          <div className="absolute inset-0 -z-10">
            <Aurora
              colorStops={["#894fc3", "#dcc0f7", "#894fc3"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </div>

          {/* Heading — vertically centred in the cover */}
          <div className="flex justify-center flex-1 items-center text-[#dcc0f7] font-funnel font-light text-5xl sm:text-7xl md:text-8xl lg:text-[130px] tracking-tight text-center px-4">
            <GradientText
              colors={["#894fc3", "#dcc0f7", "#0E0E0E", "#ffff", "#894fc3"]}
              animationSpeed={5}
              showBorder={false}
              className="custom-class"
            >
              Get in Touch
            </GradientText>
          </div>

          {/* Bottom bar — extra horizontal inset compensates for the panel's
              scale-110 so the logo/squares don't get clipped at the edges. */}
          <div className="flex flex-col sm:flex-row w-full items-start sm:items-end gap-8 sm:gap-6 pb-12 md:pb-16 px-12 sm:px-20 md:px-28 lg:px-32">
            {/* Logo */}
            <div className="flex items-end shrink-0">
              <Image
                src="/logo.svg"
                alt="logo"
                width={60}
                height={60}
                className="w-12 md:w-[60px] h-auto"
              />
            </div>

            {/* Right side content */}
            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-[50px] w-full items-start sm:items-end">
              <div className="text-[#DCC0F7] flex flex-col justify-end">
                <span className="text-2xl md:text-4xl font-funnel leading-none block">
                  Vranch Sinha
                </span>
                <div className="text-base md:text-lg leading-none mt-2">
                  PORTFOLIO VOL. 1
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-4 md:gap-6 items-end">
                {socials.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="h-10 w-10 md:h-12 md:w-12 bg-[#DCC0F7] rounded-lg md:rounded-xl flex items-center justify-center text-[#0E0E0E] transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
