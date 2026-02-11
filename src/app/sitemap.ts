import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://stwins.com.au";

  // Static top-level pages. Add/remove as appropriate.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/parts`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/cars`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/workshop`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/about-zip`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/resolution`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/locations`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/capricorn`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/news-articles`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/policy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // If/when you want to add dynamic product URLs, fetch them here and map to:
  // { url: `${base}/parts/<id-or-slug>`, lastModified?: string|Date, changeFrequency?: 'daily'|'weekly'|..., priority?: number }
  // Make sure values match the union types exactly.

  return staticRoutes;
}
