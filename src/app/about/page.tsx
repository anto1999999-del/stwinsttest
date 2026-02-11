import AboutHero from "@/components/AboutHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - S-Twins Auto Parts",
  description:
    "Learn about S-Twins: Sydney's leading used car parts specialists. Chrysler, Jeep, Dodge parts with warranty. Expert team and Australia-wide delivery.",
  alternates: { canonical: "https://stwins.com.au/about" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: "About Us - S-Twins Auto Parts",
    url: "https://stwins.com.au/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
    </main>
  );
}
