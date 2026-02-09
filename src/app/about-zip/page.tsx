import AboutZip from "@/components/AboutZip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Zip - S-Twins Auto Parts",
  description: "Learn about S-Twins partnership with Zip and our payment solutions for customers.",
  alternates: {
    canonical: "https://stwins.com.au/about-zip",
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
    title: "About Zip - S-Twins Auto Parts",
    description: "Learn about S-Twins partnership with Zip and our payment solutions.",
    url: "https://stwins.com.au/about-zip",
  },
};

export default function AboutZipPage() {
  return (
    <>
      <Header />
      <AboutZip />
      <Footer />
    </>
  );
}
