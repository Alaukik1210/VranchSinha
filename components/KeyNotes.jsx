"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function KeyNotes() {
  const [hovered, setHovered] = useState(null);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Parent animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Each line animation
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
      align: "pl-2 md:pl-12",
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
      align: "pl-6 md:pl-52",
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
      align: "pl-4 md:pl-20",
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
      align: "pl-8 md:pl-56",
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
      align: "pr-2 md:pr-4",
      space: "px-2 md:px-4",
    },
  ];

  return (
    <div className="h-auto md:h-screen text-white flex flex-col items-center">
      <div className="pt-8 text-xl mt-12 tracking-wider">KEY NOTES</div>

      {/* Stagger container */}
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="mt-12 md:mt-52 text-3xl md:text-5xl font-semibold   "
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={lineAnim}
            className={`flex justify-center py-2 transition-colors duration-500 ease-out tracking-wider ${item.align}`}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ color: hovered === item.id ? item.hoverColor : "white" }}
          >
            {item.prefix}

            <span className={`relative inline-flex items-center ${item.space}`}>
              <span
  className={`relative z-0 transition-all duration-300 ${
    hovered === item.id ? "opacity-0" : "opacity-100"
  }`}
>
  {item.word}
</span>


              {/* Hover layer */}
              <span
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ease-out ${
                  hovered === item.id ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              >
                <img
                  src={item.icon}
                  className="absolute z-12"
                  style={{
                    width: "150px",
                    height: "150px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <span
                  className="relative px-2 rounded-[55px] font-semibold"
                  style={{
                    backgroundColor: item.bg,
                    color: item.bg,
                    fontSize: "0.9em",
                  }}
                >
                  {item.word}
                </span>
              </span>
            </span>

            {item.suffix}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
