"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

// Parent stagger
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// Each line entrance
const lineAnim = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const items = [
  {
    id: "craft",
    prefix: "DIGITAL EXPERIENCE C",
    word: "RAFT",
    suffix: "ING",
    icon: "/raft.svg",
    bg: "#1542A1",
    hoverColor: "#9CD7F9",
    align: "md:pl-12",
    space: "",
  },
  {
    id: "direction",
    prefix: "VISUAL ",
    word: "DIRECTION",
    suffix: " SETTING",
    icon: "/direction.svg",
    bg: "#E23535",
    hoverColor: "#FF8383",
    align: "md:pl-52",
    space: "mx-1 md:mx-2",
  },
  {
    id: "identity",
    prefix: "BRAND ",
    word: "IDENTITY",
    suffix: " ARCHITECTURE",
    icon: "/identity.svg",
    bg: "#F2B61F",
    hoverColor: "#FFE481",
    align: "md:pl-20",
    space: "mx-1 md:mx-2",
  },
  {
    id: "flows",
    prefix: "HUMAN-CENTERED ",
    word: "FLOW",
    suffix: "S",
    icon: "/flow.svg",
    bg: "#077301",
    hoverColor: "#A1F09D",
    align: "md:pl-56",
    space: "ml-1 md:ml-2",
  },
  {
    id: "logic",
    prefix: "",
    word: "DESIGN ",
    suffix: "LOGIC & STRUCTURE",
    icon: "/structure.svg",
    bg: "#894BC7",
    hoverColor: "#DCC0F7",
    align: "md:pr-4",
    space: "px-2 md:px-4",
  },
];

function Line({ item, isMobile }) {
  const lineRef = useRef(null);
  // Central viewport band: a line counts as "in view" only while it crosses the
  // middle of the screen. On mobile this drives the icon/colour reveal as you
  // scroll (replacing hover); the highlight tracks the line through the centre.
  const inView = useInView(lineRef, { margin: "-45% 0px -45% 0px" });
  const [hovered, setHovered] = useState(false);

  const active = isMobile ? inView : hovered;

  return (
    <motion.div
      ref={lineRef}
      variants={lineAnim}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ color: active ? item.hoverColor : "white" }}
      className={`block text-center md:flex md:justify-center py-3 md:py-2 transition-colors duration-500 ease-out tracking-wider ${item.align}`}
    >
      {item.prefix}

      <span className={`relative inline-flex items-center ${item.space}`}>
        <span
          className={`relative z-0 transition-all duration-300 ${
            active ? "opacity-0" : "opacity-100"
          }`}
        >
          {item.word}
        </span>

        {/* Reveal layer — icon + coloured pill */}
        <span
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ease-out ${
            active ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <img
            src={item.icon}
            alt=""
            aria-hidden="true"
            className="absolute z-12 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          />
          <span
            className="relative px-2 rounded-[55px] font-semibold"
            style={{ backgroundColor: item.bg, color: item.bg, fontSize: "0.9em" }}
          >
            {item.word}
          </span>
        </span>
      </span>

      {item.suffix}
    </motion.div>
  );
}

export default function KeyNotes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section
      id="keynotes"
      className="h-auto md:h-screen text-white flex flex-col items-center justify-center px-4 py-16 md:py-0"
    >
      <div className="text-base sm:text-xl tracking-wider">KEY NOTES</div>

      {/* Stagger container */}
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="mt-12 md:mt-20 text-2xl sm:text-3xl md:text-5xl font-semibold w-full max-w-5xl leading-tight md:leading-normal"
      >
        {items.map((item) => (
          <Line key={item.id} item={item} isMobile={isMobile} />
        ))}
      </motion.div>
    </section>
  );
}
