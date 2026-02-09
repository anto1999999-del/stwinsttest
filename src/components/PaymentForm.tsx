"use client";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, Button, Text, VStack, HStack } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";  // Import PayPal components

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export default function PaymentForm({
  amount,
  onSuccess,
  onError,
  disabled = false,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Ensure the Payment Element is mounted & valid
      const submitResult = await elements.submit();
      if (submitResult?.error) {
        onError(submitResult.error.message || "Please check your payment details.");
        toast.error(submitResult.error.message || "Please check your payment details.");
        return;
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${typeof window !== "undefined" ? window.location.origin : ""}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed. Please try again.");
        toast.error(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onSuccess(paymentIntent.id);
      } else {
        onError("Payment status is unclear. Please contact support.");
        toast.error("Payment status is unclear. Please contact support.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaypalSuccess = (paymentId: string) => {
    // Handle PayPal payment success
    toast.success("PayPal Payment successful!");
    onSuccess(paymentId);
  };

  const handlePaypalError = (error: string) => {
    // Handle PayPal payment failure
    onError(error);
    toast.error("PayPal Payment failed: " + error);
  };

  return (
    <Box as="form" onSubmit={handleStripeSubmit}>
      <VStack gap={6} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
            Payment Details
          </Text>
          <Box
            w="60px"
            h="3px"
            bgGradient="linear(to-r, #d80c19, #ff6b6b)"
            borderRadius="full"
            mb={6}
          />
        </Box>

        {/* Stripe Payment Element */}
        <Box
          p={4}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          bg="white"
        >
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card"],
            }}
          />
        </Box>
		{/* Payment Button (Stripe) */}
        <Button
          type="submit"
          bgGradient="linear(to-r, #d80c19, #ff6b6b)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, #b30915, #e55555)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(216, 12, 25, 0.4)",
          }}
          size="lg"
          w="full"
          py={8}
          fontSize="xl"
          fontWeight="bold"
          loading={isProcessing}
          loadingText="Processing Payment..."
          disabled={disabled || isProcessing || !stripe || !elements}
          borderRadius="xl"
          boxShadow="0 4px 15px rgba(216, 12, 25, 0.3)"
          transition="all 0.3s ease"
        >
          <HStack gap={3}>
            <FaLock />
            <Text>Pay ${amount.toFixed(2)}</Text>
          </HStack>
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Your payment information is secure and encrypted by Stripe.
        </Text>

        {/* PayPal Button */}
        <Box>
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
              currency: "AUD",
              intent: "capture",
            }}
          >
            <PayPalButtons
			  style={{ layout: "vertical" }}
			  disabled={disabled || isProcessing}
			  createOrder={(_, actions) => {
				return actions.order.create({
				  intent: "CAPTURE",
				  purchase_units: [
					{
					  amount: {
						value: amount.toFixed(2),
						currency_code: "AUD",
					  },
					  description: "S-Twins order",
					},
				  ],
				});
			  }}
			  onApprove={async (data, actions) => {
				  if (!actions || !actions.order) {
					onError("PayPal order action is not available.");
					return;
				  }

				  try {
					const capture = await actions.order.capture();
					if (!capture.id) {
					  onError("Payment capture failed, no capture ID returned.");
					  return;
					}
					handlePaypalSuccess(capture.id);  // Handle successful payment
				  } catch (error) {
					// Ensure error is an instance of Error before accessing .message
					const errorMessage = error instanceof Error ? error.message : "PayPal payment failed. Please try again.";
					handlePaypalError(errorMessage);
				  }
				}}

				onError={(err) => {
				  // Ensure error is an instance of Error before accessing .message
				  const msg = err instanceof Error ? err.message : "PayPal payment failed. Please try again.";
				  handlePaypalError(msg);
				}}

			/>
          </PayPalScriptProvider>
        </Box>

        
      </VStack>
    </Box>
  );
}
