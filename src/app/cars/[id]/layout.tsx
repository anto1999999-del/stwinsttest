import type { Metadata } from "next";
import { axiosInstance } from "@/shared/api/instance";

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  stockNo: string;
}

async function fetchVehicle(id: string): Promise<Vehicle | null> {
  try {
    const response = await axiosInstance.get(`/cars/${id}`);
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
  const vehicle = await fetchVehicle(id);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found - S-Twins",
      alternates: {
        canonical: `https://stwins.com.au/cars/${id}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model || ""} Wrecking - S-Twins Auto Parts`;
  const description = `Browse parts from ${vehicle.year} ${vehicle.make} ${vehicle.model || ""} wrecking car. Stock No: ${vehicle.stockNo}. Quality used auto parts with warranty at S-Twins.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://stwins.com.au/cars/${id}`,
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
      url: `https://stwins.com.au/cars/${id}`,
      type: "website",
    },
  };
}

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
