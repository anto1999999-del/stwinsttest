import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation - S-Twins Auto Parts",
  description: "Thank you for your order. S-Twins will process and ship your parts. Quality used car parts with warranty.",
  alternates: { canonical: "https://stwins.com.au/order-confirmation" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
