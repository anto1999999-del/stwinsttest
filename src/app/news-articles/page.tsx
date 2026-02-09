import NewsArticles from "@/components/NewsArticles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Articles - S-Twins Auto Parts",
  description: "Stay updated with the latest news, articles, and tips about car parts, maintenance, and automotive industry insights from S-Twins.",
  alternates: {
    canonical: "https://stwins.com.au/news-articles",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "News & Articles - S-Twins Auto Parts",
    description: "Stay updated with the latest news, articles, and tips about car parts and automotive industry insights.",
    url: "https://stwins.com.au/news-articles",
  },
};

export default function NewsArticlesPage() {
  return <NewsArticles />;
}
