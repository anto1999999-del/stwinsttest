import CarsHero from "@/components/CarsHero";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wrecking Cars - Featured Vehicles | S-Twins",
  description: "Browse our featured wrecking cars including American, Japanese, and Australian performance models. Premium wrecking cars available for parts at S-Twins.",
  alternates: {
    canonical: "https://stwins.com.au/cars",
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
    title: "Wrecking Cars - Featured Vehicles | S-Twins",
    description: "Browse our featured wrecking cars including American, Japanese, and Australian performance models.",
    url: "https://stwins.com.au/cars",
  },
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
