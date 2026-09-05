"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const shots = [
  {
    src: "/projects/afa/afa-history.jpg",
    caption: "Scroll-driven chapters — '78, '86 and '22, one star at a time",
  },
  {
    src: "/projects/afa/afa-trophies.jpg",
    caption: "The trophy cabinet, scrubbed horizontally on scroll",
  },
  {
    src: "/projects/afa/afa-squad.jpg",
    caption: "The full 26-man squad wall",
  },
  {
    src: "/projects/afa/afa-collage.jpg",
    caption: "The send-off — carry the dream of forty-six million",
  },
];

export default function CaseStudy() {
  return (
    <section
      id="playlist"
      className="h-auto text-white flex flex-col items-center px-6 py-16 md:py-20"
    >
      <div className="text-base sm:text-xl mt-6 tracking-wider pb-8 md:pb-12">
        PLAY-LISTS
      </div>

      <div className="w-full max-w-6xl">
        {/* Title row */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <p className="text-xs sm:text-sm tracking-[0.25em] text-gray-500 uppercase mb-3">
              FEATURED BUILD · WEBGL
            </p>
            <h2 className="font-funnel text-4xl sm:text-5xl md:text-6xl font-light leading-none">
              La Scaloneta
            </h2>
            <p className="mt-3 text-sm sm:text-base tracking-wide text-[#9CC5E8] max-w-md">
              An immersive 3D tribute to the Argentina national football team.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-xs tracking-widest border border-white/15 rounded-full px-4 py-2 text-gray-300">
              SHIPPED IN ONE DAY
            </span>
            <a
              href="https://afatribute.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm tracking-wide border-b border-white/20 pb-1 transition-colors hover:border-current text-[#9CC5E8]"
            >
              afatribute.vercel.app
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </motion.div>

        {/* Hero shot */}
        <motion.a
          href="https://afatribute.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          {...reveal}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="block mt-10 rounded-2xl md:rounded-3xl overflow-hidden group"
        >
          <Image
            src="/projects/afa/afa-hero.jpg"
            alt="La Scaloneta — WebGL hero with a 3D gold AFA crest"
            width={1920}
            height={938}
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.015]"
          />
        </motion.a>

        {/* Story + meta */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-10 md:mt-14 grid md:grid-cols-3 gap-8 md:gap-12"
        >
          <div className="md:col-span-2 text-sm sm:text-base leading-relaxed text-gray-300 space-y-4">
            <p>
              Built from a blank Vite folder in the morning to a live Vercel
              deploy by midnight. No mockups — designed directly in the
              browser, one section at a time.
            </p>
            <p>
              A gold AFA crest modelled and lit in Three.js anchors the hero,
              while GSAP ScrollTrigger drives the whole story: a cinematic
              intro gate, chapter cards for the &apos;78, &apos;86 and &apos;22
              World Cups, a horizontally-scrubbed trophy cabinet, the full
              26-man squad wall, and a live &quot;Vamos&quot; cheer counter
              backed by Vercel KV so every visitor adds to the roar.
            </p>
          </div>
          <div className="text-xs sm:text-sm space-y-5">
            <div>
              <p className="tracking-widest text-gray-500 mb-1">ROLE</p>
              <p className="text-gray-300">Design + build, solo</p>
            </div>
            <div>
              <p className="tracking-widest text-gray-500 mb-1">STACK</p>
              <p className="text-gray-300">
                Three.js · GSAP ScrollTrigger · Vite · Vercel KV
              </p>
            </div>
            <div>
              <p className="tracking-widest text-gray-500 mb-1">TIMELINE</p>
              <p className="text-gray-300">24 hours, concept to deploy</p>
            </div>
          </div>
        </motion.div>

        {/* Supporting shots */}
        <div className="mt-10 md:mt-14 grid sm:grid-cols-2 gap-6 md:gap-8">
          {shots.map((shot, i) => (
            <motion.figure
              key={shot.src}
              {...reveal}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: (i % 2) * 0.1,
              }}
            >
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src={shot.src}
                  alt={shot.caption}
                  width={1400}
                  height={684}
                  sizes="(max-width: 640px) 100vw, 560px"
                  className="w-full h-auto transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-gray-400">
                {shot.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
