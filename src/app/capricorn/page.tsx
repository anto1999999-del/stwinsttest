import CapricornHero from "@/components/CapricornHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capricorn - S-Twins Auto Parts",
  description: "S-Twins is a Capricorn member. Quality parts and workshop services for the automotive industry.",
  alternates: { canonical: "https://stwins.com.au/capricorn" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Capricorn - S-Twins", url: "https://stwins.com.au/capricorn", type: "website" },
};

export default function Capricorn() {
  return <CapricornHero />;
}
