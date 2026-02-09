// pages/_app.tsx (or _app.tsx at root, as you sent)
"use client";

import type { AppProps } from "next/app";
import { Providers } from "@/app/providers";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import HolidayClosureBanner from "@/components/HolidayClosureBanner"; // ✅ NEW

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <ChakraProvider>
        {/* ⬇️ Holiday closure popup for pages/ routes */}
        <HolidayClosureBanner />
        <Component {...pageProps} />
      </ChakraProvider>
    </Providers>
  );
}
