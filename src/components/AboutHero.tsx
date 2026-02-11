"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Image,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import Link from "next/link";
import QuoteRequest from "./QuoteRequest";
import Footer from "./Footer";
import Services from "./Services";
import { heroFont } from "@/shared/lib/heroFont";

const AboutHero = () => {
  return (
    <>
      <Box as="section" minH="80vh" position="relative">
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
            src="/aboutushero.jpg"
            alt="About Us - STWINS Team"
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
          alignItems={{ base: "center", lg: "flex-start" }}
          justifyContent={{ base: "center", lg: "flex-start" }}
          px={{ base: 8, md: 12, lg: 16 }}
          pt={{ base: "55%", lg: "15%" }}
        >
          {/* Left Side Centered ABOUT US Text */}
          <Box
            color="white"
            textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            textAlign={{ base: "center", lg: "left" }}
            maxW="500px"
            display="flex"
            alignItems="center"
            h="50%"
          >
            <VStack align={{ base: "center", lg: "flex-start" }} gap={2}>
              <Text
                as="h1"
                fontFamily={heroFont}
                fontSize={{ base: "5xl", md: "7xl", lg: "70px" }}
                fontWeight="700"
                lineHeight={{ base: "0.9", lg: "75px" }}
                letterSpacing="tight"
                textTransform="uppercase"
                color="#FFFFFF"
              >
                ABOUT US
              </Text>
            </VStack>
          </Box>
        </Box>        
      </Box>

      {/* About Content Section - Split Design */}
      <Box as="section" height="1000px" position="relative">
        <Flex direction={{ base: "column", lg: "row" }} h="full">
          {/* Left Side - Red Background with Content - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            bg="#d80c19"
            p={{ base: 12, md: 16, lg: 20 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              gap={8}
              color="white"
              maxW="600px"
            >
              {/* Main Heading */}
              <Text
                as="h2"
                fontSize={{ base: "3xl", md: "4xl", lg: "4xl" }}
                fontWeight="900"
                textAlign={{ base: "center", lg: "left" }}
                lineHeight="1.1"
                fontFamily="'MADE Outer Sans', sans-serif"
              >
                Sydney&apos;s leading used car parts specialists.
              </Text>

              {/* Black Line */}
              <Box w="100%" h="4px" bg="black" />

              {/* Subheading */}
              <Text
                as="h3"
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                fontWeight="700"
                textAlign={{ base: "center", lg: "left" }}
                lineHeight="1.3"
                fontFamily="'MADE Outer Sans', sans-serif"
              >
                Sydney&apos;s leading used and new spare part specialists
              </Text>

              {/* Car Models List */}
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "1xl" }}
                fontWeight="400"
                textAlign={{ base: "center", lg: "left" }}
                lineHeight="1.5"
                fontFamily="'Roboto', sans-serif"
              >
                Many models in stock including Chrysler 300 (SRT & SRT Core),
                Chrysler 300C, Chrysler Grand Voyager, Jeep Patriot, Jeep
                Compass, Jeep Cherokee, Jeep Grand Cherokee (SRT, Limited,
                Laredo, Overland) Dodge Journey, Dodge Nitro.
              </Text>

              {/* Quote */}
              <Text
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                fontStyle="italic"
                fontWeight="600"
                textAlign={{ base: "center", lg: "left" }}
                lineHeight="1.3"
                color="white"
                fontFamily="'MADE Outer Sans', sans-serif"
              >
                &ldquo;We have thousands of quality used
                <br />
                car parts and we offer warranty on all
                <br />
                our used parts.&rdquo;
              </Text>

              {/* Final Description */}
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="400"
                textAlign={{ base: "center", lg: "left" }}
                lineHeight="1.5"
                fontFamily="'Roboto', sans-serif"
              >
                We offer a professional service to all of our customers and our
                team in the parts department will be pleased to help you with
                any parts inquiries you have.
              </Text>
            </VStack>
          </Box>

          {/* Right Side - Image - 50% width */}
          <Box w={{ base: "100%", lg: "50%" }} position="relative">
            <Image
              src="/about1.jpg"
              alt="STWINS Team"
              w="full"
              h="full"
              objectFit="cover"
              objectPosition="center"
            />
          </Box>
        </Flex>
      </Box>

      {/* We're Here to Help Section - Split Design */}
      <Box as="section" minH="60vh" position="relative">
        <Flex direction={{ base: "column", lg: "row" }} h="full">
          {/* Left Side - Image - 50% width */}
          <Box w={{ base: "100%", lg: "50%" }} position="relative">
            <Image
              src="/aboutus2.jpg"
              alt="S-TWINS Team"
              w="full"
              h="full"
              objectFit="cover"
              objectPosition="center"
            />
          </Box>

          {/* Right Side - White Background with Content - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            bg="white"
            p={{ base: 12, md: 16, lg: 20 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              gap={8}
              color="black"
              maxW="600px"
            >
              {/* Main Heading */}
              <Text
                as="h2"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="900"
                textAlign={{ base: "center", lg: "left" }}
                lineHeight="1.1"
                fontFamily="'MADE Outer Sans', sans-serif"
                color="#d80c19"
              >
                We&apos;re here to help!
              </Text>

              {/* Black Line */}
              <Box w="100%" h="4px" bg="black" />

              {/* Body Text */}
              <VStack align={{ base: "center", lg: "flex-start" }} gap={4}>
                <Text
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  fontWeight="400"
                  textAlign={{ base: "center", lg: "left" }}
                  lineHeight="1.5"
                  fontFamily="'Roboto', sans-serif"
                  color="black"
                >
                  Our experienced team are always happy to help you with any
                  problems or questions you may have.
                </Text>

                <Text
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  fontWeight="400"
                  textAlign={{ base: "center", lg: "left" }}
                  lineHeight="1.5"
                  fontFamily="'Roboto', sans-serif"
                  color="black"
                >
                  If you cannot find what you are looking for please call a
                  member of our helpful team or submit an enquiry and we&apos;ll
                  do our best to fulfil your request.
                </Text>
              </VStack>

              {/* Call to Action Buttons */}
              <HStack
                align={{ base: "center", lg: "flex-start" }}
                flexDirection={{ base: "column", lg: "row" }}
                w="full"
                gap={4}
              >
                <Link href="tel:0296047366">
                  <Button
                    bg="black"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    size="lg"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="md"
                    as="a"
                  >
                    <HStack gap={3}>
                      <FaPhone
                        color="#d80c19"
                        size={18}
                        style={{ transform: "rotate(90deg)" }}
                      />
                      <Text>02 9604 7366</Text>
                    </HStack>
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button
                    bg="#d80c19"
                    color="white"
                    _hover={{ bg: "red.700" }}
                    size="lg"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="md"
                    as="a"
                  >
                    Enquire Now
                  </Button>
                </Link>
              </HStack>

              {/* Additional Information */}
              <VStack align={{ base: "center", lg: "flex-start" }} gap={4}>
                <Text
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  fontWeight="700"
                  textAlign={{ base: "center", lg: "left" }}
                  lineHeight="1.5"
                  fontFamily="'Roboto', sans-serif"
                  color="black"
                >
                  Nationwide delivery available!
                </Text>

                <Text
                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                  fontWeight="400"
                  textAlign={{ base: "center", lg: "left" }}
                  lineHeight="1.5"
                  fontFamily="'Roboto', sans-serif"
                  color="black"
                >
                  For local customers we can also arrange fitting for engines &
                  gearboxes. All mechanical work is conducted through a licensed
                  mechanical workshop. Please contact the office for all parts
                  enquiries.
                </Text>
              </VStack>
            </VStack>
          </Box>
        </Flex>
      </Box>

      {/* Our Services Section */}
      <Services />

      {/* Quote Request Section */}
      <QuoteRequest />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default AboutHero;
