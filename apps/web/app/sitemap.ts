import type { MetadataRoute } from "next";
import { games, stories, worksheets } from "@/lib/data/content";
import { lessons } from "@/lib/data/lessons";

/** فقط صفحات عمومی؛ محیط کودک و والدین هرگز در Sitemap نیستند */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kidsworld.example";
  const now = new Date();
  const fixed = ["", "/learn", "/worksheets", "/games", "/stories", "/pricing", "/privacy"].map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  const dynamic = [
    ...worksheets.map((w) => `/worksheets/${w.slug}`),
    ...games.map((g) => `/games/${g.slug}`),
    ...stories.map((s) => `/stories/${s.slug}`),
    ...lessons.map((l) => `/learn/${l.slug}`),
  ].map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...fixed, ...dynamic];
}
