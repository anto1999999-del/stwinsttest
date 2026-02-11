import ContactHero from "@/components/ContactHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - S-Twins Auto Parts",
  description: "Contact S-Twins for premium car parts. Call (02) 9604 7366 or visit our locations in Smithfield NSW 2164 and Tuggerah NSW 2259. Get expert help finding the parts you need. We're here to help.",
  alternates: {
    canonical: "https://stwins.com.au/contact",
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
    title: "Contact Us - S-Twins Auto Parts",
    description: "Contact S-Twins for premium car parts. Call (02) 9604 7366 or visit our locations in Smithfield and Tuggerah.",
    url: "https://stwins.com.au/contact",
  },
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
    </main>
  );
}
