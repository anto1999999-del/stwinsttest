import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarBrandPage from "@/components/CarBrandPage";
import { Box } from "@chakra-ui/react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ brandName: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandName } = await params;
  const formattedBrand = brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase();
  
  return {
    title: `${formattedBrand} Car Parts - S-Twins Auto Parts`,
    description: `Find quality used ${formattedBrand} car parts at S-Twins. Premium auto parts with warranty and fast Australia-wide delivery.`,
    alternates: {
      canonical: `https://stwins.com.au/brand/${brandName}`,
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
      title: `${formattedBrand} Car Parts - S-Twins Auto Parts`,
      description: `Find quality used ${formattedBrand} car parts with warranty and fast delivery.`,
      url: `https://stwins.com.au/brand/${brandName}`,
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { brandName } = await params;

  return (
    <Box>
      <Header />
      <CarBrandPage brandName={brandName} />
      <Footer />
    </Box>
  );
}
