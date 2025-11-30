import Hero from "@/components/Hero";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import KeyNotes from "@/components/KeyNotes";
import Discography from "@/components/Discography";
import SignatureTags from "@/components/SignatureTags";
import Playlist from "@/components/Playlist";
import Production from "@/components/Production";
import Footer from "@/components/Footer";
import PortfolioScrollAnimation from "@/components/PortfolioScrollAnimation";


export default function Home() {
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
      <div className="relative z-[9999] bg-[#0E0E0E]">
        <PortfolioScrollAnimation />
      </div>
    </>
  );
}

