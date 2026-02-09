"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";

interface StripePaymentFormProps {
  total: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export default function StripePaymentForm({
  total,
  onSuccess,
  onError,
  isLoading = false,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
        onError(error.message || "Payment failed");
      } else {
        onSuccess();
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={6} align="stretch">
        {/* Payment Element */}
        <Box>
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card"],
            }}
          />
        </Box>

        {/* Error Display */}
        {errorMessage && (
          <Box
            bg="red.50"
            border="1px solid"
            borderColor="red.200"
            borderRadius="md"
            p={3}
          >
            <Text fontSize="sm" color="red.600">
              {errorMessage}
            </Text>
          </Box>
        )}

        {/* Submit Button */}
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
          loading={isProcessing || isLoading}
          loadingText="Processing Payment..."
          disabled={!stripe || !elements || isProcessing || isLoading}
          borderRadius="xl"
          boxShadow="0 4px 15px rgba(216, 12, 25, 0.3)"
          transition="all 0.3s ease"
        >
          <Box display="flex" alignItems="center" gap={3}>
            <FaLock />
            <Text>Pay ${total.toFixed(2)} AUD</Text>
          </Box>
        </Button>

        {/* Security Notice */}
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Your payment information is secured by Stripe and encrypted
          end-to-end.
        </Text>
      </VStack>
    </Box>
  );
}
