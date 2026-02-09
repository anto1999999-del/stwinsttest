"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Image,
  Link,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import NextLink from "next/link";
import QuoteRequest from "./QuoteRequest";
import Footer from "./Footer";
import { heroFont } from "@/shared/lib/heroFont";
// Components below will be omitted here; we'll insert the Mechanical Repairs block instead

const CapricornHero = () => {
  return (
    <>
      <Box as="section" minH="100vh" position="relative">
        {/* Full Width Image Background */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={1}
        >
          <Image
            src="/capricornhero.jpg"
            alt="Capricorn Supplier - S-Twins Team"
            w="full"
            h="full"
            objectFit="cover"
            objectPosition="center"
            filter="brightness(0.8) contrast(1.1)"
          />
        </Box>

        {/* Dark Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.3)"
          zIndex={2}
        />

        {/* Content Overlay */}
        <Box
          position="relative"
          zIndex={3}
          h="full"
          display="flex"
          alignItems={{ base: "center", lg: "flex-start" }}
          justifyContent={{ base: "center", lg: "flex-start" }}
          px={{ base: 8, md: 12, lg: 16 }}
          pt={{ base: "55%", lg: "15%" }}
        >
          {/* Left Section - Text Content */}
          <Box
            flex={{ base: "1", lg: "1" }}
            maxW={{ base: "full", lg: "600px" }}
            color="white"
            textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            display="flex"
            alignItems="center"
            justifyContent={{ base: "center", lg: "flex-start" }}
            h="50%"
          >
            <VStack align={{ base: "center", lg: "flex-start" }} gap={6}>
              <Text
                fontSize={{ base: "4xl", md: "6xl", lg: "6xl" }}
                fontWeight="bold"
                lineHeight="0.9"
                letterSpacing="1.5px"
                textAlign={{ base: "center", lg: "left" }}
                fontFamily={heroFont}
              >
                CAPRICORN
              </Text>
              <Text
                fontSize={{ base: "4xl", md: "6xl", lg: "6xl" }}
                fontWeight="bold"
                lineHeight="0.9"
                letterSpacing="1.5px"
                textAlign={{ base: "center", lg: "left" }}
                fontFamily={heroFont}
              >
                SUPPLIER
              </Text>
            </VStack>
          </Box>
        </Box>        
      </Box>

      {/* Capricorn Information Section */}
      <Box as="section">
        <Flex direction={{ base: "column", lg: "row" }}>
          {/* Left: Red panel with copy - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            bg="#d80c19"
            color="white"
            p={{ base: 6, md: 8, lg: 10 }}
            position="relative"
            display="flex"
            alignItems="center"
          >
            <VStack align="flex-start" gap={10} maxW="800px">
              <Text fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8">
                S-Twins, based in Smithfield NSW, proudly aligns itself as a
                trusted Capricorn Preferred Supplier since 1996. With an
                extensive 18-year track record, S-Twins has consistently
                delivered the advantages of Capricorn&apos;s renowned system.
              </Text>
              <Text fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8">
                As a significant player in the automotive parts procurement
                sector, Capricorn commands influence through its vast network,
                boasting over 15,000 Members and 2,200 Preferred Suppliers
                globally.
              </Text>
            </VStack>
          </Box>

          {/* Right: Image - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            position="relative"
            overflow="hidden"
            maxH={{ base: "600px", lg: "760px" }}
          >
            <Image
              src="/capricorn-s-twins.png"
              alt="S-TWINS signage with phone number"
              w="full"
              h="auto"
              objectFit="cover"
              objectPosition="center 100%"
            />
          </Box>
        </Flex>
      </Box>
      {/* Mechanical Repairs Section (from Workshop) */}
      <Box as="section">
        <Flex direction={{ base: "column", lg: "row" }} h="800px">
          {/* Left Side - Red Background with Text - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            bg="white"
            p={{ base: 8, md: 12, lg: 16 }}
            display="flex"
            alignItems="center"
          >
            <VStack
              align="flex-start"
              gap={{ base: 4, md: 6 }}
              color="gray.900"
            >
              <Box>
                <Text
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  lineHeight="1.1"
                  color="#d80c19"
                >
                  Mechanical Repairs
                </Text>
                <Box w="100%" h="1.5" bg="#d80c19" mt={3} />
              </Box>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.6"
                opacity="0.95"
                color="gray.800"
              >
                We provide a mechanical repair workshop for all makes and models
                of passenger vehicles.
              </Text>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.6"
                opacity="0.95"
                color="gray.800"
              >
                See below of our list of workshop specialisations:
              </Text>

              <VStack
                align="flex-start"
                gap={1}
                fontSize={{ base: "sm", md: "md" }}
              >
                <Text>• Brake Systems</Text>
                <Text>• Clutch</Text>
                <Text>• Clutch and Automatic</Text>
                <Text>• Transmission Systems</Text>
                <Text>• Suspension and Shock Absorbers</Text>
                <Text>• Auto Electrical Systems</Text>
                <Text>• Exhaust Systems</Text>
                <Text>• Cooling Systems</Text>
                <Text>• Air-Conditioning Systems</Text>
                <Text>• Ignition Systems</Text>
              </VStack>
            </VStack>
          </Box>

          {/* Right Side - Workshop Image - 50% width */}
          <Box w={{ base: "100%", lg: "50%" }} position="relative">
            <Image
              src="/workshopsecond.jpg"
              alt="Mechanic Working on Car"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>

      {/* Capricorn Preferred Supplier - Red text + image */}

      {/* We're here to help - Team photo left, content right (last section) */}
      <Box as="section" bg="white">
        <Flex direction={{ base: "column", lg: "row" }}>
          {/* Left: Team photo - 50% width */}
          <Box w={{ base: "100%", lg: "50%" }}>
            <Image
              src="/team-help.jpg"
              alt="S-TWINS team"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>

          {/* Right: Help content - 50% width */}
          <Box w={{ base: "100%", lg: "50%" }} p={{ base: 8, md: 12, lg: 16 }}>
            <VStack align="flex-start" gap={6}>
              <Box mt={6} textAlign={{ base: "center", lg: "left" }}>
                <Text
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color="#d80c19"
                >
                  We&apos;re here to help!
                </Text>
                <Box h="1" bg="black" w="100%" mt={2} />
              </Box>

              <Text color="gray.800" fontSize={{ base: "md", lg: "lg" }}>
                Our experienced team are always happy to help you with any
                problems or questions you may have.
              </Text>

              <Text color="gray.800" fontSize={{ base: "md", lg: "lg" }}>
                If you cannot find what you are looking for please call a member
                of our helpful team or submit an enquiry and we&apos;ll do our
                best to fulfil your request.
              </Text>

              <VStack
                gap={4}
                align={{ base: "stretch", lg: "flex-start" }}
                w={{ base: "full", lg: "auto" }}
              >
                <Link href="tel:0296047366" _hover={{ textDecoration: "none" }}>
                  <Button
                    bg="black"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    size="lg"
                    px={6}
                    py={4}
                    w={{ base: "full", lg: "auto" }}
                  >
                    <Box color="#d80c19" mr={3} transform="rotate(90deg)">
                      <FaPhone />
                    </Box>
                    <Text fontWeight="bold">02 9604 7366</Text>
                  </Button>
                </Link>
                <NextLink href="/contact" passHref>
                  <Button
                    bg="#d80c19"
                    color="white"
                    _hover={{ bg: "#b30915" }}
                    size="lg"
                    px={6}
                    py={4}
                    w={{ base: "full", lg: "auto" }}
                    fontWeight="bold"
                  >
                    Enquire Now
                  </Button>
                </NextLink>
              </VStack>

              <Text color="gray.800">Nationwide delivery available!</Text>

              <Text color="gray.800" fontSize={{ base: "md", lg: "lg" }}>
                For local customers we can also arrange fitting for engines &
                gearboxes. All mechanical work is conducted through a licensed
                mechanical workshop. Please contact the office for all parts
                enquiries.
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Box>
      <QuoteRequest />
      <Footer />
    </>
  );
};

export default CapricornHero;
