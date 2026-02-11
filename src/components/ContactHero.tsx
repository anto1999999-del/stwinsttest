"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Image,
  Input,
  Textarea,
} from "@chakra-ui/react";
import {  
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";
import QuoteRequest from "./QuoteRequest";
import Footer from "./Footer";
import { heroFont } from "@/shared/lib/heroFont";

const ContactHero = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 8;
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        return value.trim().length < 2
          ? "First name must be at least 2 characters"
          : "";
      case "lastName":
        return value.trim().length < 2
          ? "Last name must be at least 2 characters"
          : "";
      case "email":
        return !validateEmail(value)
          ? "Please enter a valid email address"
          : "";
      case "phone":
        return !validatePhone(value) ? "Please enter a valid phone number" : "";
      case "subject":
        return value.trim().length < 3
          ? "Subject must be at least 3 characters"
          : "";
      case "message":
        return value.trim().length < 10
          ? "Message must be at least 10 characters"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      toast.error("Please fix the errors below before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        "Message sent successfully! We'll get back to you within 24 hours."
      );
      // console.log("ContactHero form submitted:", formData);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("ContactHero form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            src="/contacthero.jpg"
            alt="S-Twins Team - Get In Touch"
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
            <VStack align={{ base: "center", lg: "flex-start" }} gap={1}>
              <Text
                as="h1"
                fontSize={{ base: "6xl", md: "5xl", lg: "70px" }}
                fontWeight="700"
                lineHeight="75px"
                textAlign={{ base: "center", lg: "left" }}
                color="#FFFFFF"
                fontFamily={heroFont}
              >
                Get in Touch
              </Text>
            </VStack>
          </Box>
        </Box>        
      </Box>

      {/* Contact Form Section */}
      <Box as="section" bg="gray.50" py={20}>
        <Box maxW="1400px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
          <Flex direction={{ base: "column", lg: "row" }} gap={12}>
            {/* Left Side - Contact Information */}
            <Box
              flex="1"
              bg="white"
              p={{ base: 8, md: 12 }}
              borderRadius="xl"
              boxShadow="xl"
            >
              <VStack align="flex-start" gap={8}>
                <Box>
                  <Text
                    fontSize={{ base: "3xl", md: "4xl" }}
                    fontWeight="bold"
                    color="#d80c19"
                    mb={4}
                  >
                    Get In Touch
                  </Text>
                  <Text fontSize="lg" color="gray.600" lineHeight="1.7">
                    Have questions about our services? We&apos;d love to hear
                    from you. Send us a message and we&apos;ll respond as soon
                    as possible.
                  </Text>
                </Box>

                {/* Contact Details */}
                <VStack align="flex-start" gap={8} w="full">
                  {/* First Location */}
                  <VStack align="flex-start" gap={4} w="full">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="gray.800"
                      mb={2}
                    >
                      Smithfield Location
                    </Text>

                    {/* Address */}
                    <HStack gap={4} align="flex-start">
                      <Box color="#d80c19" fontSize="lg" mt={1}>
                        <FaMapMarkerAlt />
                      </Box>
                      <Text
                        fontSize="md"
                        color="gray.600"
                        cursor="pointer"
                        _hover={{ color: "#d80c19" }}
                        onClick={() =>
                          window.open(
                            "https://maps.google.com/?q=755+The+Horsley+Dr+Smithfield+NSW+2164",
                            "_blank"
                          )
                        }
                      >
                        755 The Horsley Dr, Smithfield NSW 2164
                      </Text>
                    </HStack>

                    {/* Phone */}
                    <HStack gap={4} align="flex-start">
                      <Box color="#d80c19" fontSize="lg" mt={1}>
                        <FaPhone style={{ transform: "rotate(90deg)" }} />
                      </Box>
                      <Text
                        fontSize="md"
                        color="gray.600"
                        cursor="pointer"
                        _hover={{ color: "#d80c19" }}
                        onClick={() => window.open("tel:0296047366")}
                      >
                        02 9604 7366
                      </Text>
                    </HStack>

                    {/* Email */}
                    <HStack gap={4} align="flex-start">
                      <Box color="#d80c19" fontSize="lg" mt={1}>
                        <FaEnvelope />
                      </Box>
                      <Text
                        fontSize="md"
                        color="gray.600"
                        cursor="pointer"
                        _hover={{ color: "#d80c19" }}
                        onClick={() =>
                          window.open("mailto:sales@stwins.com.au")
                        }
                      >
                        sales@stwins.com.au
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Second Location */}
                  <VStack align="flex-start" gap={4} w="full">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="gray.800"
                      mb={2}
                    >
                      Tuggerah Location
                    </Text>

                    {/* Address */}
                    <HStack gap={4} align="flex-start">
                      <Box color="#d80c19" fontSize="lg" mt={1}>
                        <FaMapMarkerAlt />
                      </Box>
                      <Text
                        fontSize="md"
                        color="gray.600"
                        cursor="pointer"
                        _hover={{ color: "#d80c19" }}
                        onClick={() =>
                          window.open(
                            "https://maps.google.com/?q=15+Bluegum+Cl+Tuggerah+NSW+2259",
                            "_blank"
                          )
                        }
                      >
                        15 Bluegum Cl, Tuggerah NSW 2259
                      </Text>
                    </HStack>

                    {/* Phone */}
                    <HStack gap={4} align="flex-start">
                      <Box color="#d80c19" fontSize="lg" mt={1}>
                        <FaPhone style={{ transform: "rotate(90deg)" }} />
                      </Box>
                      <Text
                        fontSize="md"
                        color="gray.600"
                        cursor="pointer"
                        _hover={{ color: "#d80c19" }}
                        onClick={() => window.open("tel:0243512222")}
                      >
                        02 4351 2222
                      </Text>
                    </HStack>

                    {/* Email */}
                    <HStack gap={4} align="flex-start">
                      <Box color="#d80c19" fontSize="lg" mt={1}>
                        <FaEnvelope />
                      </Box>
                      <Text
                        fontSize="md"
                        color="gray.600"
                        cursor="pointer"
                        _hover={{ color: "#d80c19" }}
                        onClick={() =>
                          window.open("mailto:sales@stwins.com.au")
                        }
                      >
                        sales@stwins.com.au
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </VStack>
            </Box>

            {/* Right Side - Contact Form */}
            <Box
              flex="1"
              bg="white"
              p={{ base: 8, md: 12 }}
              borderRadius="xl"
              boxShadow="xl"
            >
              <VStack align="stretch" gap={6}>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color="#d80c19"
                  textAlign="center"
                >
                  Send Us a Message
                </Text>

                <VStack gap={4} align="stretch">
                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <Box flex="1">
                      <Input
                        name="firstName"
                        placeholder="First Name*"
                        bg="white"
                        color="gray.800"
                        border="2px solid"
                        borderColor={errors.firstName ? "red.500" : "gray.200"}
                        borderRadius="lg"
                        px={4}
                        py={3}
                        fontSize="md"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        _focus={{
                          borderColor: errors.firstName ? "red.500" : "#d80c19",
                          boxShadow: errors.firstName
                            ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                            : "0 0 0 3px rgba(216, 12, 25, 0.1)",
                        }}
                        _hover={{
                          borderColor: errors.firstName ? "red.500" : "#d80c19",
                        }}
                        transition="all 0.2s ease"
                      />
                      {errors.firstName && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.firstName}
                        </Text>
                      )}
                    </Box>
                    <Box flex="1">
                      <Input
                        name="lastName"
                        placeholder="Last Name*"
                        bg="white"
                        color="gray.800"
                        border="2px solid"
                        borderColor={errors.lastName ? "red.500" : "gray.200"}
                        borderRadius="lg"
                        px={4}
                        py={3}
                        fontSize="md"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        _focus={{
                          borderColor: errors.lastName ? "red.500" : "#d80c19",
                          boxShadow: errors.lastName
                            ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                            : "0 0 0 3px rgba(216, 12, 25, 0.1)",
                        }}
                        _hover={{
                          borderColor: errors.lastName ? "red.500" : "#d80c19",
                        }}
                        transition="all 0.2s ease"
                      />
                      {errors.lastName && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.lastName}
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  <Box>
                    <Input
                      name="email"
                      placeholder="Email Address*"
                      type="email"
                      bg="white"
                      color="gray.800"
                      border="2px solid"
                      borderColor={errors.email ? "red.500" : "gray.200"}
                      borderRadius="lg"
                      px={4}
                      py={3}
                      fontSize="md"
                      value={formData.email}
                      onChange={handleInputChange}
                      _focus={{
                        borderColor: errors.email ? "red.500" : "#d80c19",
                        boxShadow: errors.email
                          ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                          : "0 0 0 3px rgba(216, 12, 25, 0.1)",
                      }}
                      _hover={{
                        borderColor: errors.email ? "red.500" : "#d80c19",
                      }}
                      transition="all 0.2s ease"
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.email}
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Input
                      name="phone"
                      placeholder="Phone Number*"
                      type="tel"
                      bg="white"
                      color="gray.800"
                      border="2px solid"
                      borderColor={errors.phone ? "red.500" : "gray.200"}
                      borderRadius="lg"
                      px={4}
                      py={3}
                      fontSize="md"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onKeyPress={(e) => {
                        if (!/[0-9\s\-\+\(\)]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      _focus={{
                        borderColor: errors.phone ? "red.500" : "#d80c19",
                        boxShadow: errors.phone
                          ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                          : "0 0 0 3px rgba(216, 12, 25, 0.1)",
                      }}
                      _hover={{
                        borderColor: errors.phone ? "red.500" : "#d80c19",
                      }}
                      transition="all 0.2s ease"
                    />
                    {errors.phone && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.phone}
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Input
                      name="subject"
                      placeholder="Subject*"
                      bg="white"
                      color="gray.800"
                      border="2px solid"
                      borderColor={errors.subject ? "red.500" : "gray.200"}
                      borderRadius="lg"
                      px={4}
                      py={3}
                      fontSize="md"
                      value={formData.subject}
                      onChange={handleInputChange}
                      _focus={{
                        borderColor: errors.subject ? "red.500" : "#d80c19",
                        boxShadow: errors.subject
                          ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                          : "0 0 0 3px rgba(216, 12, 25, 0.1)",
                      }}
                      _hover={{
                        borderColor: errors.subject ? "red.500" : "#d80c19",
                      }}
                      transition="all 0.2s ease"
                    />
                    {errors.subject && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.subject}
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Textarea
                      name="message"
                      placeholder="Your Message*"
                      bg="white"
                      color="gray.800"
                      border="2px solid"
                      borderColor={errors.message ? "red.500" : "gray.200"}
                      borderRadius="lg"
                      px={4}
                      py={3}
                      fontSize="md"
                      minH="120px"
                      resize="vertical"
                      value={formData.message}
                      onChange={handleInputChange}
                      _focus={{
                        borderColor: errors.message ? "red.500" : "#d80c19",
                        boxShadow: errors.message
                          ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                          : "0 0 0 3px rgba(216, 12, 25, 0.1)",
                      }}
                      _hover={{
                        borderColor: errors.message ? "red.500" : "#d80c19",
                      }}
                      transition="all 0.2s ease"
                    />
                    {errors.message && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.message}
                      </Text>
                    )}
                  </Box>

                  <Button
                    bg="#d80c19"
                    color="white"
                    _hover={{
                      bg: "#b30915",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    size="lg"
                    py={4}
                    fontSize="lg"
                    fontWeight="600"
                    borderRadius="lg"
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
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Quote Request Section */}
      <QuoteRequest />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default ContactHero;
