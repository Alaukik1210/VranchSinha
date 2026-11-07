import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/site/CaseStudyPage";
import { WORK, workBySlug } from "@/lib/work";

export function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = workBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name}: ${p.story.title} | Vranch Sinha`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
  };
}

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const p = workBySlug(slug);
  if (!p) notFound();
  return (
    <main className="site-v3 min-h-screen">
      <CaseStudyPage key={p.slug} p={p} others={WORK.filter((w) => w !== p)} />
    </main>
  );
}
