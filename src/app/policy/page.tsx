import Policy from "@/components/Policy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms - S-Twins Auto Parts",
  description: "Read S-Twins privacy policy, terms of service, shipping and return policy. Learn about our commitment to protecting your information.",
  alternates: {
    canonical: "https://stwins.com.au/policy",
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
    title: "Privacy Policy & Terms - S-Twins Auto Parts",
    description: "Read S-Twins privacy policy, terms of service, shipping and return policy.",
    url: "https://stwins.com.au/policy",
  },
};

export default function PolicyPage() {
  return (
    <main>
      <Policy />
    </main>
  );
}
