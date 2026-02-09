import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://stwins.com.au";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/parts`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/cars`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/workshop`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/resolution`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/news-articles`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/locations`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/capricorn`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/about-zip`, changeFrequency: "yearly", priority: 0.4 },
  ];

  return staticRoutes;
}
