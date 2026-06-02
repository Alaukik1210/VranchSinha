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

  // Inset the rising footer panel as the page scrolls — scaled down on mobile.
  const paddingX = useTransform(scrollYProgress, [0, 1], ["40px", "0px"]);

  return (
    <>
      {/* Entire landing page */}
      <div className="bg-[#0E0E0E] overflow-x-hidden font-outfit">
        <div className="fixed top-0 left-0 w-full px-5 sm:px-8 md:px-12 lg:px-24 py-6 md:py-10 z-50">
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
