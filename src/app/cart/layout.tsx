import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart - S-Twins Auto Parts",
  description: "Your cart at S-Twins. Review parts and proceed to checkout. Quality used car parts with warranty.",
  alternates: { canonical: "https://stwins.com.au/cart" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
