import NewsArticles from "@/components/NewsArticles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Articles - S-Twins Auto Parts",
  description: "News and articles about used car parts, Chrysler, Jeep, Dodge and automotive tips from S-Twins.",
  alternates: { canonical: "https://stwins.com.au/news-articles" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "News & Articles - S-Twins", url: "https://stwins.com.au/news-articles", type: "website" },
};

export default function NewsArticlesPage() {
  return <NewsArticles />;
}
