import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kidsworld.example";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/kids", "/parent", "/api"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
