"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Image,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { useCartStore } from "@/shared/stores/useCartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const afterpayAmount = total / 4;

  return (
    <Box as="section" bg="gray.50" minH="100vh" py={10}>
      <Box maxW="1600px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
        {/* Page Title */}
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          color="#d80c19"
          mb={8}
        >
          Cart
        </Text>

        {items.length === 0 ? (
          /* Empty Cart State */
          <Box textAlign="center" py={20}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.600" mb={4}>
              Your cart is empty
            </Text>
            <Text fontSize="lg" color="gray.500" mb={8}>
              Add some products to get started
            </Text>
            <Button
              bg="#d80c19"
              color="white"
              _hover={{ bg: "#b30915" }}
              size="lg"
              onClick={() => (window.location.href = "/parts")}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 4, md: 6, lg: 8 }}
          >
            {/* Left: Product List */}
            <Box flex="1" maxW={{ base: "100%", lg: "70%" }}>
              {/* Cart Table Container - Desktop */}
              <Box
                bg="white"
                borderRadius="lg"
                overflow="hidden"
                display={{ base: "none", md: "block" }}
              >
                {/* Table Header */}
                <Box bg="#d80c19" color="white" p={4}>
                  <Flex align="center">
                    <Box flex="2" pl={4}>
                      <Text fontWeight="bold">Product</Text>
                    </Box>
                    <Box w="120px" textAlign="center">
                      <Text fontWeight="bold">Price</Text>
                    </Box>
                    <Box w="80px" textAlign="center">
                      <Text fontWeight="bold">Quantity</Text>
                    </Box>
                  </Flex>
                </Box>

                {/* Table Body */}
                <VStack gap={0} align="stretch">
                  {items.map((item, index) => (
                    <Box
                      key={item.id}
                      p={3}
                      borderBottom={
                        index < items.length - 1 ? "1px solid" : "none"
                      }
                      borderColor="gray.200"
                    >
                      <Flex align="center">
                        {/* Product Column */}
                        <Box flex="2" pl={4}>
                          <Flex align="center" gap={4}>
                            {/* Remove Button */}
                            <IconButton
                              aria-label="Remove item"
                              variant="ghost"
                              color="gray.500"
                              _hover={{ color: "#d80c19" }}
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              flexShrink={0}
                            >
                              <FaTimes />
                            </IconButton>

                            {/* Product Image */}
                            <Box
                              w="80px"
                              h="80px"
                              borderRadius="md"
                              overflow="hidden"
                              flexShrink={0}
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                w="full"
                                h="full"
                                objectFit="cover"
                              />
                            </Box>

                            {/* Product Details */}
                            <Box flex="1" minW="0" maxW="350px">
                              <Text
                                fontWeight="semibold"
                                fontSize="sm"
                                color="gray.800"
                                lineHeight="1.3"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {item.name}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>

                        {/* Price Column */}
                        <Box w="120px" textAlign="center">
                          <Text fontWeight="bold" color="black" fontSize="md">
                            ${item.price.toFixed(2)}
                          </Text>
                        </Box>

                        {/* Quantity Column */}
                        <Box w="80px" textAlign="center">
                          <Text
                            fontWeight="bold"
                            color="gray.800"
                            fontSize="md"
                          >
                            {item.quantity}
                          </Text>
                        </Box>

                        {/* Subtotal Column */}
                        <Box w="120px" textAlign="center">
                          <Text fontWeight="bold" color="black" fontSize="md">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Mobile Layout */}
              <Box display={{ base: "block", md: "none" }}>
                <VStack gap={4} align="stretch">
                  {items.map((item) => (
                    <Box key={item.id} bg="white" p={6} borderRadius="lg">
                      {/* Product Info Row */}
                      <Flex align="center" gap={4} mb={4}>
                        {/* Remove Button */}
                        <IconButton
                          aria-label="Remove item"
                          variant="ghost"
                          color="gray.500"
                          _hover={{ color: "#d80c19" }}
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          flexShrink={0}
                        >
                          <FaTimes />
                        </IconButton>

                        {/* Product Image */}
                        <Box
                          w="60px"
                          h="60px"
                          borderRadius="md"
                          overflow="hidden"
                          flexShrink={0}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            w="full"
                            h="full"
                            objectFit="cover"
                          />
                        </Box>

                        {/* Product Details */}
                        <Box flex="1" minW="0" maxW="200px">
                          <Text
                            fontWeight="semibold"
                            fontSize="xs"
                            color="gray.800"
                            lineHeight="1.3"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {item.name}
                          </Text>
                        </Box>
                      </Flex>

                      {/* Price, Quantity, Subtotal - Vertical Stack */}
                      <VStack align="flex-start" gap={2} mt={2}>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="xs" color="gray.500">
                            Price:
                          </Text>
                          <Text fontWeight="bold" color="black" fontSize="sm">
                            ${item.price.toFixed(2)}
                          </Text>
                        </Flex>

                        <Flex justify="space-between" w="full">
                          <Text fontSize="xs" color="gray.500">
                            Quantity:
                          </Text>
                          <Text
                            fontWeight="bold"
                            color="gray.800"
                            fontSize="sm"
                          >
                            {item.quantity}
                          </Text>
                        </Flex>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Coupon Section */}
              <Box bg="white" p={6} borderRadius="lg" mt={6}>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  gap={4}
                  align="center"
                  justify="space-between"
                >
                  <HStack gap={4} flex="1">
                    <Input
                      placeholder="Coupon code"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: "#d80c19" }}
                      maxW="300px"
                    />
                    <Button
                      bg="#d80c19"
                      color="white"
                      _hover={{ bg: "#b30915" }}
                    >
                      Apply coupon
                    </Button>
                  </HStack>
                  <Button
                    bg="#f8f9fa"
                    color="gray.700"
                    border="1px solid"
                    borderColor="gray.300"
                    _hover={{ bg: "gray.100" }}
                  >
                    Update cart
                  </Button>
                </Flex>
              </Box>
            </Box>

            {/* Right: Cart Totals */}
            <Box
              flex="1"
              minW={{ base: "100%", lg: "300px" }}
              maxW={{ base: "100%", lg: "350px" }}
            >
              <Box
                bg="white"
                p={{ base: 3, md: 4 }}
                borderRadius="lg"
                position={{ base: "static", lg: "sticky" }}
                top={4}
              >
                {/* Cart Totals Header */}
                <Box bg="#d80c19" color="white" p={3} borderRadius="lg" mb={4}>
                  <Text fontWeight="bold" textAlign="center" fontSize="sm">
                    Cart totals
                  </Text>
                </Box>

                {/* Summary */}
                <VStack gap={2} align="stretch" mb={4}>
                  <Flex justify="space-between">
                    <Text color="gray.600">Subtotal</Text>
                    <Text fontWeight="bold" color="black">
                      ${total.toFixed(2)}
                    </Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text color="gray.600">Shipping</Text>
                    <Text fontWeight="bold">Local pickup</Text>
                  </Flex>

                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    NSW
                  </Text>

                  <Text
                    fontSize="xs"
                    color="gray.400"
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ color: "gray.600" }}
                  >
                    Change
                  </Text>

                  <Box w="full" h="1px" bg="gray.200" my={2} />

                  <Flex justify="space-between" fontSize="md">
                    <Text fontWeight="bold" color="black">
                      Total
                    </Text>
                    <Text fontWeight="bold" color="black">
                      ${total.toFixed(2)}
                    </Text>
                  </Flex>
                </VStack>

                {/* Afterpay Option */}
                <Box textAlign="center" mb={4}>
                  <Text fontSize="xs" color="gray.600" mb={1}>
                    4 payments of ${afterpayAmount.toFixed(2)}
                  </Text>
                  <HStack justify="center" gap={1}>
                    <Box
                      bg="green.500"
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="sm"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      afterpay
                    </Box>
                    <Box
                      bg="gray.300"
                      color="gray.600"
                      borderRadius="full"
                      w="3"
                      h="3"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xs"
                      cursor="pointer"
                    >
                      i
                    </Box>
                  </HStack>
                </Box>

                {/* Checkout Button */}
                <Button
                  bg="#d80c19"
                  color="white"
                  size="sm"
                  w="full"
                  py={2}
                  fontSize="sm"
                  _hover={{ bg: "#b30915" }}
                  onClick={() => router.push("/checkout")}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
