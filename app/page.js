"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import KeyNotes from "@/components/KeyNotes";
import Discography from "@/components/Discography";
import SignatureTags from "@/components/SignatureTags";
import Playlist from "@/components/Playlist";
import PortfolioScrollAnimation from "@/components/PortfolioScrollAnimation";

export default function Home() {
  const { scrollYProgress } = useScroll();

  // px-12 → px-0 animation
  const paddingX = useTransform(scrollYProgress, [0, 1], ["488px", "0px"]);
  // (px-12 = 48px)

  return (
    <>
      {/* Entire landing page */}
      <div className="bg-[#0E0E0E] overflow-x-hidden font-outfit">
        <div className="fixed w-full px-24 py-12 z-50">
          <Navbar />
        </div>

        <Hero />
        <KeyNotes />
        <Discography />
        <SignatureTags />
        <Playlist />
      </div>

      {/* Scroll animation OUTSIDE and ABOVE the page */}
      <motion.div
        style={{ paddingLeft: paddingX, paddingRight: paddingX }}
        className="relative z-[9999] bg-[#0E0E0E]"
      >
        <PortfolioScrollAnimation />
      </motion.div>
    </>
  );
}
