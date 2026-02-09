"use client";

import type { PropsWithChildren } from "react";

// Simple wrapper that can be extended later if needed
// Stripe Elements are now handled at the component level with client secrets
export const StripeProvider = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};
