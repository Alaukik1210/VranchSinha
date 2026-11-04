import { notFound } from "next/navigation";
import Nav from "@/components/site/Nav";
import CaseStudyPage from "@/components/site/CaseStudyPage";
import Contact from "@/components/site/Contact";
import { WORK, workBySlug } from "@/lib/work";

export function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = workBySlug(slug);
  if (!p) return {};
  return { title: `${p.name} | Vranch Sinha`, description: p.summary };
}

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const p = workBySlug(slug);
  if (!p) notFound();
  const i = WORK.indexOf(p);
  const next = WORK[(i + 1) % WORK.length];
  return (
    <main className="site min-h-screen">
      <Nav />
      <div className="relative z-10 bg-[var(--ink)] pb-px">
        <CaseStudyPage p={p} next={next} />
      </div>
      <Contact />
    </main>
  );
}
