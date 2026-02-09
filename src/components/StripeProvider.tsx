"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({
  children,
  clientSecret,
}: StripeProviderProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#d80c19",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#dc2626",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  // If stripePromise is null (due to missing key), show an error message
  if (!stripePromise) {
    return (
      <div
        style={{
          padding: "20px",
          border: "1px solid red",
          borderRadius: "8px",
          margin: "20px",
        }}
      >
        <h3>Payment Configuration Error</h3>
        <p>
          Stripe payment system is not properly configured. Please contact
          support.
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={clientSecret ? options : undefined}
    >
      {children}
    </Elements>
  );
}
