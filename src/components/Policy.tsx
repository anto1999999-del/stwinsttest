"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "./Footer";

const Policy = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
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
      case "fullName":
        return value.trim().length < 2
          ? "Full name must be at least 2 characters"
          : "";
      case "email":
        return !validateEmail(value)
          ? "Please enter a valid email address"
          : "";
      case "subject":
        return !value || value === "" ? "Please select a subject" : "";
      case "message":
        return value.trim().length < 10
          ? "Message must be at least 10 characters"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
      toast.error("Please fix the errors below before sending");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        "Message sent successfully! We'll get back to you within 24 hours."
      );
      // console.log("Policy form submitted:", formData);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Policy form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="section" minH="100vh" bg="gray.800" color="white" py={20}>
      <Box maxW="1400px" mx="auto" px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 16, lg: 24 }}
        >
          {/* Left Section - Shipping Policy */}
          <Box flex="1">
            <VStack align="flex-start" gap={8}>
              {/* Title */}
              <Box position="relative">
                <Text
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  color="white"
                  mb={3}
                >
                  Comprehensive Shipping Policy for S-TWINS SPARES Orders
                </Text>
                <Box
                  w="full"
                  h="3px"
                  bg="#d80c19"
                  position="absolute"
                  bottom="-8px"
                  left="0"
                />
              </Box>

              {/* Introduction */}
              <Text
                fontSize={{ base: "md", lg: "lg" }}
                color="gray.300"
                lineHeight="1.7"
              >
                Thank you for considering to shop with us. Below is a summary of
                our shipping policies:
              </Text>

              {/* Policy Details */}
              <VStack align="flex-start" gap={4} w="full">
                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    We offer same business day shipping for orders placed before
                    11 am in the Sydney Metro area.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    For standard deliveries within Australia, we provide 1-2
                    working days for deliveries.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    Shipping is available Australia wide.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    We make every effort to process and ship orders as quickly
                    as possible, but please note that there may be circumstances
                    that cause delays. If there will be a significant delay in
                    the shipment of your order, we will contact you via email or
                    telephone.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    We encourage you to review your shipping address carefully
                    before placing your order to ensure that it is accurate and
                    complete. We are not responsible for lost or misdirected
                    shipments due to incorrect or incomplete shipping
                    information provided by the customer.
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Right Section - Returns Policy */}
          <Box flex="1">
            <VStack align="flex-start" gap={8}>
              {/* Title */}
              <Box position="relative">
                <Text
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  color="white"
                  mb={3}
                >
                  Returns Policy
                </Text>
                <Box
                  w="full"
                  h="3px"
                  bg="#d80c19"
                  position="absolute"
                  bottom="-8px"
                  left="0"
                />
              </Box>

              {/* Introduction */}
              <Text
                fontSize={{ base: "md", lg: "lg" }}
                color="gray.300"
                lineHeight="1.7"
              >
                We value your business and strive to provide high-quality
                products that meet your needs. In the event that you need to
                return a product, please review the following return policy:
              </Text>

              {/* Policy Details */}
              <VStack align="flex-start" gap={4} w="full">
                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    We will accept returns of products within 30 days of
                    purchase, provided that they are returned with all
                    components complete, undamaged, and in resalable condition,
                    along with proof of purchase.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    If you receive a product that is different from what was
                    described in the product listing, please contact us as soon
                    as possible so that we can resolve the issue.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    If a car part is faulty or damaged upon arrival, please
                    contact us so that we can assess the issue and offer a
                    refund if appropriate.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    Please note that we cannot accept returns of products that
                    have been modified or customized in any way.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    If the item is new and has not been fitted, it can be
                    returned. If the item is new and had been fitted, it can
                    only be exchanged if the item is faulty.
                  </Text>
                </HStack>

                <HStack gap={3} align="flex-start">
                  <Box
                    w="3"
                    h="3"
                    bg="#d80c19"
                    borderRadius="full"
                    mt={2}
                    flexShrink={0}
                  />
                  <Text color="white" fontSize={{ base: "md", lg: "lg" }}>
                    If you have fitted a new part, it cannot be returned for a
                    refund. This policy ensures the quality and safety of our
                    products.
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Flex>

        {/* Form Section */}
        <Box mt={20}>
          <VStack align="center" gap={8}>
            {/* Form Title */}
            <Box position="relative" textAlign="center">
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="white"
                mb={3}
              >
                Contact Us About Policies
              </Text>
              <Box
                w="60%"
                h="3px"
                bg="#d80c19"
                position="absolute"
                bottom="-8px"
                left="50%"
                transform="translateX(-50%)"
              />
            </Box>

            {/* Form Description */}
            <Text
              fontSize={{ base: "md", lg: "lg" }}
              color="gray.300"
              lineHeight="1.7"
              textAlign="center"
              maxW="600px"
            >
              Have questions about our shipping or return policies? Fill out the
              form below and we&apos;ll get back to you as soon as possible.
            </Text>

            {/* Contact Form */}
            <Box
              bg="gray.700"
              p={{ base: 6, md: 8, lg: 10 }}
              borderRadius="lg"
              w="full"
              maxW="600px"
            >
              <VStack gap={6} align="stretch">
                {/* Name and Email Row */}
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <Box flex="1">
                    <Text color="white" mb={2} fontWeight="500">
                      Full Name *
                    </Text>
                    <Input
                      name="fullName"
                      w="full"
                      bg="gray.600"
                      border="1px solid"
                      borderColor={errors.fullName ? "red.500" : "gray.500"}
                      borderRadius="md"
                      color="white"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      _placeholder={{ color: "gray.400" }}
                      _focus={{
                        borderColor: errors.fullName ? "red.500" : "#d80c19",
                        boxShadow: errors.fullName
                          ? "0 0 0 1px red.500"
                          : "0 0 0 1px #d80c19",
                      }}
                    />
                    {errors.fullName && (
                      <Text color="red.400" fontSize="sm" mt={1}>
                        {errors.fullName}
                      </Text>
                    )}
                  </Box>
                  <Box flex="1">
                    <Text color="white" mb={2} fontWeight="500">
                      Email *
                    </Text>
                    <Input
                      name="email"
                      w="full"
                      bg="gray.600"
                      border="1px solid"
                      borderColor={errors.email ? "red.500" : "gray.500"}
                      borderRadius="md"
                      color="white"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      _placeholder={{ color: "gray.400" }}
                      _focus={{
                        borderColor: errors.email ? "red.500" : "#d80c19",
                        boxShadow: errors.email
                          ? "0 0 0 1px red.500"
                          : "0 0 0 1px #d80c19",
                      }}
                    />
                    {errors.email && (
                      <Text color="red.400" fontSize="sm" mt={1}>
                        {errors.email}
                      </Text>
                    )}
                  </Box>
                </Flex>

                {/* Subject */}
                <Box>
                  <Text color="white" mb={2} fontWeight="500">
                    Subject *
                  </Text>
                  <select
                    name="subject"
                    style={{
                      width: "100%",
                      backgroundColor: "#4A5568",
                      border: `1px solid ${
                        errors.subject ? "#E53E3E" : "#718096"
                      }`,
                      borderRadius: "6px",
                      color: "white",
                      padding: "12px",
                      fontSize: "16px",
                    }}
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a subject</option>
                    <option value="shipping">Shipping Policy Question</option>
                    <option value="returns">Returns Policy Question</option>
                    <option value="general">General Policy Question</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <Text color="red.400" fontSize="sm" mt={1}>
                      {errors.subject}
                    </Text>
                  )}
                </Box>

                {/* Message */}
                <Box>
                  <Text color="white" mb={2} fontWeight="500">
                    Message *
                  </Text>
                  <Textarea
                    name="message"
                    w="full"
                    bg="gray.600"
                    border="1px solid"
                    borderColor={errors.message ? "red.500" : "gray.500"}
                    borderRadius="md"
                    color="white"
                    placeholder="Please describe your question or concern..."
                    value={formData.message}
                    onChange={handleInputChange}
                    _placeholder={{ color: "gray.400" }}
                    rows={5}
                    resize="vertical"
                    _focus={{
                      borderColor: errors.message ? "red.500" : "#d80c19",
                      boxShadow: errors.message
                        ? "0 0 0 1px red.500"
                        : "0 0 0 1px #d80c19",
                    }}
                  />
                  {errors.message && (
                    <Text color="red.400" fontSize="sm" mt={1}>
                      {errors.message}
                    </Text>
                  )}
                </Box>

                {/* Submit Button */}
                <Button
                  bg="#d80c19"
                  color="white"
                  _hover={{ bg: "#b30915" }}
                  size="lg"
                  py={4}
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="md"
                  transition="all 0.3s ease"
                  w="full"
                  onClick={onSubmit}
                  loading={isSubmitting}
                  loadingText="Sending..."
                  disabled={isSubmitting}
                >
                  Send Message
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />      
    </Box>
  );
};

export default Policy;
