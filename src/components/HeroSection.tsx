"use client";

import { Box, Flex, Text, Button, VStack, Image } from "@chakra-ui/react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <Box as="section" minH="100vh" display="flex">
      {/* Left Section - Dark Background with Text and Buttons */}
      <Box
        w="50%"
        bg="black"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={12}
      >
        <VStack gap={8} align="center" textAlign="center">
          <VStack gap={2}>
            <Text
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              color="white"
              lineHeight="0.9"
            >
              RARE
            </Text>
            <Text
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              color="white"
              lineHeight="0.9"
            >
              PARTS
            </Text>
            <Text
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              color="white"
              lineHeight="0.9"
            >
              DELIVERED
            </Text>
            <Text
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              color="white"
              lineHeight="0.9"
            >
              FAST
            </Text>
          </VStack>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="white"
            opacity={0.8}
            fontWeight="medium"
          >
            First Place for Premium Car Parts
          </Text>

          <Flex gap={4} flexWrap="wrap" justify="center">
            <Link href="/parts">
              <Button
                bg="#ff0000"
                color="white"
                _hover={{ bg: "#cc0000" }}
                size="lg"
                px={8}
                py={6}
                fontSize="md"
                fontWeight="bold"
                borderRadius="md"
                transition="all 0.3s"
                _active={{ transform: "scale(0.95)" }}
              >
                View Parts
              </Button>
            </Link>
            <Link href="/cars">
              <Button
                bg="#ff0000"
                color="white"
                _hover={{ bg: "#cc0000" }}
                size="lg"
                px={8}
                py={6}
                fontSize="md"
                fontWeight="bold"
                borderRadius="md"
                transition="all 0.3s"
                _active={{ transform: "scale(0.95)" }}
              >
                View Cars
              </Button>
            </Link>
          </Flex>
        </VStack>
      </Box>

      {/* Right Section - Building and Car Image */}
      <Box w="50%" position="relative">
        <Image
          src="/hero-building-car.jpg"
          alt="S-TWINS building with car parked in front"
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="center"
        />
      </Box>
    </Box>
  );
}
