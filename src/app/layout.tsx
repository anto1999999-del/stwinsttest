// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./css/globals.css";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import Header from "@/components/Header";
import { Box } from "@chakra-ui/react";
import { Providers } from "./providers";
import Script from "next/script";
import FloatingChat from "@/widgets/floating-chat";
import HolidayClosureBanner from "@/components/HolidayClosureBanner"; // ✅ NEW

// Using local font: "MADE Outer Sans Alt Black PERSONAL USE"
const madeOuter = localFont({
  src: [{ path: "./fonts/MADE-Outer-Sans-Alt-Black.otf", weight: "900", style: "normal" }],
  variable: "--font-made-outer",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stwins.com.au"),
  title: { default: "S-Twins", template: "%s | S-Twins" },
  description: "S-Twins — New & used auto parts, Australia-wide shipping and warranty.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://stwins.com.au",
    siteName: "S-Twins",
    title: "S-Twins - Premium Car Parts & Auto Dismantler",
    description: "S-Twins — New & used auto parts, Australia-wide shipping and warranty.",
  },
  twitter: {
    card: "summary_large_image",
    title: "S-Twins - Premium Car Parts & Auto Dismantler",
    description: "S-Twins — New & used auto parts, Australia-wide shipping and warranty.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${madeOuter.variable} ${madeOuter.variable}`}
        style={{ fontFamily: "var(--font-made-outer-sans)" }}
      >
        <Providers>
          <ChakraProvider>
            <Header />
            <Box h="120px" />

            {/* ⬇️ Holiday closure popup */}
            <HolidayClosureBanner />

            {children}
            {/* ⬇️ Load Podium once, globally */}
            <Script
              id="podium-widget"
              strategy="afterInteractive"
              src={`https://connect.podium.com/widget.js#ORG_TOKEN=${process.env.NEXT_PUBLIC_PODIUM_TOKEN}`}
              data-organization-api-token={process.env.NEXT_PUBLIC_PODIUM_TOKEN}
            />
            {/* ⬇️ Your existing FAB that will open Podium */}
            <FloatingChat />
          </ChakraProvider>
        </Providers>
      </body>
    </html>
  );
}
