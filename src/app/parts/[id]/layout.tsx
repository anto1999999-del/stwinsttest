import type { Metadata } from "next";
import { axiosInstance } from "@/shared/api/instance";

interface Product {
  id: string;
  title: string;
  make: string;
  model: string;
  year?: number;
  oemnumber?: string;
}

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const response = await axiosInstance.get(`/parts/${id}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Product Not Found - S-Twins",
      alternates: {
        canonical: `https://stwins.com.au/parts/${id}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.title} for ${product.make} ${product.model}${product.year ? ` ${product.year}` : ""} - S-Twins`;
  const description = `Quality used ${product.title} for ${product.make} ${product.model}${product.year ? ` ${product.year}` : ""}. Tested second-hand part with 6-month warranty and fast Australia-wide delivery.${product.oemnumber ? ` OEM: ${product.oemnumber}.` : ""}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://stwins.com.au/parts/${id}`,
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
      title,
      description,
      url: `https://stwins.com.au/parts/${id}`,
      type: "product",
    },
  };
}

export default function PartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
