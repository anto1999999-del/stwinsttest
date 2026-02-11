import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - S-Twins Auto Parts",
  description: "Manage your S-Twins account: orders, address and password.",
  alternates: { canonical: "https://stwins.com.au/profile" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
