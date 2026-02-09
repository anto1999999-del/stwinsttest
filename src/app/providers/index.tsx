import { QueryClientProvider } from "./QueryClientProvider";
import { ToastProvider } from "./ToastProvider";
import { StripeProvider } from "./StripeProvider";
import type { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => (
  <QueryClientProvider>
    <StripeProvider>
      {children}
      <ToastProvider />
    </StripeProvider>
  </QueryClientProvider>
);
