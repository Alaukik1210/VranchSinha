import Hero from "@/components/Hero";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import KeyNotes from "@/components/KeyNotes";
import Discography from "@/components/Discography";
import SignatureTags from "@/components/SignatureTags";
import Playlist from "@/components/Playlist";
import Production from "@/components/Production";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-[#0E0E0E] overflow-x-hidden font-outfit">
      <div className="fixed w-full px-24 py-12 z-50">
      <Navbar />
      </div>
      <Hero/>
      <KeyNotes/>
     <Discography/>
     <SignatureTags/>
     <Playlist/>
     <Production/>
     <Footer/>
    </div>
  );
}
