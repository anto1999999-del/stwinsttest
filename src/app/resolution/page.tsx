import ResolutionHero from "@/components/ResolutionHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resolution Centre - S-Twins Auto Parts",
  description: "S-Twins resolution centre. Disputes, returns and customer support for parts and orders.",
  alternates: { canonical: "https://stwins.com.au/resolution" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Resolution Centre - S-Twins", url: "https://stwins.com.au/resolution", type: "website" },
};

export default function Resolution() {
  return <ResolutionHero />;
}
