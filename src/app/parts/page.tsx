// /root/s-twins/s-twins-web/src/app/parts/page.tsx
import { Suspense } from "react";
import PartsHeroClient from "./PartsHeroClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic"; // keeps this route fully dynamic

export const metadata: Metadata = {
  title: "Car Parts - Premium Used Auto Parts | S-Twins",
  description: "Browse over 100,000 quality used car parts at S-Twins. Premium parts for Chrysler, Jeep, Dodge, and more. All parts include warranty and fast Australia-wide delivery.",
  alternates: {
    canonical: "https://stwins.com.au/parts",
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
    title: "Car Parts - Premium Used Auto Parts | S-Twins",
    description: "Browse over 100,000 quality used car parts. Premium parts for Chrysler, Jeep, Dodge, and more with warranty.",
    url: "https://stwins.com.au/parts",
  },
};

export default function PartsPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <PartsHeroClient />
      </Suspense>
    </main>
  );
}
