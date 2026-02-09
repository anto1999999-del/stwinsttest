"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Icon,
  Image,
  Link,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaStore,
  FaPhone,
  FaShoppingBag,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import NextLink from "next/link";
import { useState } from "react";
import QuoteRequest from "./QuoteRequest";

const AboutZip = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0); // First FAQ open by default

  const faqData = [
    {
      question: "How long does it take to apply?",
      answer:
        "Applications take around 5 minutes to complete. Make sure you have your online banking login details, proof of identity and employment information handy to help with a speedy application. Most applications are decided within the same business day, however applications submitted on weekends or that require further information may take longer.",
    },
    {
      question: "Where can I shop with Zip?",
      answer:
        "You can shop at over 58,000 Zip partners both online and in-store. From fashion and electronics to home and garden, you'll find Zip accepted at your favorite retailers across Australia.",
    },
    {
      question: "How do repayments work?",
      answer:
        "With Zip Pay, you can spread your repayments over a month or longer with no interest. With Zip Money, you get up to 6 months interest-free on purchases. You can make payments anytime through the Zip app or website.",
    },
    {
      question: "How do refunds work?",
      answer:
        "If you return an item purchased with Zip, the refund will be processed back to your Zip account. This will reduce your balance and any future payments will be adjusted accordingly.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <Box as="section" py={20}>
      <Box bg="">
        <Box maxW="1200px" mx="auto" px={{ base: 6, md: 8, lg: 12 }}>
          {/* Page Title */}
          <Text
            fontSize={{ base: "2xl", md: "3xl", lg: "3xl" }}
            fontWeight="bold"
            color="gray.800"
            textAlign="center"
            mb={12}
          >
            Discover Everything About Zip: Your Guide to Its Features and
            Services
          </Text>

          {/* Hero Section */}
          <Box
            bg="#4C1D95"
            borderRadius="xl"
            p={{ base: 8, md: 12, lg: 16 }}
            mb={16}
            position="relative"
            overflow="hidden"
            minH="400px"
          >
            {/* Light Purple Diagonal Section */}
            <Box
              position="absolute"
              top="0"
              right="0"
              w="35%"
              h="100%"
              bg="#A78BFA"
              clipPath="polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)"
            />

            <Flex
              direction={{ base: "column", lg: "row" }}
              align="center"
              gap={8}
              position="relative"
              zIndex={2}
              h="full"
            >
              {/* Left Content */}
              <Box flex="1" color="white" pt={8}>
                <VStack align={{ base: "center", lg: "flex-start" }} gap={6}>
                  {/* Logo */}
                  <HStack gap={2}>
                    <Text fontSize="4xl" fontWeight="bold">
                      ZİP
                    </Text>
                    <Box w="12px" h="12px" bg="#A78BFA" borderRadius="sm" />
                  </HStack>

                  {/* Main Headline */}
                  <VStack align={{ base: "center", lg: "flex-start" }} gap={2}>
                    <Text
                      fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                      fontWeight="bold"
                      lineHeight="1.1"
                      textAlign={{ base: "center", lg: "left" }}
                    >
                      The better way to pay
                    </Text>
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      opacity="0.9"
                      textAlign={{ base: "center", lg: "left" }}
                    >
                      Make it easier to pay for your purchases
                    </Text>
                  </VStack>

                  {/* Rating */}
                  <HStack gap={2} mt={4}>
                    <HStack gap={1}>
                      <Text fontSize="sm" opacity="0.8">
                        ZİP
                      </Text>
                      <Box w="6px" h="6px" bg="#A78BFA" borderRadius="sm" />
                    </HStack>
                    <Text fontSize="sm" fontWeight="bold">
                      4.9
                    </Text>
                    <HStack gap={1}>
                      {[...Array(4)].map((_, i) => (
                        <Text key={i} color="#A78BFA">
                          ★
                        </Text>
                      ))}
                      <Text color="#A78BFA" opacity="0.3">
                        ★
                      </Text>
                    </HStack>
                    <Text fontSize="sm" opacity="0.8">
                      App store rating
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Right Section - Light Purple */}
              <Box flex="1" display={{ base: "none", lg: "block" }} />
            </Flex>
          </Box>

          {/* Zip Pay vs Zip Money Section */}
          <Box mb={16}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={8}
              w="full"
              maxW="1000px"
              mx="auto"
            >
              {/* Zip Pay Panel */}
              <Box
                bg="white"
                p={8}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="lg"
              >
                <VStack align="flex-start" gap={6}>
                  {/* Logo */}
                  <HStack gap={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="#4C1D95">
                      ZIP
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="#A78BFA">
                      PAY
                    </Text>
                    <Box w="8px" h="8px" bg="#A78BFA" borderRadius="sm" />
                  </HStack>

                  {/* Features List */}
                  <VStack align="flex-start" gap={3}>
                    {[
                      "Up to $1,000 credit limit",
                      "Pay nothing today",
                      "Always interest free^",
                      "Spread repayments over a month or longer",
                      "$9.95/mth account fee or $0 if nothing owing",
                    ].map((feature, index) => (
                      <HStack key={index} gap={3} align="flex-start">
                        <Box
                          w="6px"
                          h="6px"
                          bg="#A78BFA"
                          borderRadius="sm"
                          mt={2}
                        />
                        <Text fontSize="md" color="gray.700">
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  {/* Apply Button */}
                  <Link
                    href="https://start.zip.co/region-select"
                    target="_blank"
                    rel="noopener noreferrer"
                    textDecoration="none"
                  >
                    <Button
                      bg="#4C1D95"
                      color="white"
                      _hover={{ bg: "#3730A3" }}
                      size="lg"
                      w="full"
                      py={6}
                      fontSize="lg"
                      fontWeight="bold"
                      borderRadius="lg"
                    >
                      Apply now
                    </Button>
                  </Link>
                </VStack>
              </Box>

              {/* Zip Money Panel */}
              <Box
                bg="white"
                p={8}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="lg"
              >
                <VStack align="flex-start" gap={6}>
                  {/* Logo */}
                  <HStack gap={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="#4C1D95">
                      ZIP
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="#A78BFA">
                      MONEY
                    </Text>
                    <Box w="8px" h="8px" bg="#A78BFA" borderRadius="sm" />
                  </HStack>

                  {/* Features List */}
                  <VStack align="flex-start" gap={3}>
                    {[
                      "Apply for $1,000 - $5,000 credit limit",
                      "Pay nothing today",
                      "Up to 6 months interest free*",
                      "$9.95/mth account fee or $0 if nothing owing",
                      "One off establishment fee up to $99 may apply",
                    ].map((feature, index) => (
                      <HStack key={index} gap={3} align="flex-start">
                        <Box
                          w="6px"
                          h="6px"
                          bg="#A78BFA"
                          borderRadius="sm"
                          mt={2}
                        />
                        <Text fontSize="md" color="gray.700">
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  {/* Apply Button */}
                  <Link
                    href="https://start.zip.co/region-select"
                    target="_blank"
                    rel="noopener noreferrer"
                    textDecoration="none"
                  >
                    <Button
                      bg="#4C1D95"
                      color="white"
                      _hover={{ bg: "#3730A3" }}
                      size="lg"
                      w="full"
                      py={6}
                      fontSize="lg"
                      fontWeight="bold"
                      borderRadius="lg"
                    >
                      Apply now
                    </Button>
                  </Link>
                </VStack>
              </Box>
            </Grid>
          </Box>

          {/* What You'll Need Section */}
          <Box mb={16} minH="500px">
            <Flex
              direction={{ base: "column", lg: "row" }}
              align="center"
              h="full"
              position="relative"
            >
              {/* Left Content */}
              <Box
                flex="1"
                bg="#F7F3F0"
                p={{ base: 8, md: 12, lg: 16 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH={{ base: "auto", lg: "500px" }}
              >
                <VStack align="flex-start" gap={8} maxW="500px">
                  <Text
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    fontWeight="bold"
                    color="gray.800"
                    textAlign="left"
                  >
                    What you&apos;ll need to apply
                  </Text>

                  <VStack align="flex-start" gap={4} w="full">
                    {[
                      "Your employment details",
                      "Your residential details",
                      "Your online banking login to verify your income",
                      "Your passport or driver licence",
                    ].map((item, index) => (
                      <HStack key={index} gap={4} align="flex-start">
                        <Box
                          w="20px"
                          h="20px"
                          bg="#A78BFA"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          <Icon as={FaCheck} color="white" fontSize="sm" />
                        </Box>
                        <Text fontSize="lg" color="gray.700">
                          {item}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Link
                    href="https://start.zip.co/region-select"
                    target="_blank"
                    rel="noopener noreferrer"
                    textDecoration="none"
                  >
                    <Button
                      bg="#4C1D95"
                      color="white"
                      _hover={{ bg: "#3730A3" }}
                      size="lg"
                      px={8}
                      py={6}
                      fontSize="lg"
                      fontWeight="bold"
                      borderRadius="lg"
                      w="full"
                    >
                      Apply now
                    </Button>
                  </Link>
                </VStack>
              </Box>

              {/* Right Section - Image with Purple Background */}
              <Box
                flex="1"
                position="relative"
                minH={{ base: "300px", lg: "500px" }}
                overflow="hidden"
              >
                {/* Purple Diagonal Background */}
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  w="100%"
                  h="100%"
                  bg="#4C1D95"
                  clipPath="polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)"
                />

                {/* Image */}
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  w="100%"
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  zIndex={2}
                >
                  <Box
                    w="80%"
                    h="80%"
                    position="relative"
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <Image
                      src="/image-zip.avif"
                      alt="Person using Zip app"
                      w="full"
                      h="full"
                      objectFit="cover"
                      objectPosition="center"
                    />
                  </Box>
                </Box>
              </Box>
            </Flex>
          </Box>

          {/* Features Section */}
          <Box mb={16}>
            <VStack gap={12}>
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="gray.800"
                textAlign="center"
              >
                Why Choose Zip
              </Text>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={8}
                w="full"
              >
                {/* We're Local */}
                <VStack gap={4} p={6} bg="gray.50" borderRadius="xl">
                  <Icon as={FaStore} color="#6B46C1" fontSize="3xl" />
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    We&apos;re local
                  </Text>
                  <Text fontSize="md" color="gray.600" textAlign="center">
                    Zip is Australian owned and founded
                  </Text>
                </VStack>

                {/* We're Here to Help */}
                <VStack gap={4} p={6} bg="gray.50" borderRadius="xl">
                  <Icon as={FaPhone} color="#6B46C1" fontSize="3xl" />
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    We&apos;re here to help
                  </Text>
                  <Text fontSize="md" color="gray.600" textAlign="center">
                    Talk to our Sydney-based customer service 6 days a week
                  </Text>
                </VStack>

                {/* We're Almost Everywhere */}
                <VStack gap={4} p={6} bg="gray.50" borderRadius="xl">
                  <Icon as={FaShoppingBag} color="#6B46C1" fontSize="3xl" />
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    We&apos;re almost everywhere
                  </Text>
                  <Text fontSize="md" color="gray.600" textAlign="center">
                    Shop online and instore at over 58,000 Zip partners
                  </Text>
                </VStack>
              </Grid>
            </VStack>
          </Box>

          {/* Reviews Section */}
          <Box mb={16}>
            <VStack gap={12}>
              <VStack gap={4}>
                <Text
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  color="#6B46C1"
                  textAlign="center"
                >
                  Loved by millions of shoppers globally and counting
                </Text>
                <Text fontSize="lg" color="gray.600" textAlign="center">
                  Reviews from the{" "}
                  <Text as="span" textDecoration="underline" cursor="pointer">
                    App Store
                  </Text>
                </Text>
              </VStack>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={8}
                w="full"
              >
                {/* Review 1 */}
                <Box
                  p={6}
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <VStack align="flex-start" gap={4}>
                    <HStack gap={1}>
                      {[...Array(5)].map((_, i) => (
                        <Text key={i} color="#6B46C1">
                          ★
                        </Text>
                      ))}
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      My favourite digital wallet
                    </Text>
                    <Text fontSize="md" color="gray.600" lineHeight="1.6">
                      Simple app easy to navigate, makes purchasing easy &
                      you&apos;re in control when it comes to your repayments.
                      I&apos;ve now been using zip money for 4 years and
                      absolutely love it & recommend to all my friends.
                    </Text>
                    <HStack gap={2}>
                      <Icon as={FaCheck} color="#6B46C1" fontSize="sm" />
                      <Text fontSize="sm" color="gray.500">
                        Verified
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Review 2 */}
                <Box
                  p={6}
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <VStack align="flex-start" gap={4}>
                    <HStack gap={1}>
                      {[...Array(5)].map((_, i) => (
                        <Text key={i} color="#6B46C1">
                          ★
                        </Text>
                      ))}
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Such a great app.
                    </Text>
                    <Text fontSize="md" color="gray.600" lineHeight="1.6">
                      I am very organised when it comes to my finance and having
                      zip makes my shopping activity easier and convenient,
                      especially doing online shopping.
                    </Text>
                    <HStack gap={2}>
                      <Icon as={FaCheck} color="#6B46C1" fontSize="sm" />
                      <Text fontSize="sm" color="gray.500">
                        Verified
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </Grid>
            </VStack>
          </Box>

          {/* FAQ Section */}
          <Box py={16}>
            <VStack gap={12} w="full" maxW="800px" mx="auto">
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="#6B46C1"
                textAlign="center"
              >
                Frequently Asked Questions
              </Text>

              <VStack gap={0} w="full">
                {faqData.map((faq, index) => (
                  <Box
                    key={index}
                    w="full"
                    bg="white"
                    border="1px solid"
                    borderColor={openFAQ === index ? "#6B46C1" : "gray.200"}
                    borderTop={index === 0 ? "1px solid" : "none"}
                    borderBottom="1px solid"
                    borderBottomColor="gray.200"
                    overflow="hidden"
                    transition="all 0.3s ease"
                    _first={{ borderTopRadius: "lg" }}
                    _last={{ borderBottomRadius: "lg" }}
                  >
                    {/* Question Header */}
                    <Box
                      p={6}
                      cursor="pointer"
                      onClick={() => toggleFAQ(index)}
                      _hover={{ bg: "gray.50" }}
                      transition="all 0.2s"
                    >
                      <HStack justify="space-between" align="center">
                        <Text fontSize="lg" fontWeight="600" color="gray.800">
                          {faq.question}
                        </Text>
                        <Icon
                          as={openFAQ === index ? FaChevronUp : FaChevronDown}
                          color="#6B46C1"
                          fontSize="lg"
                          transition="transform 0.2s"
                        />
                      </HStack>
                    </Box>

                    {/* Answer Content */}
                    <Box
                      overflow="hidden"
                      transition="all 0.4s ease-in-out"
                      maxH={openFAQ === index ? "200px" : "0px"}
                      opacity={openFAQ === index ? 1 : 0}
                    >
                      <Box
                        px={6}
                        pb={6}
                        borderTop="1px solid"
                        borderColor="gray.100"
                        bg="gray.50"
                      >
                        <Text
                          fontSize="md"
                          color="gray.700"
                          lineHeight="1.6"
                          pt={4}
                        >
                          {faq.answer}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </VStack>
            </VStack>
          </Box>

          {/* Terms and Conditions */}
          <Box maxW="1200px" mx="auto" px={6} py={12}>
            <VStack align="stretch" gap={4}>
              <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                T&Cs, fees and credit approval apply. Other charges may be
                payable. Credit provided by ZipMoney Payments Pty Ltd (ABN 58
                164 440 993), Australian Credit Licence Number 441878.
              </Text>

              <VStack align="stretch" gap={3}>
                <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                  <Text as="span" fontWeight="bold">
                    Zip Money:
                  </Text>{" "}
                  Interest free period is available on purchases over $1000.
                  Interest free period depends on purchase amount, minimum
                  monthly repayment and account status. Minimum monthly
                  repayments are required and vary by credit limit. Minimum
                  repayments may not fully repay the purchase within the
                  interest-free period. Any outstanding purchase amount after
                  the interest-free period will be charged at a standard
                  variable interest rate of 25.9% per annum, as at 1 June 2023.
                  Zip Money is available to approved applicants after a
                  satisfactory credit assessment. A monthly account fee of $9.95
                  applies. A one-off establishment fee may apply for new
                  customers. Other charges may be payable. Interest, fees and
                  charges are subject to change. Terms and Conditions apply and
                  are available on application. Credit provided by ZipMoney
                  Payments Pty Ltd (ABN 58 164 440 993), Australian Credit
                  Licence Number 441878.
                </Text>

                <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                  <Text as="span" fontWeight="bold">
                    Zip Visa Card:
                  </Text>{" "}
                  Zip Visa Card is available with Zip Pay and Zip Plus.{" "}
                  <NextLink
                    href="#"
                    color="blue.500"
                    style={{ textDecoration: "underline" }}
                  >
                    Zip Visa Card T&Cs
                  </NextLink>
                </Text>

                <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                  <Text as="span" fontWeight="bold">
                    Zip Pay:
                  </Text>{" "}
                  Minimum monthly repayments are required. A monthly account fee
                  of $9.95 applies and is subject to change. The fee will be
                  waived if the closing balance is paid in full by the due date
                  each month. Available to approved applicants only, subject to
                  satisfactory credit assessment. Other charges may be payable.
                  Fees and charges are subject to change. T&Cs apply. Credit
                  provided by ZipMoney Payments Pty Ltd (ABN 58 164 440 993),
                  Australian Credit Licence Number 441878.{" "}
                  <NextLink
                    href="https://zip.co/au/zip-pay"
                    color="blue.500"
                    style={{ textDecoration: "underline" }}
                  >
                    Visit zip.co/au/zip-pay to find out more.
                  </NextLink>
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Quote Request Form Section */}
          <QuoteRequest />

          {/* Footer */}
        </Box>
      </Box>
    </Box>
  );
};

export default AboutZip;
