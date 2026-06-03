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
    screens: [
      { src: "/projects/sns-properties.png", title: "Find the Venue", tag: "Properties" },
      { src: "/projects/sns-bookings.png", title: "Book the Hour", tag: "Bookings" },
      { src: "/projects/sns-tournaments.png", title: "Run the Tournament", tag: "Tournaments" },
      { src: "/projects/sns-onboarding.png", title: "Sign In Fast", tag: "Onboarding" },
      { src: "/projects/sns-error.png", title: "Miss, Gracefully", tag: "Error States" },
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
