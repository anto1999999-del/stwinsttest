import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - S-Twins Auto Parts",
  description: "Secure checkout at S-Twins. Complete your order for quality used car parts with Australia-wide delivery.",
  alternates: { canonical: "https://stwins.com.au/checkout" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
