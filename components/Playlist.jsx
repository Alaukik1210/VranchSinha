"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const playlists = [
  { id: 1, name: "ROGUE SAINTS", img: "/rougesaints.svg" },
  { id: 2, name: "MAXPAID", img: "/maxpaid.svg" },
  { id: 3, name: "THE BIG BOOK BOX", img: "/tbbb.svg" },
  { id: 4, name: "NEERSENSE", img: "/neersence.svg" },
];

export default function Playlist() {
  return (
    <section
      id="playlist"
      className="h-auto md:min-h-screen text-white flex flex-col items-center px-6 py-16 md:py-20"
    >
      <div className="text-base sm:text-xl mt-6 tracking-wider pb-8 md:pb-12">
        PLAY-LISTS
      </div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-6xl">
        {playlists.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
            className="flex flex-col items-center"
          >
            {/* Card Wrapper (Hover group) */}
            <div className="relative w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden shadow-lg group transition-transform duration-300 hover:scale-[1.03]">
              <Image
                src={item.img}
                alt={item.name}
                width={500}
                height={500}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-30 group-hover:scale-110"
              />

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/90 rounded-full flex justify-center items-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <div className="w-0 h-0 border-t-[10px] md:border-t-[12px] border-t-transparent border-b-[10px] md:border-b-[12px] border-b-transparent border-l-[18px] md:border-l-[20px] border-l-black ml-1" />
                </div>
              </div>
            </div>

            {/* Name */}
            <p className="mt-6 md:mt-8 text-xs sm:text-sm md:text-xl tracking-wide text-center">
              {item.name}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
