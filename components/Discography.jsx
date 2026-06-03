"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { motion } from "framer-motion";

/**
 * DISCOGRAPHY — featured case studies.
 *
 * Screenshots live in /public/projects/:
 *   Genasis:
 *     genasis-cover.jpg     → phone-on-rock hero shot (the "G" logo phone)
 *     genasis-login.jpg     → laptop "Welcome back" login screen
 *     genasis-pricing.jpg   → phone pricing screen
 *     genasis-audience.jpg  → tablet "Who is this for?" screen
 *     genasis-logo.png      → standalone "G" logo on dark
 *   SportsNStats:
 *     sns-cover.png         → multi-device "Players. Courts. Connected." hero
 *     sns-properties.png    → iMac venue/properties dashboard
 *     sns-bookings.png      → MacBook court-booking interface
 *     sns-tournaments.png   → MacBook tournament standings
 *     sns-onboarding.png    → iPhone phone-number sign-in
 *     sns-error.png         → iPhone friendly error state
 * Any missing image gracefully falls back to an accent panel, so the
 * section always looks complete.
 */
const projects = [
  {
    name: "Genasis",
    badge: "FEATURED RELEASE",
    tagline: "Gen AI Platform for Content Creators",
    accent: "#FF3B17",
    accentSoft: "#FF7A4D",
    cover: "/projects/genasis-cover.jpg",
    roles: ["Brand Identity", "Web App UI/UX", "Design System"],
    summary:
      "My most end-to-end project. I came in when the product was an idea — no brand, no interface, no system — and built it out entirely: logo, visual identity, web app UI/UX, and a component library the engineering team could actually ship with.",
    body: [
      "The core challenge was making AI feel approachable. The users were creators who wanted to make content faster, not learn a new tool. Every decision — from the onboarding flow to the information architecture — reduced the distance between opening the app and getting value out of it.",
      "Two rounds of flow redesigns and a rebuilt onboarding cut time-to-first-output by 30–40%. For a product I owned solo, the growth that followed was the clearest signal the design was working.",
    ],
    metrics: [
      { value: "200 → 10K+", label: "Users in 30 days" },
      { value: "30–40%", label: "Faster time-to-first-output" },
      { value: "35–45%", label: "Onboarding completion" },
      { value: "25–30%", label: "Session engagement" },
    ],
    screens: [
      { src: "/projects/genasis-login.jpg", title: "Welcome Back", tag: "Authentication" },
      { src: "/projects/genasis-pricing.jpg", title: "Pricing", tag: "Monetization" },
      { src: "/projects/genasis-audience.jpg", title: "Who Is This For?", tag: "Onboarding" },
      { src: "/projects/genasis-logo.png", title: "Identity", tag: "Brand System" },
    ],
  },
  {
    name: "SportsNStats",
    badge: "CONCEPT PROJECT",
    tagline: "Making Sports Analytics More Accessible",
    accent: "#5AD0C4",
    accentSoft: "#8FE3DA",
    cover: "/projects/sns-cover.png",
    roles: ["UX Research", "Information Architecture", "Product Design"],
    summary:
      "A concept project focused on rethinking how fans interact with sports data. The challenge wasn't gathering statistics — it was presenting large amounts of information in a way that felt intuitive, engaging, and easy to navigate.",
    body: [
      "I approached the project from the ground up, starting with user research and information architecture before moving into wireframing and visual design. A significant part of the process involved simplifying complex data structures, establishing clear content hierarchy, and designing interfaces that help users quickly find meaningful insights without feeling overwhelmed.",
      "It strengthened my understanding of designing data-heavy products — balancing usability with visual appeal and creating experiences where clarity becomes the most important feature. More than a sports platform, SportsNStats became an exercise in turning complexity into simplicity through thoughtful UX design.",
    ],
    metrics: null,
    // Lower screens are shown inside straight, front-facing device mockups
    // (matching the cover) instead of the tilted 3D-perspective renders.
    deviceFrames: true,
    screens: [
      { src: "/projects/sns-properties.png", title: "Find the Venue", tag: "Properties", device: "monitor" },
      { src: "/projects/sns-bookings.png", title: "Book the Hour", tag: "Bookings", device: "laptop" },
      { src: "/projects/sns-tournaments.png", title: "Run the Tournament", tag: "Tournaments", device: "laptop" },
      { src: "/projects/sns-onboarding.png", title: "Sign In Fast", tag: "Onboarding", device: "phone" },
      { src: "/projects/sns-error.png", title: "Miss, Gracefully", tag: "Error States", device: "phone" },
    ],
  },
];

/** Image with graceful accent-gradient fallback if the file is missing. */
function Frame({ src, alt, label, accent, accentSoft, className = "", sizes, contain = false }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 25%, ${accentSoft}40, transparent 60%), linear-gradient(140deg, ${accent}, #0E0E0E 88%)`,
        }}
      >
        <span className="font-funnel text-sm tracking-[0.2em] uppercase opacity-60">
          {label}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`${contain ? "object-contain p-6" : "object-cover"} ${className}`}
      onError={() => setErrored(true)}
    />
  );
}

/* -------------------------------------------------------------------------
 * Front-facing device mockups — straight & centered, styled to match the
 * SportsNStats cover (white desktop monitor, silver laptop, black phone).
 * Each wraps the flat app screenshot via <Frame> so the missing-image
 * fallback still works.
 * ---------------------------------------------------------------------- */

function DeviceCaption({ title, tag, accentSoft }) {
  return (
    <figcaption className="mt-4 flex items-baseline justify-center gap-2 text-center">
      <span className="text-sm sm:text-base tracking-wide">{title}</span>
      <span className="text-[11px] sm:text-xs tracking-wider" style={{ color: accentSoft }}>
        {tag}
      </span>
    </figcaption>
  );
}

/** Desktop monitor (iMac-style): white body, screen near top, chin + stand. */
function Monitor({ screen, accent, accentSoft }) {
  return (
    <figure className="flex flex-col items-center w-full">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* White body */}
        <div className="w-full rounded-2xl bg-gradient-to-b from-[#f4f4f4] to-[#dcdcdc] p-[10px] pb-6 shadow-2xl">
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#0E0E0E]">
            <Frame
              src={screen.src}
              alt={screen.title}
              label={screen.title}
              accent={accent}
              accentSoft={accentSoft}
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-top"
            />
          </div>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-[8px] sm:text-[10px] font-funnel tracking-[0.3em] text-gray-400">
              SPORTSNSTATS
            </span>
          </div>
        </div>
        {/* Neck */}
        <div className="h-7 w-12 bg-gradient-to-b from-[#d2d2d2] to-[#b4b4b4]" />
        {/* Foot */}
        <div className="h-2 w-40 rounded-full bg-[#c0c0c0]" />
      </div>
      <DeviceCaption title={screen.title} tag={screen.tag} accentSoft={accentSoft} />
    </figure>
  );
}

/** Laptop (MacBook-style): dark lid with screen, silver base + notch. */
function Laptop({ screen, accent, accentSoft }) {
  return (
    <figure className="flex flex-col items-center w-full">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Lid */}
        <div className="w-full rounded-t-xl bg-[#1b1b1d] p-[8px] shadow-2xl">
          <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-black">
            <Frame
              src={screen.src}
              alt={screen.title}
              label={screen.title}
              accent={accent}
              accentSoft={accentSoft}
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-top"
            />
          </div>
        </div>
        {/* Base */}
        <div className="relative w-[112%] max-w-none h-3 rounded-b-lg bg-gradient-to-b from-[#cfcfcf] to-[#9c9c9c]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-b-md bg-[#b6b6b6]" />
        </div>
      </div>
      <DeviceCaption title={screen.title} tag={screen.tag} accentSoft={accentSoft} />
    </figure>
  );
}

/** Phone (iPhone-style): black body, rounded screen, dynamic-island pill. */
function Phone({ screen, accent, accentSoft }) {
  return (
    <figure className="flex flex-col items-center w-full">
      <div className="relative w-[180px] max-w-full aspect-[9/19] rounded-[2.2rem] bg-black p-[8px] shadow-2xl">
        <div className="relative w-full h-full rounded-[1.7rem] overflow-hidden bg-white">
          <Frame
            src={screen.src}
            alt={screen.title}
            label={screen.title}
            accent={accent}
            accentSoft={accentSoft}
            sizes="180px"
            className="object-center"
          />
        </div>
        {/* Dynamic island */}
        <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black z-10" />
      </div>
      <DeviceCaption title={screen.title} tag={screen.tag} accentSoft={accentSoft} />
    </figure>
  );
}

/** Lays SportsNStats screens out as straight, centered device mockups. */
function DeviceGallery({ project }) {
  const monitors = project.screens.filter((s) => s.device === "monitor");
  const laptops = project.screens.filter((s) => s.device === "laptop");
  const phones = project.screens.filter((s) => s.device === "phone");

  return (
    <div className="flex flex-col items-center gap-14 md:gap-20">
      {monitors.map((s, i) => (
        <motion.div key={s.title} {...reveal} transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }} className="w-full flex justify-center">
          <Monitor screen={s} accent={project.accent} accentSoft={project.accentSoft} />
        </motion.div>
      ))}

      {laptops.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 w-full place-items-center">
          {laptops.map((s, i) => (
            <motion.div key={s.title} {...reveal} transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }} className="w-full flex justify-center">
              <Laptop screen={s} accent={project.accent} accentSoft={project.accentSoft} />
            </motion.div>
          ))}
        </div>
      )}

      {phones.length > 0 && (
        <div className="grid grid-cols-2 gap-8 sm:gap-12 w-full place-items-center max-w-2xl">
          {phones.map((s, i) => (
            <motion.div key={s.title} {...reveal} transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }} className="flex justify-center">
              <Phone screen={s} accent={project.accent} accentSoft={project.accentSoft} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
};

/** A single case study: cover + meta, optional metrics, narrative, gallery. */
function CaseStudy({ project }) {
  return (
    <div className="w-full max-w-6xl flex flex-col gap-14 md:gap-20">
      {/* FEATURED ------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Cover */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="group relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl order-1"
        >
          <Frame
            src={project.cover}
            alt={`${project.name} — hero`}
            label={project.name}
            accent={project.accent}
            accentSoft={project.accentSoft}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="transition-transform duration-700 group-hover:scale-105"
          />
          <span
            className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-[11px] sm:text-xs tracking-widest"
            style={{ color: project.accentSoft }}
          >
            {project.badge}
          </span>
        </motion.div>

        {/* Meta */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col order-2"
        >
          <h3 className="font-funnel text-4xl sm:text-5xl md:text-6xl font-light leading-none">
            {project.name}
          </h3>
          <p
            className="mt-3 text-sm sm:text-base tracking-wide"
            style={{ color: project.accentSoft }}
          >
            {project.tagline}
          </p>

          {/* Role chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.roles.map((r) => (
              <span
                key={r}
                className="px-3 py-1 rounded-full border border-white/15 text-xs tracking-wide text-gray-300"
              >
                {r}
              </span>
            ))}
          </div>

          <p className="mt-6 text-sm sm:text-base text-gray-300 leading-relaxed max-w-md">
            {project.summary}
          </p>
        </motion.div>
      </div>

      {/* METRICS -------------------------------------------------------- */}
      {project.metrics?.length ? (
        <motion.div
          {...reveal}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/10"
        >
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="bg-[#141414] px-5 py-7 md:px-6 md:py-9 flex flex-col gap-2"
            >
              <span
                className="font-funnel text-2xl sm:text-3xl md:text-4xl font-light"
                style={{ color: project.accent }}
              >
                {m.value}
              </span>
              <span className="text-xs sm:text-sm text-gray-400 leading-snug">
                {m.label}
              </span>
            </div>
          ))}
        </motion.div>
      ) : null}

      {/* NARRATIVE ------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {project.body.map((para, i) => (
          <motion.p
            key={i}
            {...reveal}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
            className="text-sm sm:text-base text-gray-300 leading-relaxed"
          >
            {para}
          </motion.p>
        ))}
      </div>

      {/* SCREEN GALLERY ------------------------------------------------- */}
      <div className="flex flex-col gap-8">
        <motion.h4
          {...reveal}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-sm tracking-[0.25em] text-gray-500 uppercase"
        >
          The Work
        </motion.h4>

        {project.deviceFrames ? (
          <DeviceGallery project={project} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {project.screens.map((screen, i) => (
              <motion.figure
                key={screen.title}
                {...reveal}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
                  <Frame
                    src={screen.src}
                    alt={`${project.name} — ${screen.title}`}
                    label={screen.title}
                    accent={project.accent}
                    accentSoft={project.accentSoft}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    contain={screen.contain}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-2">
                  <span className="text-sm sm:text-base tracking-wide">
                    {screen.title}
                  </span>
                  <span
                    className="text-[11px] sm:text-xs tracking-wider"
                    style={{ color: project.accentSoft }}
                  >
                    {screen.tag}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Discography() {
  return (
    <section
      id="discography"
      className="h-auto text-white flex flex-col items-center px-6 py-16 md:py-20"
    >
      {/* Heading */}
      <motion.div
        {...reveal}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl flex flex-col items-center text-center"
      >
        <span className="text-base sm:text-xl tracking-wider">DISCOGRAPHY</span>
        <span className="mt-3 text-xs sm:text-sm tracking-[0.25em] text-gray-500 uppercase">
          Selected Work · Case Studies
        </span>
      </motion.div>

      <div className="mt-10 md:mt-14 w-full flex flex-col items-center">
        {projects.map((project, i) => (
          <Fragment key={project.name}>
            {i > 0 && (
              <div className="w-full max-w-6xl my-14 md:my-20 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[11px] tracking-[0.3em] text-gray-600 uppercase">
                  More Work
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}
            <CaseStudy project={project} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
