import { Box } from "@chakra-ui/react";
import Header from "@/components/Header";
import Locations from "@/components/Locations";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations - S-Twins Auto Parts",
  description: "Visit S-Twins locations in Smithfield NSW 2164 and Tuggerah NSW 2259. Find premium car parts, expert service, and quality used auto parts near you.",
  alternates: {
    canonical: "https://stwins.com.au/locations",
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
    title: "Locations - S-Twins Auto Parts",
    description: "Visit S-Twins locations in Smithfield and Tuggerah NSW. Find premium car parts and expert service.",
    url: "https://stwins.com.au/locations",
  },
};

export default function LocationsPage() {
  return (
    <Box>
      <Header />
      <Locations />
      <Footer />
    </Box>
  );
}
