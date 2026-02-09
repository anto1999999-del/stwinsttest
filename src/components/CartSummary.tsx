"use client";

import React from "react";
import { Box, VStack, HStack, Text, Button, Flex } from "@chakra-ui/react";
import { FaShoppingCart, FaTruck, FaCheckCircle } from "react-icons/fa";
import { useCartStore } from "@/shared/stores/useCartStore";
import { useRouter } from "next/navigation";

export default function CartSummary() {
  const router = useRouter();
  const {
    items,
    selectedShipping,
    deliveryAddress,
    getSubtotal,
    getShippingCost,
    getTotalWithShipping,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const total = getTotalWithShipping();

  const isReadyForCheckout =
    items.length > 0 && selectedShipping && deliveryAddress;

  const handleProceedToCheckout = () => {
    if (isReadyForCheckout) {
      router.push("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
      >
        <Box textAlign="center" py={8}>
          <Box mx="auto" mb={4}>
            <FaShoppingCart size="48px" color="gray" />
          </Box>
          <Text color="gray.500" fontSize="lg">
            Your cart is empty
          </Text>
          <Text color="gray.400" fontSize="sm" mt={2}>
            Add some products to see your cart summary
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.200"
    >
      <Box mb={6}>
        <Flex align="center" gap={3}>
          <Box color="#d80c19">
            <FaShoppingCart size="24px" />
          </Box>
          <Text fontSize="xl" fontWeight="bold">
            Order Summary
          </Text>
        </Flex>
      </Box>

      <VStack gap={6} align="stretch">
        {/* Items Summary */}
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
            Items ({items.length})
          </Text>
          <VStack gap={2} align="stretch">
            {items.map((item) => (
              <HStack key={item.id} justify="space-between" fontSize="sm">
                <Box flex="1" minW="0">
                  <Text
                    color="gray.800"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {item.name}
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </Text>
                </Box>
                <Text fontWeight="bold" color="gray.800">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box h="1px" bg="gray.200" w="full" />

        {/* Delivery Address Status */}
        <Box>
          <HStack mb={3}>
            <Box color={deliveryAddress ? "green.500" : "gray.400"}>
              <FaTruck />
            </Box>
            <Text fontSize="sm" fontWeight="bold" color="gray.700">
              Delivery Address
            </Text>
            {deliveryAddress && (
              <Box bg="green.100" px={2} py={1} borderRadius="sm">
                <HStack gap={1}>
                  <FaCheckCircle size="12px" />
                  <Text fontSize="xs" fontWeight="bold" color="green.800">
                    Set
                  </Text>
                </HStack>
              </Box>
            )}
          </HStack>
          {deliveryAddress ? (
            <Box fontSize="sm" color="gray.600">
              <Text>{deliveryAddress.name}</Text>
              <Text>
                {deliveryAddress.suburb}, {deliveryAddress.state}{" "}
                {deliveryAddress.postcode}
              </Text>
            </Box>
          ) : (
            <Text fontSize="sm" color="orange.600">
              Please set delivery address to calculate shipping
            </Text>
          )}
        </Box>

        {/* Shipping Status */}
        <Box>
          <HStack mb={3}>
            <Box color={selectedShipping ? "green.500" : "gray.400"}>
              <FaTruck />
            </Box>
            <Text fontSize="sm" fontWeight="bold" color="gray.700">
              Shipping Method
            </Text>
            {selectedShipping && (
              <Box bg="green.100" px={2} py={1} borderRadius="sm">
                <HStack gap={1}>
                  <FaCheckCircle size="12px" />
                  <Text fontSize="xs" fontWeight="bold" color="green.800">
                    Selected
                  </Text>
                </HStack>
              </Box>
            )}
          </HStack>
          {selectedShipping ? (
            <Box fontSize="sm" color="gray.600">
              <Text fontWeight="medium">{selectedShipping.serviceName}</Text>
              <Text>
                {selectedShipping.estimatedDays} business day
                {selectedShipping.estimatedDays !== 1 ? "s" : ""} •{" "}
                {selectedShipping.carrier}
              </Text>
            </Box>
          ) : (
            <Text fontSize="sm" color="orange.600">
              {deliveryAddress
                ? "Please calculate and select shipping"
                : "Set delivery address first"}
            </Text>
          )}
        </Box>

        <Box h="1px" bg="gray.200" w="full" />

        {/* Cost Breakdown */}
        <VStack gap={2} align="stretch">
          <HStack justify="space-between">
            <Text color="gray.600">Subtotal</Text>
            <Text fontWeight="bold" color="gray.800">
              ${subtotal.toFixed(2)}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.600">Shipping</Text>
            <Text fontWeight="bold" color="gray.800">
              {selectedShipping ? `$${shippingCost.toFixed(2)}` : "TBD"}
            </Text>
          </HStack>

          <Box h="1px" bg="gray.200" w="full" />

          <HStack justify="space-between" fontSize="lg">
            <Text fontWeight="bold" color="gray.800">
              Total
            </Text>
            <Text fontWeight="bold" color="#d80c19" fontSize="xl">
              ${total.toFixed(2)}
            </Text>
          </HStack>

          {selectedShipping && (
            <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
              Shipping: ${shippingCost.toFixed(2)}
            </Text>
          )}
        </VStack>

        {/* Checkout Button */}
        <Button
          onClick={handleProceedToCheckout}
          disabled={!isReadyForCheckout}
          bg={isReadyForCheckout ? "#d80c19" : "gray.300"}
          color={isReadyForCheckout ? "white" : "gray.500"}
          _hover={{
            bg: isReadyForCheckout ? "#b30915" : "gray.300",
            transform: isReadyForCheckout ? "translateY(-2px)" : "none",
            boxShadow: isReadyForCheckout
              ? "0 8px 25px rgba(216, 12, 25, 0.4)"
              : "none",
          }}
          size="lg"
          w="full"
          py={6}
          fontSize="lg"
          fontWeight="bold"
          borderRadius="lg"
          transition="all 0.3s ease"
        >
          {!items.length
            ? "Cart is Empty"
            : !deliveryAddress
            ? "Set Delivery Address"
            : !selectedShipping
            ? "Calculate Shipping"
            : `Proceed to Checkout - $${total.toFixed(2)}`}
        </Button>

        {/* Payment Notice */}
        {isReadyForCheckout && (
          <Box
            bg="blue.50"
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor="blue.200"
            textAlign="center"
            mt={4}
          >
            <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={2}>
              💳 Payment Process
            </Text>
            <Text fontSize="xs" color="blue.600" mb={1}>
              Full payment (including freight) is collected at checkout
            </Text>
            <Text fontSize="xs" color="blue.600">
              Items will be prepared and shipped after payment confirmation
            </Text>
          </Box>
        )}

        {/* Freight Calculation Reminder */}
        {!selectedShipping && deliveryAddress && (
          <Box
            bg="orange.50"
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor="orange.200"
            textAlign="center"
            mt={4}
          >
            <Text fontSize="sm" fontWeight="bold" color="orange.700" mb={2}>
              📦 Freight Calculation Required
            </Text>
            <Text fontSize="xs" color="orange.600">
              Please calculate shipping above to see your total cost before
              checkout
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
