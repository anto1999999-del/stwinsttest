"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Image,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import NextLink from "next/link";
import QuoteRequest from "./QuoteRequest";
import Footer from "./Footer";
import { heroFont } from "@/shared/lib/heroFont";

const WorkshopHero = () => {
  return (
    <>
      <Box as="section" minH="90vh" position="relative">
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
            src="/workshophero.jpg"
            alt="S-Twins Workshop - Automotive Services"
            w="full"
            h="full"
            objectFit="cover"
            objectPosition="center"
          />
          {/* Gradient Overlay */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="transparent"
            backgroundImage="linear-gradient(180deg, #000000C4 0%, #000000 100%)"
            opacity="0.67"
            transition="background 0.3s, border-radius 0.3s, opacity 0.3s"
            zIndex={1}
          />
        </Box>

        {/* Content Overlay */}
        <Box
          position="relative"
          zIndex={2}
          h="full"
          display="flex"
          alignItems={{ base: "center", lg: "center" }}
          justifyContent={{ base: "center", lg: "flex-start" }}
          px={{ base: 8, md: 12, lg: 16 }}
          pt={{ base: "55%", lg: "0" }}
        >
          {/* Left Section - Text Content */}
          <Box
            flex={{ base: "1", lg: "1" }}
            maxW={{ base: "full", lg: "600px" }}
            color="white"
            textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            display="flex"
            alignItems={{ base: "center", lg: "center" }}
            justifyContent={{ base: "center", lg: "flex-start" }}
            h="full"
            pt={{ base: "0", lg: "10%" }}
          >
            <VStack align={{ base: "center", lg: "flex-start" }} gap={3}>
              <Text
                as="h1"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="700"
                lineHeight="75px"
                textAlign={{ base: "center", lg: "left" }}
                fontFamily={heroFont}
                textTransform="uppercase"
                color="#FFFFFF"
              >
                Comprehensive Automotive Workshop Services at S-Twins Auto Parts
              </Text>
            </VStack>
          </Box>
        </Box>        
      </Box>

      {/* Mechanical Repairs Section */}
      <Box as="section" minH="70vh">
        <Flex direction={{ base: "column", lg: "row" }} h="full">
          {/* Left Side - Red Background with Text - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            bg="#d80c19"
            p={{ base: 12, md: 16, lg: 20 }}
            display="flex"
            alignItems="center"
          >
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              gap={5}
              color="white"
            >
              <Box textAlign={{ base: "center", lg: "left" }}>
                <Text
                  as="h2"
                  fontSize={{ base: "4xl", md: "5xl", lg: "5xl" }}
                  fontWeight="bold"
                  lineHeight="1.1"
                  color="white"
                >
                  Mechanical Repairs
                </Text>
                <Box w="100%" h="1" bg="black" mt={4} />
              </Box>

              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                lineHeight="1.7"
                opacity="0.95"
                textAlign={{ base: "center", lg: "left" }}
              >
                We provide a mechanical repair workshop for all makes and models
                of passenger vehicles.
              </Text>

              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                lineHeight="1.7"
                opacity="0.95"
                textAlign={{ base: "center", lg: "left" }}
              >
                See below of our list of workshop specialisations:
              </Text>

              <Box textAlign={{ base: "center", lg: "left" }}>
                <VStack
                  align={{ base: "center", lg: "flex-start" }}
                  gap={1}
                  fontSize={{ base: "lg", md: "xl" }}
                  color="white"
                >
                  <Text>• Brake Systems</Text>
                  <Text>• Clutch</Text>
                  <Text>• Brake Systems</Text>
                  <Text>• Clutch and Automatic</Text>
                  <Text>• Transmission Systems</Text>
                  <Text>• Suspension and Shock Absorbers</Text>
                  <Text>• Auto Electrical Systems</Text>
                  <Text>• Exhaust Systems</Text>
                  <Text>• Cooling Systems</Text>
                  <Text>• Air-Conditioning Systems</Text>
                  <Text>• Ignition Systems</Text>
                </VStack>
              </Box>
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

      {/* Recruitment Section */}
      <Box as="section" minH="60vh">
        <Flex direction={{ base: "column", lg: "row" }} h="full">
          {/* Left Side - Recruitment Content - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            bg="white"
            p={{ base: 8, md: 10, lg: 12 }}
            display="flex"
            alignItems="center"
            order={{ base: 1, lg: 2 }}
          >
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              gap={6}
              color="gray.800"
            >
              <Box textAlign={{ base: "center", lg: "left" }}>
                <Text
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  color="#d80c19"
                  lineHeight="1.1"
                >
                  Join the team!
                </Text>
                <Box
                  w="32"
                  h="1"
                  bg="black"
                  mt={2}
                  mx={{ base: "auto", lg: "0" }}
                />
              </Box>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.7"
                color="gray.700"
                textAlign={{ base: "center", lg: "left" }}
              >
                We are looking for experienced mechanics to join our Workshop
                Team. If you are interested in a position, get in touch with us
                today.
              </Text>

              <VStack align={{ base: "center", lg: "flex-start" }} gap={4}>
                {/* Phone Contact */}
                <Button
                  bg="gray.900"
                  color="white"
                  _hover={{ bg: "gray.800" }}
                  size="md"
                  px={6}
                  py={4}
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="lg"
                  transition="all 0.3s ease"
                >
                  <Box as="span" display="inline-flex" mr={2}>
                    <Box color="#d80c19" transform="rotate(90deg)">
                      <FaPhone />
                    </Box>
                  </Box>
                  <a
                    href="tel:0296047366"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    02 9604 7366
                  </a>
                </Button>

                {/* Enquire Now Button */}
                <NextLink href="contact">
                  <Button
                    bg="#d80c19"
                    color="white"
                    _hover={{ bg: "#b30915", transform: "translateY(-2px)" }}
                    size="md"
                    px={6}
                    py={4}
                    fontSize="md"
                    fontWeight="600"
                    borderRadius="lg"
                    transition="all 0.3s ease"
                    textTransform="uppercase"
                  >
                    Enquire Now
                  </Button>
                </NextLink>
              </VStack>
            </VStack>
          </Box>

          {/* Right Side - Mechanic Image - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            position="relative"
            order={{ base: 2, lg: 1 }}
          >
            <Image
              src="/workshopthird.jpg"
              alt="Mechanic Working on Engine"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>

      {/* Quote Request Section */}
      <Box id="quote-request">
        <QuoteRequest />
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default WorkshopHero;
