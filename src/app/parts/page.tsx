// /root/s-twins/s-twins-web/src/app/parts/page.tsx
import { Suspense } from "react";
import PartsHeroClient from "./PartsHeroClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic"; // keeps this route fully dynamic

export const metadata: Metadata = {
  title: "Used Car Parts - Search & Buy | S-Twins Auto Parts",
  description: "Search over 100,000 quality used car parts. Chrysler, Jeep, Dodge and more. Warranty, Australia-wide delivery. Find your part at S-Twins.",
  alternates: { canonical: "https://stwins.com.au/parts" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Used Car Parts - S-Twins", url: "https://stwins.com.au/parts", type: "website" },
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
