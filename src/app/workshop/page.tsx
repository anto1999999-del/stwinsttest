import WorkshopHero from "@/components/WorkshopHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshop Services - S-Twins Auto Parts",
  description: "Professional workshop fitting services at S-Twins. Expert installation of auto parts with warranty. Book your appointment today.",
  alternates: {
    canonical: "https://stwins.com.au/workshop",
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
    title: "Workshop Services - S-Twins Auto Parts",
    description: "Professional workshop fitting services at S-Twins. Expert installation of auto parts with warranty.",
    url: "https://stwins.com.au/workshop",
  },
};

export default function WorkshopPage() {
  return (
    <main>
      <WorkshopHero />
    </main>
  );
}
