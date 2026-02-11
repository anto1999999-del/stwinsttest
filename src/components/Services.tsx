"use client";

import { Box, Flex, Text, VStack, Button, Image } from "@chakra-ui/react";
import NextLink from "next/link";

const Services = () => {
  return (
    <Box bg="#151617" color="white" py={20} px={{ base: 6, md: 8, lg: 12 }}>
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        gap={{ base: 16, lg: 32 }}
      >
        {/* Left Side */}
        <Box flex="0.75" maxW="620px">
          <VStack align={{ base: "center", lg: "flex-start" }} gap={8} w="full">
            {/* Title */}
            <Box textAlign={{ base: "center", lg: "left" }}>
              <Text
                as="h2"
                fontSize={{ base: "2xl", md: "3xl", lg: "3xl" }}
                fontWeight="extrabold"
                textTransform="uppercase"
                lineHeight="1.3"
              >
                Comprehensive Auto Parts Services at S-Twins Auto Parts
              </Text>
              <Box
                w="100%"
                maxW="620px"
                h="3px"
                bg="#d80c19"
                mt={3}
                mx={{ base: "auto", lg: "0" }}
              />
            </Box>

            {/* Description */}
            <Text
              fontSize="md"
              lineHeight="1.8"
              textAlign={{ base: "center", lg: "left" }}
              color="white"
              maxW="420px"
            >
              We are Sydney’s Specialist Dismantler for Chrysler, Jeep & Dodge
              models! Our range of services makes us the one-stop shop for all
              your auto part needs.
            </Text>

            {/* Learn More Button */}
            <NextLink href="/news-articles">
              <Button
                bg="#d80c19"
                color="white"
                _hover={{ bg: "#b30915" }}
                px={8}
                py={5}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="sm"
              >
                Learn More
              </Button>
            </NextLink>
          </VStack>
        </Box>

        {/* Right Side */}
        <Box flex="0.75">
          <Flex direction={{ base: "column", md: "row" }} wrap="wrap" gap={10}>
            {/* Item 1 */}
            <Flex gap={6}>
              <Image src="/car-icon.jpg" alt="Car Icon" w="60px" h="60px" />
              <VStack align="flex-start" gap={0}>
                <Text as="h3" fontSize="xl" fontWeight="bold">
                  Over 100,000
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  quality used parts
                </Text>
              </VStack>
            </Flex>

            {/* Item 2 */}
            <Flex align="center" gap={6}>
              <Image src="/phone-icon.jpg" alt="Phone Icon" w="60px" h="60px" />
              <VStack align="flex-start" gap={0}>
                <Text as="h3" fontSize="xl" fontWeight="bold">
                  Professional
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  Customer Service
                </Text>
              </VStack>
            </Flex>

            {/* Item 3 */}
            <Flex align="center" gap={6}>
              <Image
                src="/sheld-icon.jpg"
                alt="Shield Icon"
                w="60px"
                h="60px"
              />
              <VStack align="flex-start" gap={0}>
                <Text as="h3" fontSize="xl" fontWeight="bold">
                  Warranty included
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  on all parts
                </Text>
              </VStack>
            </Flex>

            {/* Item 4 */}
            <Flex align="center" gap={6}>
              <Image src="/tool-icon.jpg" alt="Tool Icon" w="60px" h="60px" />
              <VStack align="flex-start" gap={0}>
                <Text as="h3" fontSize="xl" fontWeight="bold">
                  Referral Workshop
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  fitting service
                </Text>
              </VStack>
            </Flex>

            {/* Item 5 */}
            <Flex align="center" gap={6}>
              <Image src="/truck-icon.jpg" alt="Truck Icon" w="60px" h="60px" />
              <VStack align="flex-start" gap={0}>
                <Text as="h3" fontSize="xl" fontWeight="bold">
                  Fast, Nationwide
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  Delivery
                </Text>
              </VStack>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Services;
