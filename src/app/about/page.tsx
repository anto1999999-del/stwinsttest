import AboutHero from "@/components/AboutHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - S-Twins Auto Parts",
  description: "Learn about S-Twins, Sydney's specialist dismantler for Chrysler, Jeep & Dodge models. Over 30 years of experience providing quality used auto parts with warranty and fast delivery.",
  alternates: {
    canonical: "https://stwins.com.au/about",
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
    title: "About Us - S-Twins Auto Parts",
    description: "Learn about S-Twins, Sydney's specialist dismantler for Chrysler, Jeep & Dodge models. Over 30 years of experience.",
    url: "https://stwins.com.au/about",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
    </main>
  );
}
