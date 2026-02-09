import ResolutionHero from "@/components/ResolutionHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resolution Center - S-Twins Auto Parts",
  description: "S-Twins Resolution Center. Get help with orders, returns, warranties, and customer service inquiries.",
  alternates: {
    canonical: "https://stwins.com.au/resolution",
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
    title: "Resolution Center - S-Twins Auto Parts",
    description: "S-Twins Resolution Center. Get help with orders, returns, warranties, and customer service.",
    url: "https://stwins.com.au/resolution",
  },
};

export default function Resolution() {
  return <ResolutionHero />;
}
