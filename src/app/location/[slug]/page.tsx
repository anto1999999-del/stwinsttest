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
  const base = "https://stwins.com.au";
  const canonical = `${base}/location/${slug}`;
  const title = slug === "smithfield" ? "Smithfield Location - S-Twins" : slug === "tuggerah" ? "Tuggerah Location - S-Twins" : `Location ${slug} - S-Twins`;
  return {
    title,
    description: `S-Twins Auto Parts ${slug} location. Quality used car parts, expert help. Visit or get Australia-wide delivery.`,
    alternates: { canonical },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: { title, url: canonical, type: "website" },
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
