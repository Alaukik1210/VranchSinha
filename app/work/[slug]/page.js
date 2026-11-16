import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/site/CaseStudyPage";
import { WORK, workBySlug } from "@/lib/work";

// The site's share image; a page that sets its own share details has to name it again.
const IMAGE = { url: "/opengraph-image.jpg", width: 1200, height: 630 };

export function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = workBySlug(slug);
  if (!p) return {};
  const title = `${p.name}: ${p.story.title} | Vranch Sinha`;
  // A shared project link names the project, not just the portfolio.
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title, description: p.summary, url: `/work/${p.slug}`, siteName: "Vranch Sinha", type: "article", images: [IMAGE] },
    twitter: { card: "summary_large_image", title, description: p.summary, images: [IMAGE] },
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
