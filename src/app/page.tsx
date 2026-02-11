import Hero from "@/components/Hero";
import CarGrid from "@/components/CarGrid";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WeBuyCars from "@/components/WeBuyCars";
import QuoteRequest from "@/components/QuoteRequest";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Car Parts & Auto Dismantler | S-Twins",
  description: "S-Twins offers premium used car parts for Chrysler, Jeep, Dodge, and more. Over 100,000 quality parts with warranty, fast Australia-wide delivery, and professional customer service. Expert support.",
  alternates: {
    canonical: "https://stwins.com.au/",
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
    title: "Premium Car Parts & Auto Dismantler | S-Twins",
    description: "S-Twins offers premium used car parts for Chrysler, Jeep, Dodge, and more. Over 100,000 quality parts with warranty, fast Australia-wide delivery.",
    url: "https://stwins.com.au/",
    type: "website",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <CarGrid />
      <Services />
      <Testimonials />
      <WeBuyCars />
      <QuoteRequest />
      <Footer />
    </main>
  );
}
