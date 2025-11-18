import Hero from "@/components/Hero";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="bg-[#0E0E0E] h-screen">
      {/* <Logo/> */}
      <div className="fixed w-full px-24 py-12">

      <Navbar />
      </div>
      <Hero/>
     
    </div>
  );
}
