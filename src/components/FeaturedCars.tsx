"use client";

import { Box, Text, VStack, Button, Image } from "@chakra-ui/react";
import NextLink from "next/link";

const FeaturedCars = () => {
  return (
    <Box as="section" bg="#f7fafc" py={12} px={{ base: 6, md: 12 }}>
      <VStack maxW="1200px" mx="auto" align="flex-start" gap={6}>
        <Box>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
            FEATURED CARS
          </Text>
          <Box h="2px" bg="#d80c19" w="100%" mt={2} />
        </Box>

        <Box display="flex" gap={4} w="full" flexWrap="wrap">
          <Box
            w={{ base: "100%", md: "48%" }}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="sm"
          >
            <Image src="/images/tiguan.jpg" alt="Tiguan" borderRadius="md" />
            <Text fontWeight="bold" mt={3}>
              2019 Volkswagen Tiguan
            </Text>
            <Text color="gray.600" fontSize="sm">
              2.0L Petrol
            </Text>
          </Box>

          <Box
            w={{ base: "100%", md: "48%" }}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="sm"
          >
            <Image src="/images/amarok.jpg" alt="Amarok" borderRadius="md" />
            <Text fontWeight="bold" mt={3}>
              2021 Volkswagen Amarok
            </Text>
            <Text color="gray.600" fontSize="sm">
              3.7L Diesel Auto
            </Text>
          </Box>
        </Box>

        <NextLink href="/cars">
          <Button bg="#d80c19" color="white" _hover={{ bg: "#b30915" }}>
            View All Cars
          </Button>
        </NextLink>
      </VStack>
    </Box>
  );
};

export default FeaturedCars;
