import { Box } from "@chakra-ui/react";
import Header from "@/components/Header";
import LocationPage from "@/components/LocationPage";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formattedLocation = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
  
  return {
    title: `${formattedLocation} Location - S-Twins Auto Parts`,
    description: `Visit S-Twins ${formattedLocation} location for premium car parts. Quality used auto parts with warranty and expert service.`,
    alternates: {
      canonical: `https://stwins.com.au/location/${slug}`,
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
      title: `${formattedLocation} Location - S-Twins Auto Parts`,
      description: `Visit S-Twins ${formattedLocation} location for premium car parts and expert service.`,
      url: `https://stwins.com.au/location/${slug}`,
    },
  };
}

export default async function LocationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Box>
      <Header />
      <LocationPage slug={slug} />
      <Footer />
    </Box>
  );
}
