import CapricornHero from "@/components/CapricornHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capricorn - S-Twins Auto Parts",
  description: "S-Twins partners with Capricorn to provide quality auto parts and services. Stronger with Capricorn.",
  alternates: {
    canonical: "https://stwins.com.au/capricorn",
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
    title: "Capricorn - S-Twins Auto Parts",
    description: "S-Twins partners with Capricorn to provide quality auto parts and services.",
    url: "https://stwins.com.au/capricorn",
  },
};

export default function Capricorn() {
  return <CapricornHero />;
}
