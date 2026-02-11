import AboutZip from "@/components/AboutZip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Zip - S-Twins Auto Parts",
  description: "S-Twins Auto Parts: quality used car parts with Australia-wide delivery. Learn about our service and Capricorn partnership.",
  alternates: { canonical: "https://stwins.com.au/about-zip" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "About Zip - S-Twins", url: "https://stwins.com.au/about-zip", type: "website" },
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
