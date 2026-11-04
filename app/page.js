import Intro from "@/components/site/Intro";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Statement from "@/components/site/Statement";
import Work from "@/components/site/Work";
import Capabilities from "@/components/site/Capabilities";
import Identity from "@/components/site/Identity";
import Side from "@/components/site/Side";
import About from "@/components/site/About";
import Contact from "@/components/site/Contact";

export default function Home() {
  return (
    <main className="site">
      <Intro />
      <Nav />
      {/* Everything above the footer sits on its own layer, so it can lift
          off the fixed contact screen underneath. */}
      <div className="relative z-10 bg-[var(--ink)]">
        <Hero />
        <Statement />
        <Work />
        <Capabilities />
        <Identity />
        <Side />
        <About />
      </div>
      <Contact />
    </main>
  );
}
