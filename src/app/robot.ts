import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://stwins.com.au";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/*"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
