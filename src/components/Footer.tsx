"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Input,
  Image,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { FaFacebook } from "react-icons/fa";
import NextLink from "next/link";
import SellYourCarForm from "./SellYourCarForm";

// Dynamically import Google Maps components to avoid SSR issues
const GoogleMap = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.GoogleMap),
  {
    ssr: false,
    loading: () => <Box w="full" h="full" bg="gray.800" />,
  }
);

const Marker = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Marker),
  {
    ssr: false,
  }
);

const Footer = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [isLoaded, setIsLoaded] = useState(false);

  const coords1 = { lat: -33.8522489, lng: 150.9334146 }; // Sydney-ish
  const coords2 = { lat: -33.290861, lng: 151.418751 }; // Tuggerah-ish

  const googleMapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    "";

  // Load Google Maps API dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && googleMapsApiKey && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => setIsLoaded(false);
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      setIsLoaded(true);
    }
  }, [googleMapsApiKey]);

  return (
    <Box as="footer" bg="black" color="white" position="relative">
      {/* Main Footer Content */}
      <Box py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 12, lg: 16 }}
          maxW="1400px"
          mx="auto"
        >
          {/* STAY CONNECTED Column */}
          <VStack align="flex-start" gap={6} flex="1">
            <Box position="relative">
              <Text
                fontSize="xl"
                fontWeight="700"
                color="white"
                mb={3}
                textTransform="uppercase"
              >
                STAY CONNECTED
              </Text>
              <Box
                w="full"
                h="3px"
                bg="#d80c19"
                borderRadius="full"
                position="absolute"
                bottom="-8px"
                left="0"
              />
            </Box>

            <NextLink href="/profile" passHref>
              <Link _hover={{ textDecoration: "none" }}>
                <Text
                  fontSize="md"
                  color="gray.300"
                  lineHeight="1.6"
                  cursor="pointer"
                  _hover={{ color: "white" }}
                >
                  Sign up for all the latest news & events
                </Text>
              </Link>
            </NextLink>

            <Input
              placeholder="Email"
              size="md"
              bg="transparent"
              border="1px solid"
              borderColor="#d80c19"
              color="white"
              _placeholder={{ color: "gray.400" }}
              _focus={{
                borderColor: "#d80c19",
                boxShadow: "0 0 0 1px #d80c19",
              }}
              _hover={{ borderColor: "#d80c19" }}
            />

            {/* Logo/Badge */}
            <Link href="capricorn">
              <Image
                src="/capricorn-footer.png"
                alt="STRONGER WITH CAPRICORN"
                width="133px"
                height="94px"
                objectFit="contain"
              />
            </Link>
          </VStack>

          {/* NAVIGATION Column */}
          <VStack align="flex-start" gap={6} flex="1">
            <Box position="relative">
              <Text
                fontSize="xl"
                fontWeight="700"
                color="white"
                mb={3}
                textTransform="uppercase"
              >
                NAVIGATION
              </Text>
              <Box
                w="full"
                h="3px"
                bg="#d80c19"
                borderRadius="full"
                position="absolute"
                bottom="-8px"
                left="0"
              />
            </Box>

            <VStack align="flex-start" gap={3}>
              <Link
                color="white"
                href="/"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Home
                </Text>
              </Link>
              <Link
                color="white"
                href="about"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  About
                </Text>
              </Link>
              <Link
                color="white"
                href="workshop"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Workshop
                </Text>
              </Link>

              <Text
                cursor="pointer"
                _hover={{ color: "#d80c19" }}
                onClick={onOpen}
              >
                Sell Your Car
              </Text>
              <Link
                color="white"
                href="contact"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Contact
                </Text>
              </Link>
              <NextLink href="/about-zip">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  About Zip
                </Text>
              </NextLink>
              <NextLink href="/news-articles">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  News
                </Text>
              </NextLink>
            </VStack>
          </VStack>

          {/* RESOURCES Column */}
          <VStack align="flex-start" gap={6} flex="1">
            <Box position="relative">
              <Text
                fontSize="xl"
                fontWeight="700"
                color="white"
                mb="3"
                textTransform="uppercase"
              >
                RESOURCES
              </Text>

              <Box
                w="full"
                h="3px"
                bg="#d80c19"
                borderRadius="full"
                position="absolute"
                bottom="-8px"
                left="0"
              />
            </Box>

            <VStack align="flex-start" gap={3}>
              <Link
                href="resolution"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Text cursor="pointer" color="white" _hover={{ opacity: 0.8 }}>
                  Resolution Center
                </Text>
              </Link>
              <Link
                color="white"
                href="contact"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Careers
                </Text>
              </Link>
              <Link
                color="white"
                href="policy"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Shipping & Return Policy
                </Text>
              </Link>
              <Link
                href="profile"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Text cursor="pointer" color="white" _hover={{ opacity: 0.8 }}>
                  Lost password
                </Text>
              </Link>
              <NextLink href="/locations">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Locations
                </Text>
              </NextLink>
            </VStack>
          </VStack>

          {/* WRECKER Column */}
          <VStack align="flex-start" gap={6} flex="1">
            <Box position="relative">
              <Text
                fontSize="xl"
                fontWeight="700"
                color="white"
                mb={3}
                textTransform="uppercase"
              >
                WRECKER
              </Text>
              <Box
                w="full"
                h="3px"
                bg="#d80c19"
                borderRadius="full"
                position="absolute"
                bottom="-8px"
                left="0"
              />
            </Box>

            <VStack align="flex-start" gap={3}>
              <NextLink href="/brand/wrecker">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Wrecker
                </Text>
              </NextLink>
              <NextLink href="/brand/audi">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Audi
                </Text>
              </NextLink>
              <NextLink href="/brand/bmw">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  BMW
                </Text>
              </NextLink>
              <NextLink href="/brand/chrysler">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Chrysler
                </Text>
              </NextLink>
              <NextLink href="/brand/dodge">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Dodge
                </Text>
              </NextLink>
              <NextLink href="/brand/ford">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Ford
                </Text>
              </NextLink>
              <NextLink href="/brand/holden">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Holden
                </Text>
              </NextLink>
              <NextLink href="/brand/hyundai">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Hyundai
                </Text>
              </NextLink>
              <NextLink href="/brand/jeep">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Jeep
                </Text>
              </NextLink>
              <NextLink href="/brand/land-rover">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Land Rover
                </Text>
              </NextLink>
              <NextLink href="/brand/nissan">
                <Text cursor="pointer" _hover={{ color: "#d80c19" }}>
                  Nissan
                </Text>
              </NextLink>
            </VStack>
          </VStack>

          {/* GET IN TOUCH Column */}
          <VStack align="flex-start" gap={6} flex="1">
            <Box position="relative">
              <Text
                fontSize="xl"
                fontWeight="700"
                color="white"
                mb={3}
                textTransform="uppercase"
              >
                GET IN TOUCH
              </Text>
              <Box
                w="full"
                h="3px"
                bg="#d80c19"
                borderRadius="full"
                position="absolute"
                bottom="-8px"
                left="0"
              />
            </Box>

            <VStack align="flex-start" gap={4}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Text
                    fontSize="md"
                    color="gray.300"
                    mb={1}
                    cursor="pointer"
                    _hover={{ color: "#d80c19" }}
                    onClick={() =>
                      window.open(
                        "https://maps.google.com/?q=755+The+Horsley+Dr+Smithfield+NSW+2164",
                        "_blank"
                      )
                    }
                  >
                    755 The Horsley Dr Smithfield NSW 2164
                  </Text>
                  <Text fontSize="md" color="#d80c19" fontWeight="600">
                    <a
                      href="tel:0296047366"
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      02 9604 7366
                    </a>
                  </Text>
                </Box>
                <Box
                  w={{ base: "100%", md: "160px" }}
                  h="100px"
                  borderRadius="md"
                  overflow="hidden"
                  mt={2}
                  position="relative"
                >
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={coords1}
                      zoom={14}
                      options={{ disableDefaultUI: true }}
                    >
                      <Marker position={coords1} />
                    </GoogleMap>
                  ) : (
                    <Box w="full" h="full" bg="gray.800" />
                  )}

                  {/* Transparent overlay link so clicking the map opens Google Maps in a new tab */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${coords1.lat},${coords1.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open location in Google Maps"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 2,
                      display: "block",
                    }}
                  />
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Text
                    fontSize="md"
                    color="gray.300"
                    mb={1}
                    cursor="pointer"
                    _hover={{ color: "#d80c19" }}
                    onClick={() =>
                      window.open(
                        "https://maps.google.com/?q=15+Bluegum+Cl+Tuggerah+NSW+2259",
                        "_blank"
                      )
                    }
                  >
                    15 Bluegum Cl Tuggerah NSW 2259
                  </Text>
                  <Text fontSize="md" color="#d80c19" fontWeight="600">
                    <a
                      href="tel:0243512222"
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      02 4351 2222
                    </a>
                  </Text>
                </Box>
                <Box
                  w={{ base: "100%", md: "160px" }}
                  h="100px"
                  borderRadius="md"
                  overflow="hidden"
                  mt={2}
                  position="relative"
                >
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={coords2}
                      zoom={14}
                      options={{ disableDefaultUI: true }}
                    >
                      <Marker position={coords2} />
                    </GoogleMap>
                  ) : (
                    <Box w="full" h="full" bg="gray.800" />
                  )}

                  {/* Transparent overlay link so clicking the map opens Google Maps in a new tab */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${coords2.lat},${coords2.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open location in Google Maps"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 2,
                      display: "block",
                    }}
                  />
                </Box>
              </Box>

              <Text
                fontSize="md"
                color="gray.300"
                cursor="pointer"
                _hover={{ color: "#d80c19" }}
                onClick={() => window.open("mailto:sales@stwins.com.au")}
              >
                sales@stwins.com.au
              </Text>

              {/* Social Icons */}
              <HStack gap={4} mt={2}>
                <Link
                  href="https://www.ebay.com.au/str/hrspares"
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ opacity: 0.8 }}
                >
                  <Text fontSize="sm" color="white" cursor="pointer">
                    ebay
                  </Text>
                </Link>
                <Link
                  href="https://www.facebook.com/stwinsautoparts#"
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ opacity: 0.8 }}
                >
                  <FaFacebook size="20" color="white" />
                </Link>
                <Link
                  href="https://www.gumtree.com.au/web/s-user/4651998108977"
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ opacity: 0.8 }}
                >
                  <Image
                    src="/gumtree.png"
                    alt="Gumtree"
                    width="60px"
                    height="60px"
                    objectFit="contain"
                  />
                </Link>
              </HStack>
            </VStack>
          </VStack>
        </Flex>
      </Box>

      {/* Bottom Section */}
      <Box borderBottom="1px solid" borderColor="gray.600" />
      <Box py={6} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "center", md: "center" }}
          gap={4}
        >
          <Text fontSize="sm" color="gray.400">
            © 2024 S-Twins. All rights reserved.
          </Text>

          <HStack gap={6}>
            <Text fontSize="sm" color="gray.400" cursor="pointer">
              Privacy Policy
            </Text>
            <Text fontSize="sm" color="gray.400" cursor="pointer">
              Terms of Service
            </Text>
          </HStack>
        </Flex>
      </Box>     

      <SellYourCarForm isOpen={open} onClose={onClose} />
    </Box>
  );
};

export default Footer;
