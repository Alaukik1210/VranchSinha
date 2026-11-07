import AboutSection from "@/components/site/AboutSection";
import EyeHero from "@/components/site/EyeHero";
import GlassNav from "@/components/site/GlassNav";
import Leadership from "@/components/site/Leadership";
import References from "@/components/site/References";
import SelectedWork from "@/components/site/SelectedWork";
import SignOff from "@/components/site/SignOff";

// v3 is being built section by section.
export default function Home() {
  return (
    <main className="site-v3">
      <GlassNav />
      <EyeHero />
      <SelectedWork />
      <AboutSection />
      <Leadership />
      <References />
      <SignOff />
    </main>
  );
}
