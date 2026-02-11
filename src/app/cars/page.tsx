import CarsHero from "@/components/CarsHero";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cars for Parts & Wrecking - S-Twins Auto Parts",
  description: "Browse our wrecking cars and quality used parts. Chrysler, Jeep, Dodge and more. Stock numbers, photos and fast quotes. S-Twins Auto Parts.",
  alternates: { canonical: "https://stwins.com.au/cars" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Cars for Parts - S-Twins", url: "https://stwins.com.au/cars", type: "website" },
};

export default function CarsPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <CarsHero />
      </Suspense>
    </main>
  );
}
