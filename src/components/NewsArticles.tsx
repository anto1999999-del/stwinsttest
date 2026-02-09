"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Image, 
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import QuoteRequest from "./QuoteRequest";
import Footer from "./Footer";
import { heroFont } from "@/shared/lib/heroFont";

const NewsArticles = () => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return value.trim().length < 2
          ? "Name must be at least 2 characters"
          : "";
      case "email":
        return !validateEmail(value)
          ? "Please enter a valid email address"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below before subscribing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        "Successfully subscribed! You'll receive our latest news and updates."
      );
      // console.log("NewsArticles subscription submitted:", formData);

      // Reset form
      setFormData({
        name: "",
        email: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      console.error("NewsArticles subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            src="/News-Articles.png"
            alt="News Articles - S-Twins Workshop"
            w="full"
            h="full"
            objectFit="cover"
            objectPosition="center"
            filter="brightness(0.7) contrast(1.1)"
          />
        </Box>

        {/* Dark Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.4)"
          zIndex={2}
        />

        {/* Content Overlay */}
        <Box
          position="relative"
          zIndex={3}
          h="full"
          display="flex"
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="center"
          px={{ base: 8, md: 12, lg: 16 }}
        >
          {/* Left Section - Text Content */}
          <Box
            flex="1"
            maxW="600px"
            color="white"
            textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            display="flex"
            alignItems="center"
            justifyContent={{ base: "center", lg: "flex-start" }}
            h="full"
            pt={{ base: "50%", lg: "20%" }}
          >
            <VStack align={{ base: "center", lg: "flex-start" }} gap={6}>
              <Text
                as="h2"
                fontSize={{ base: "2xl", md: "5xl", lg: "60px" }}
                fontWeight="bold"
                lineHeight="0.9"
                letterSpacing="tight"
                textTransform="uppercase"
                textAlign="center"
                fontFamily={heroFont}
                whiteSpace={{ base: "normal", md: "nowrap" }}
              >
                NEWS & ARTICLES
              </Text>
            </VStack>
          </Box>
        </Box>        
      </Box>

      {/* Latest News & Updates Section */}
      <Box as="section" bg="gray.900" py={20}>
        <Box maxW="1400px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
          <VStack align={{ base: "center", lg: "flex-start" }} gap={12}>
            {/* Section Title */}
            <Box textAlign={{ base: "center", lg: "left" }}>
              <Text
                fontSize={{ base: "3xl", md: "4xl", lg: "3xl" }}
                fontWeight="bold"
                color="white"
                lineHeight="1.1"
              >
                Latest news & updates
              </Text>
              <Box
                h="1"
                bg="#d80c19"
                w={{ base: "60%", lg: "100%" }}
                mx={{ base: "auto", lg: "0" }}
                mt={3}
              />
            </Box>

            {/* News Article Card */}
            <Box
              h="100%"
              maxW="350px"
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="xl"
            >
              {/* Top Section - Image */}
              <Box position="relative" h="250px">
                <Image
                  src="/yard.png"
                  alt="Car recycling facility"
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>

              {/* Bottom Section - Red Background with Content */}
              <Box bg="#d80c19" p={6}>
                <VStack align="flex-start" gap={4}>
                  {/* Article Title */}
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="bold"
                    color="white"
                    lineHeight="1.3"
                    textTransform="uppercase"
                  >
                    3 QUESTIONS YOU NEED TO ASK BEFORE BUYING RECYCLED CAR PARTS
                    ONLINE
                  </Text>

                  {/* Read More Button */}
                  <Button
                    bg="transparent"
                    color="white"
                    border="2px solid"
                    borderColor="white"
                    _hover={{ bg: "white", color: "#d80c19" }}
                    size="md"
                    px={6}
                    py={3}
                    fontSize="md"
                    fontWeight="600"
                    borderRadius="md"
                    transition="all 0.3s ease"
                    onClick={() =>
                      router.push(
                        "/blog/3-questions-before-buying-recycled-car-parts"
                      )
                    }
                    cursor="pointer"
                  >
                    READ MORE »
                  </Button>

                  {/* Date */}
                  <Text fontSize="sm" color="white" opacity="0.9" mt={2}>
                    19 March 2024
                  </Text>
                </VStack>
              </Box>
            </Box>
          </VStack>
        </Box>
      </Box>

      {/* Subscribe Section - 50/50 Split */}
      <Box as="section">
        <Flex direction={{ base: "column", lg: "row" }} h="600px">
          {/* Left Side - Image - 50% width */}
          <Box w={{ base: "100%", lg: "50%" }} position="relative">
            <Image
              src="/News-Articles-Image-.png"
              alt="S-Twins Office and Vehicle"
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>

          {/* Right Side - Subscription Form - 50% width */}
          <Box
            w={{ base: "100%", lg: "50%" }}
            bg="gray.50"
            p={{ base: 8, md: 12, lg: 16 }}
            display="flex"
            alignItems="center"
          >
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              gap={8}
              w="full"
              maxW="500px"
            >
              <Box textAlign={{ base: "center", lg: "left" }}>
                <Text
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontWeight="bold"
                  color="#d80c19"
                  lineHeight="1.1"
                >
                  Subscribe for news & updates!
                </Text>
                <Box
                  h="1"
                  bg="#d80c19"
                  w={{ base: "60%", lg: "40" }}
                  mx={{ base: "auto", lg: "0" }}
                  mt={3}
                />
              </Box>

              <Text
                as="h2"
                fontSize="32px"
                color="gray.800"
                lineHeight="1.7"
                textAlign={{ base: "center", lg: "left" }}
              >
                Subscribe to be the first to learn about all our latest news and
                offers.
              </Text>

              <VStack gap={6} w="full">
                <Box w="full">
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color="gray.700"
                    mb={2}
                    textAlign={{ base: "center", lg: "left" }}
                  >
                    Name*
                  </Text>
                  <Input
                    name="name"
                    w="full"
                    p={4}
                    border="2px solid"
                    borderColor={errors.name ? "red.500" : "gray.300"}
                    borderRadius="md"
                    fontSize="md"
                    color="gray.800"
                    value={formData.name}
                    onChange={handleInputChange}
                    _focus={{
                      borderColor: errors.name ? "red.500" : "#d80c19",
                      outline: "none",
                    }}
                    _placeholder={{ color: "gray.400" }}
                    placeholder="Enter your name"
                    transition="all 0.3s ease"
                    textAlign={{ base: "center", lg: "left" }}
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.name}
                    </Text>
                  )}
                </Box>

                <Box w="full">
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color="gray.700"
                    mb={2}
                    textAlign={{ base: "center", lg: "left" }}
                  >
                    Email*
                  </Text>
                  <Input
                    name="email"
                    w="full"
                    p={4}
                    border="2px solid"
                    borderColor={errors.email ? "red.500" : "gray.300"}
                    borderRadius="md"
                    fontSize="md"
                    color="gray.800"
                    value={formData.email}
                    onChange={handleInputChange}
                    _focus={{
                      borderColor: errors.email ? "red.500" : "#d80c19",
                      outline: "none",
                    }}
                    _placeholder={{ color: "gray.400" }}
                    placeholder="Enter your email"
                    type="email"
                    transition="all 0.3s ease"
                    textAlign={{ base: "center", lg: "left" }}
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </Box>

                <Button
                  bg="#d80c19"
                  color="white"
                  _hover={{ bg: "#b30915", transform: "translateY(-2px)" }}
                  size="lg"
                  px={8}
                  py={4}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="md"
                  w="full"
                  transition="all 0.3s ease"
                  boxShadow="lg"
                  onClick={onSubmit}
                  loading={isSubmitting}
                  loadingText="Subscribing..."
                  disabled={isSubmitting}
                >
                  Subscribe
                </Button>
              </VStack>
            </VStack>
          </Box>
        </Flex>
      </Box>

      {/* Quote Request Section */}
      <QuoteRequest />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default NewsArticles;
