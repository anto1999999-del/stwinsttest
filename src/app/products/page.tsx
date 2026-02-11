import Products from "./Products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products - S-Twins Auto Parts",
  description: "Browse S-Twins products. Quality used car parts for Chrysler, Jeep, Dodge and more. Warranty and Australia-wide delivery.",
  alternates: { canonical: "https://stwins.com.au/products" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Products - S-Twins", url: "https://stwins.com.au/products", type: "website" },
};

export default function ProductsAppPage() {
  return <Products />;
}
