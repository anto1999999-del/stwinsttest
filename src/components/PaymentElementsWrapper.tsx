"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { PropsWithChildren } from "react";

// Make sure to add your Stripe publishable key to your environment variables
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in PaymentElementsWrapper"
  );
}

const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

interface PaymentElementsWrapperProps extends PropsWithChildren {
  clientSecret: string;
}

export const PaymentElementsWrapper = ({
  children,
  clientSecret,
}: PaymentElementsWrapperProps) => {
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
	  key={clientSecret} 
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#d80c19",
            colorBackground: "#ffffff",
            colorText: "#1a202c",
            colorDanger: "#e53e3e",
            fontFamily: "var(--font-made-outer), sans-serif",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
};
