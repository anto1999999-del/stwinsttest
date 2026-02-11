"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa";
import { toast } from "sonner";

// Minimal, conflict-free typing for reCAPTCHA v3
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LfU7x8rAAAAAM1dJp-STGH3XAJSq2hJGiX7f8TD"; // v3 site key

// ----- API base (always ends with /api) -----
const API_ORIGIN =
  process.env.NEXT_PUBLIC_BACK_END ||
  process.env.BACK_END ||
  process.env.BACKEND_URL ||
  "http://localhost:3001";

// normalize: remove trailing slashes, remove any existing /api, then add /api
const API_BASE = `${API_ORIGIN.replace(/\/+$/, "").replace(/\/api$/i, "")}/api`;


type FormFields = {
  fullName: string;
  email: string;
  suburb: string;
  phone: string;
  postcode: string;
  make: string;
  year: string;
  model: string;
  partDescription: string;
};

const QuoteRequest = () => {
  // Form state
  const [formData, setFormData] = useState<FormFields>({
    fullName: "",
    email: "",
    suburb: "",
    phone: "",
    postcode: "",
    make: "",
    year: "",
    model: "",
    partDescription: "",
  });

  // reCAPTCHA token (we'll also fetch a fresh one on submit)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("");

  // Error state
  const [errors, setErrors] =
    useState<Partial<Record<keyof FormFields, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Load reCAPTCHA v3 script once
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;

    const EXISTING_ID = "recaptcha-v3";
    const ensureToken = () => {
      window.grecaptcha?.ready(() => {
        window.grecaptcha
          ?.execute(RECAPTCHA_SITE_KEY, { action: "quote_request" })
          .then((t) => setRecaptchaToken(t))
          .catch(() => setRecaptchaToken(""));
      });
    };

    if (!document.getElementById(EXISTING_ID)) {
      const s = document.createElement("script");
      s.id = EXISTING_ID;
      s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      s.async = true;
      s.defer = true;
      s.onload = ensureToken;
      document.head.appendChild(s);
    } else {
      ensureToken();
    }
  }, []);

  // Validation helpers
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) =>
    /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, "").length >= 8;

  const validatePostcode = (postcode: string) => /^\d{4}$/.test(postcode);

  const validateYear = (year: string) => {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    return yearNum >= 1900 && yearNum <= currentYear + 1;
  };

  const validateField = (name: keyof FormFields, value: string) => {
    switch (name) {
      case "fullName":
        return value.trim().length < 2
          ? "Full name must be at least 2 characters"
          : "";
      case "email":
        return !validateEmail(value)
          ? "Please enter a valid email address"
          : "";
      case "suburb":
        return value.trim().length < 2
          ? "Suburb must be at least 2 characters"
          : "";
      case "phone":
        return !validatePhone(value) ? "Please enter a valid phone number" : "";
      case "postcode":
        return !validatePostcode(value)
          ? "Please enter a valid 4-digit postcode"
          : "";
      case "make":
        return value.trim().length < 2
          ? "Make must be at least 2 characters"
          : "";
      case "year":
        return !validateYear(value) ? "Please enter a valid year" : "";
      case "model":
        return value.trim().length < 2
          ? "Model must be at least 2 characters"
          : "";
      case "partDescription":
        return value.trim().length < 5
          ? "Part description must be at least 5 characters"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement & {
      name: keyof FormFields;
    };
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};
    (Object.keys(formData) as (keyof FormFields)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Always get a fresh token right before submit (v3 tokens are short-lived)
  const getFreshRecaptchaToken = async (): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return "";
    try {
      await new Promise<void>((resolve) =>
        window.grecaptcha!.ready(() => resolve())
      );
      const t = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, {
        action: "quote_request",
      });
      setRecaptchaToken(t);
      return t;
    } catch {
      return "";
    }
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // get a brand-new token (don’t rely on any old one)
      const token = await getFreshRecaptchaToken();
      if (!token) {
        toast.error("Missing reCAPTCHA token.");
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        ...formData,
        year: parseInt(formData.year, 10),
        recaptchaToken: token,
      };

      const response = await fetch(`${API_BASE}/parts/quote-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message ||
            "Quote request submitted successfully! We'll get back to you within 24 hours."
        );

        // reset form and prefetch the next token in the background
        setFormData({
          fullName: "",
          email: "",
          suburb: "",
          phone: "",
          postcode: "",
          make: "",
          year: "",
          model: "",
          partDescription: "",
        });
        setErrors({});
        // background refresh (ignore failures)
        getFreshRecaptchaToken().catch(() => {});
      } else {
        throw new Error(
          data.message || data.error || "Failed to submit quote request"
        );
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit quote request. Please try again.";
      console.error("QuoteRequest error:", error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // field lists (typed)
  const personalFields = [
    { name: "fullName", placeholder: "Full Name*" },
    { name: "email", placeholder: "Email*" },
    { name: "suburb", placeholder: "Suburb*" },
    { name: "phone", placeholder: "Phone*", type: "tel" as const },
    { name: "postcode", placeholder: "Postcode*", type: "number" as const },
  ] as const satisfies ReadonlyArray<{
    name: keyof FormFields;
    placeholder: string;
    type?: "text" | "tel" | "number";
  }>;

  const vehicleFields = [
    { name: "make", placeholder: "Enter Make*" },
    { name: "year", placeholder: "Year*", type: "number" as const },
    { name: "model", placeholder: "Model*" },
    { name: "partDescription", placeholder: "Part Description*" },
  ] as const satisfies ReadonlyArray<{
    name: keyof FormFields;
    placeholder: string;
    type?: "text" | "number";
  }>;

  return (
    <Box as="section" py={16} bg="gray.100" position="relative">
      <Flex direction={{ base: "column", lg: "row" }} h="full" maxW="1400px" mx="auto">
        {/* Left panel */}
        <Box
          bg="gray.200"
          flex="1"
          p={{ base: 8, md: 12, lg: 16 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <VStack gap={8} maxW="500px">
            <Box position="relative">
              <Text
                as="h2"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="900"
                color="gray.800"
                mb={3}
                textTransform="uppercase"
                lineHeight="1.1"
              >
                CAN&apos;T FIND WHAT
                <br />
                YOU&apos;RE LOOKING
                <br />
                FOR?
              </Text>
              <Box
                w="60%"
                h="4px"
                bg="linear-gradient(90deg, #d80c19 0%, #b30915 100%)"
                borderRadius="full"
                position="absolute"
                bottom="-8px"
                left="50%"
                transform="translateX(-50%)"
              />
            </Box>

            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" lineHeight="1.6" fontWeight="500">
              Call one of our helpful team members on:
            </Text>

            <Button
              bg="gray.800"
              color="white"
              _hover={{ bg: "gray.900" }}
              size={{ base: "md", lg: "lg" }}
              px={{ base: 8, lg: 12 }}
              py={{ base: 6, lg: 8 }}
              fontSize={{ base: "lg", lg: "xl" }}
              fontWeight="700"
              borderRadius="lg"
              boxShadow="lg"
              minW={{ base: "240px", lg: "280px" }}
              borderBottom="1px solid"
              borderColor="gray.300"
            >
              <FaPhone style={{ marginRight: "12px", color: "white", transform: "scaleX(-1)" }} />
              <a
                href="tel:0296047366"
                style={{ color: "inherit", textDecoration: "none", cursor: "pointer" }}
              >
                (02) 9604 7366
              </a>
            </Button>

            <Text fontSize={{ base: "md", lg: "lg" }} color="gray.600" lineHeight="1.6" fontWeight="500" maxW="400px">
              Or fill in the Free quote request form and we will get back to you within 24 hours.
            </Text>
          </VStack>
        </Box>

        {/* Right panel (form) */}
        <Box
          bg="white"
          flex="1"
          p={{ base: 8, md: 12, lg: 16 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          borderRadius={{ base: "0", lg: "lg" }}
          boxShadow="lg"
        >
          <VStack align="flex-start" gap={8} maxW="500px">
            <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} fontWeight="800" color="gray.800" mb={4}>
              Request a FREE Part Quote
            </Text>

            {/* Personal info */}
            <VStack align="flex-start" gap={6} w="full">
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" color="gray.800">
                Personal Information
              </Text>

              <VStack gap={4} w="full">
                {personalFields.map((f) => (
                  <Box w="full" key={f.name}>
                    <Input
                      name={f.name}
                      placeholder={f.placeholder}
                      type={("type" in f ? f.type : undefined) || "text"}
                      size="lg"
                      bg="white"
                      color="gray.800"
                      value={formData[f.name]}
                      onChange={handleInputChange}
                      border="2px solid"
                      borderColor={errors[f.name] ? "red.500" : "gray.200"}
                      _focus={{
                        borderColor: errors[f.name] ? "red.500" : "#d80c19",
                        boxShadow: errors[f.name] ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                      _hover={{ borderColor: errors[f.name] ? "red.500" : "gray.300" }}
                    />
                    {errors[f.name] && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors[f.name]}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </VStack>

            {/* Vehicle/part details */}
            <VStack align="flex-start" gap={6} w="full">
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" color="gray.800">
                Vehicle/part details
              </Text>

              <VStack gap={4} w="full">
                {vehicleFields.map((f) => (
                  <Box w="full" key={f.name}>
                    <Input
                      name={f.name}
                      placeholder={f.placeholder}
                      type={("type" in f ? f.type : undefined) || "text"}
                      size="lg"
                      bg="white"
                      color="gray.800"
                      value={formData[f.name]}
                      onChange={handleInputChange}
                      border="2px solid"
                      borderColor={errors[f.name] ? "red.500" : "gray.200"}
                      _focus={{
                        borderColor: errors[f.name] ? "red.500" : "#d80c19",
                        boxShadow: errors[f.name] ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                      _hover={{ borderColor: errors[f.name] ? "red.500" : "gray.300" }}
                    />
                    {errors[f.name] && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors[f.name]}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </VStack>

            {/* Submit */}
            <Button
              bg="#d80c19"
              color="white"
              _hover={{ bg: "#b30915" }}
              size="lg"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="600"
              borderRadius="lg"
              w="full"
              boxShadow="lg"
              onClick={onSubmit}
              loading={isSubmitting}
              loadingText="Submitting..."
              disabled={isSubmitting}
            >
              Submit Quote Request
            </Button>
          </VStack>
        </Box>
      </Flex>     
    </Box>
  );
};

export default QuoteRequest;
