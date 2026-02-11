import { Box } from "@chakra-ui/react";
import Header from "@/components/Header";
import Locations from "@/components/Locations";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations - S-Twins Auto Parts",
  description: "Visit S-Twins: Smithfield NSW 2164 and Tuggerah NSW 2259. Quality used car parts, expert help and Australia-wide shipping.",
  alternates: { canonical: "https://stwins.com.au/locations" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Locations - S-Twins", url: "https://stwins.com.au/locations", type: "website" },
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
