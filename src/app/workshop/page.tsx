import WorkshopHero from "@/components/WorkshopHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshop - S-Twins Auto Parts",
  description: "S-Twins workshop services. Quality repairs and parts fitting. Expert team for Chrysler, Jeep, Dodge and more.",
  alternates: { canonical: "https://stwins.com.au/workshop" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Workshop - S-Twins", url: "https://stwins.com.au/workshop", type: "website" },
};

export default function WorkshopPage() {
  return (
    <main>
      <WorkshopHero />
    </main>
  );
}
