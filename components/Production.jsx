"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const items = [
  {
    id: 1,
    img: "/gdg.svg",
    title: "GOOGLE DEVELOPER GROUP BU",
    subtitle: "(UI/UX LEAD)",
    desc:
      "Joined as part of the junior team and helped organise 5 events in the first year, later became the UI/UX Lead and guided the team in organising 7 events in the second year.",
    gradient: "from-[#FBBC04]/25 to-transparent",
    stylee: "text-[#FBBC04]",
  },
  {
    id: 2,
    img: "/lex.svg",
    title: "LEXHACK",
    subtitle: "(DESIGN HEAD)",
    desc:
      "Created all design assets for a hackathon organised for law and engineering students, including the brand kit, posters, brachure, etc.",
    gradient: "from-[#F2B0F0]/25 to-transparent",
    stylee: "text-[#F2B0F0]",
  },
  {
    id: 3,
    img: "/sfcmun.svg",
    title: "SFCMUN",
    subtitle: "(EDITOR IN CHIEF)",
    desc:
      "Created magazines, posts as well as all the stationary required for as MUN",
    gradient: "from-[#06ACE1]/25 to-transparent",
    stylee: "text-[#06ACE1]",
  },
];

function ProductionCard({ item, index }) {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Per-card scroll progress drives a gentle parallax drift on the logo while
  // the card travels through the viewport. Mobile only — desktop keeps the
  // hover interaction clean and static.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [22, -22]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.12 }}
      className="liquid-glass [backdrop-filter:blur(7px)_saturate(1.8)_url(#liquid-lens)] [-webkit-backdrop-filter:blur(16px)_saturate(1.6)] group relative w-full max-w-[420px] aspect-[9/10] p-8 md:p-10 rounded-3xl overflow-hidden flex flex-col items-center justify-center"
    >
      {/* VERY BLURRY BOTTOM GRADIENT — always on mobile, hover-reveal on desktop */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[80%] rounded-t-full bg-gradient-to-t ${item.gradient} opacity-100 md:opacity-0 md:group-hover:opacity-100 blur-3xl transition-all duration-700`}
      />

      {/* Centered content column. justify-center keeps logo + heading vertically
          centred; when the body reveals on hover the column grows and the whole
          block re-centres, nudging the logo/heading up. */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          style={isMobile ? { y: logoY } : undefined}
          className="flex items-center justify-center transition-transform duration-500 md:group-hover:-translate-y-1"
        >
          <Image
            src={item.img}
            alt={`icon-${item.id}`}
            width={160}
            height={160}
            sizes="(max-width: 640px) 30vw, 160px"
            className="object-contain w-24 sm:w-28 md:w-32 h-auto"
          />
        </motion.div>

        {/* Heading — always visible (centred with the logo by default) */}
        <p className="font-semibold text-base md:text-lg mt-4">{item.title}</p>
        <p className={item.stylee}>{item.subtitle}</p>

        {/* Body — open on mobile; collapses to zero height and reveals on hover
            for desktop via the grid-rows 0fr→1fr animation. */}
        <div className="grid w-full grid-rows-[1fr] opacity-100 transition-all duration-500 ease-out md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100">
          <div className="overflow-hidden">
            <p className="text-sm mt-3 px-2 md:px-4 text-gray-200">{item.desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Production() {
  return (
    <section
      id="production"
      className="h-auto md:h-screen text-white flex flex-col z-10 items-center px-6 py-16 md:py-0 md:justify-center"
    >
      <div className="text-base sm:text-xl tracking-wider">PRODUCTION</div>

      <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-6xl place-items-center">
        {items.map((item, index) => (
          <ProductionCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
