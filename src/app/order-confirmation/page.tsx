"use client";

import {
  Box,
  Text,
  Button,
  VStack,
  Icon,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function OrderConfirmation() {
  const router = useRouter();

  return (
    <Box as="section" bg="gray.50" minH="100vh" py={20}>
      <Box
        maxW="600px"
        mx="auto"
        px={{ base: 6, md: 12, lg: 16 }}
        textAlign="center"
      >
        <VStack gap={8}>
          {/* Success Icon */}
          <Icon as={FaCheckCircle} boxSize={20} color="green.500" />

          {/* Success Message */}
          <VStack gap={4}>
            <Text fontSize="3xl" fontWeight="bold" color="green.600">
              Order Confirmed!
            </Text>
            <Text fontSize="lg" color="gray.600" lineHeight="1.6">
              Thank you for your order. We&apos;ve received your order and will
              process it shortly. You will receive a confirmation email with
              your order details.
            </Text>
            <Text fontSize="md" color="gray.500">
              Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Text>
          </VStack>

          {/* Action Buttons */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={4}
            w="full"
            maxW="400px"
          >
            <Button
              bg="#d80c19"
              color="white"
              _hover={{ bg: "#b30915" }}
              size="lg"
              flex="1"
              onClick={() => router.push("/")}
            >
              <HStack gap={2}>
                <FaHome />
                <Text>Back to Home</Text>
              </HStack>
            </Button>
            <Button
              bg="gray.600"
              color="white"
              _hover={{ bg: "gray.700" }}
              size="lg"
              flex="1"
              onClick={() => router.push("/parts")}
            >
              <HStack gap={2}>
                <FaShoppingBag />
                <Text>Continue Shopping</Text>
              </HStack>
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}
