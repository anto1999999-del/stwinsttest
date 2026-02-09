"use client";

import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Image,
  Icon,
  Link,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import NextLink from "next/link";

const Locations = () => {
  const locations = [
    {
      name: "Smithfield",
      address: "755 The Horsley Dr, Smithfield NSW 2164",
      phone: "02 9604 7366",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking", "Workshop"],
    },
    {
      name: "Tuggerah",
      address: "15 Bluegum Cl, Tuggerah NSW 2259",
      phone: "02 4351 2222",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking", "Workshop"],
    },
    {
      name: "Artarmon",
      address: "123 Artarmon Rd, Artarmon NSW 2064",
      phone: "02 9439 1234",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Cardiff",
      address: "456 Cardiff St, Cardiff NSW 2285",
      phone: "02 4954 5678",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Fairfield",
      address: "789 Fairfield Ave, Fairfield NSW 2165",
      phone: "02 9725 9012",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking", "Workshop"],
    },
    {
      name: "Lidcombe",
      address: "321 Lidcombe St, Lidcombe NSW 2141",
      phone: "02 9749 3456",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Parramatta",
      address: "654 Parramatta Rd, Parramatta NSW 2150",
      phone: "02 9683 7890",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking", "Workshop"],
    },
    {
      name: "Wetherill Park",
      address: "987 Wetherill Park Dr, Wetherill Park NSW 2164",
      phone: "02 9604 2345",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Brookvale",
      address: "147 Brookvale Rd, Brookvale NSW 2100",
      phone: "02 9905 6789",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Castle Hill",
      address: "258 Castle Hill Rd, Castle Hill NSW 2154",
      phone: "02 9634 0123",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking", "Workshop"],
    },
    {
      name: "Five Dock",
      address: "369 Five Dock Rd, Five Dock NSW 2046",
      phone: "02 9712 4567",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Marrickville",
      address: "741 Marrickville Rd, Marrickville NSW 2204",
      phone: "02 9557 8901",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Penrith",
      address: "852 Penrith St, Penrith NSW 2750",
      phone: "02 4731 2345",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking", "Workshop"],
    },
    {
      name: "South West Sydney",
      address: "963 South West Sydney Blvd, Liverpool NSW 2170",
      phone: "02 9602 5678",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Campbelltown",
      address: "159 Campbelltown Rd, Campbelltown NSW 2560",
      phone: "02 4625 9012",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking", "Workshop"],
    },
    {
      name: "Central Coast",
      address: "357 Central Coast Hwy, Gosford NSW 2250",
      phone: "02 4325 3456",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Hornsby",
      address: "468 Hornsby Rd, Hornsby NSW 2077",
      phone: "02 9477 7890",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Mayfield",
      address: "579 Mayfield St, Mayfield NSW 2304",
      phone: "02 4968 1234",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
    {
      name: "Ryde",
      address: "680 Ryde Rd, Ryde NSW 2112",
      phone: "02 9807 5678",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking", "Workshop"],
    },
    {
      name: "Western Sydney",
      address: "791 Western Sydney Way, Blacktown NSW 2148",
      phone: "02 9831 9012",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      services: ["Parts", "Wrecking"],
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        minH="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {/* Background Image */}
        <Image
          src="/Home-Page-Hero-Image-scaled-1.jpg"
          alt="S-Twins Spares Hero"
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="center"
          zIndex={1}
        />

        {/* Dark Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="rgba(0, 0, 0, 0.6)"
          zIndex={2}
        />

        {/* Hero Content */}
        <Box
          position="relative"
          zIndex={3}
          textAlign="center"
          color="white"
          px={6}
          maxW="800px"
          mx="auto"
        >
          <VStack gap={8}>
            <VStack gap={4}>
              <Text
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="1.1"
                textTransform="uppercase"
              >
                Discover Our Location
              </Text>
              <Text
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="1.1"
                textTransform="uppercase"
                color="#d80c19"
              >
                Services
              </Text>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="white"
                opacity={0.9}
                maxW="600px"
                mx="auto"
              >
                at S-Twins Spares in Smithfield
              </Text>
            </VStack>

            <Button
              bg="#d80c19"
              color="white"
              _hover={{ bg: "#b30915" }}
              size="lg"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="md"
              onClick={() => window.open("tel:0296047366", "_self")}
            >
              <HStack gap={2}>
                <Icon as={FaPhone} style={{ transform: "rotate(90deg)" }} />
                <Text>Call Us</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </Box>

      {/* Locations Grid Section */}
      <Box bg="gray.50" py={20} px={{ base: 6, md: 8, lg: 12 }}>
        <VStack gap={12} maxW="1400px" mx="auto">
          {/* Section Title */}
          <VStack gap={4} textAlign="center">
            <Text
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              color="gray.800"
              fontFamily="'MADE Outer Sans', sans-serif"
            >
              Our Locations
            </Text>
            <Box w="100px" h="3px" bg="#d80c19" borderRadius="full" />
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="600px"
              mx="auto"
            >
              Find your nearest S-Twins Auto Parts location for quality auto parts
              and professional service
            </Text>
          </VStack>

          {/* Locations Grid */}
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={4}
            w="full"
            maxW="800px"
            mx="auto"
          >
            {locations.map((location, index) => (
              <Link
                key={index}
                href={`/location/${location.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                textDecoration="none"
              >
                <Button
                  bg="#d80c19"
                  color="white"
                  _hover={{ bg: "#b30915" }}
                  size="lg"
                  py={6}
                  px={4}
                  fontSize="md"
                  fontWeight="bold"
                  borderRadius="md"
                  textAlign="center"
                  whiteSpace="normal"
                  h="auto"
                  minH="60px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="full"
                >
                  {location.name}
                </Button>
              </Link>
            ))}
          </Grid>
        </VStack>
      </Box>

      {/* CTA Section */}
      <Box bg="#d80c19" py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <VStack gap={8} textAlign="center" color="white" maxW="800px" mx="auto">
          <Text
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="bold"
            fontFamily="'MADE Outer Sans', sans-serif"
          >
            Can&apos;t Find Your Location?
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} opacity={0.9}>
            We&apos;re constantly expanding our network. Contact us to find out
            about new locations or delivery options in your area.
          </Text>
          <HStack gap={4} flexWrap="wrap" justify="center">
            <Button
              bg="white"
              color="#d80c19"
              _hover={{ bg: "gray.100" }}
              size="lg"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="md"
              onClick={() => window.open("tel:0296047366", "_self")}
            >
              <HStack gap={2}>
                <Icon as={FaPhone} style={{ transform: "rotate(90deg)" }} />
                <Text>Call Us</Text>
              </HStack>
            </Button>
            <NextLink href="/contact">
              <Button
                bg="transparent"
                color="white"
                border="2px solid"
                borderColor="white"
                _hover={{ bg: "white", color: "#d80c19" }}
                size="lg"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="md"
              >
                Contact Us
              </Button>
            </NextLink>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Locations;
