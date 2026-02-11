import Policy from "@/components/Policy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy - S-Twins Auto Parts",
  description: "S-Twins policies: returns, warranty, privacy and terms. Quality used car parts with clear policies.",
  alternates: { canonical: "https://stwins.com.au/policy" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Policy - S-Twins", url: "https://stwins.com.au/policy", type: "website" },
};

export default function PolicyPage() {
  return (
    <main>
      <Policy />
    </main>
  );
}
