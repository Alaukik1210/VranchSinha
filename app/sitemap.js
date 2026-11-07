import { WORK } from "@/lib/work";

const SITE = "https://vranchsinha.vercel.app";

export default function sitemap() {
  return [{ url: SITE }, ...WORK.map((w) => ({ url: `${SITE}/work/${w.slug}` }))];
}
