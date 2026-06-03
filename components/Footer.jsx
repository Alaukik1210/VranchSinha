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
    label: "Resume",
    href: "/resume.pdf",
    download: "Vranch Sinha Resume.pdf",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2" aria-hidden="true">
        <path
          d="M7 3h6l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M13 3v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12h6M9 15.5h6M9 8.5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <div id="contact" className="w-full">
      {/* Album-cover panel: the footerbg art is scaled 110% and bleeds past the
          rounded top of the rising panel so it clips cleanly over Production. */}
      <div className="h-[110vh] pt-12 w-full bg-[url('/footerbg.png')] scale-110 origin-bottom overflow-hidden bg-cover bg-center bg-no-repeat">
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
                {socials.map(({ label, href, icon, download }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    download={download}
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
