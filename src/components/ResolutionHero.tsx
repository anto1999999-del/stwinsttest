"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  IconButton,
  useDisclosure,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { FaShieldAlt, FaFileAlt, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Testimonials from "./Testimonials";
import QuoteRequest from "./QuoteRequest";
import Footer from "./Footer";
import { heroFont } from "@/shared/lib/heroFont";

// Minimal, conflict-free typing for reCAPTCHA v3 (same as QuoteRequest)
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
  "6LfU7x8rAAAAAM1dJp-STGH3XAJSq2hJGiX7f8TD";

// ----- API base (ALIGNED WITH QuoteRequest.tsx) -----
const API_ORIGIN =
  process.env.NEXT_PUBLIC_BACK_END ||
  process.env.BACK_END ||
  process.env.BACKEND_URL ||
  "http://localhost:3001";
// normalize: strip trailing slashes and any existing /api, then append /api
const API_BASE = `${API_ORIGIN.replace(/\/+$/, "").replace(/\/api$/i, "")}/api`;

const ResolutionHero = () => {
  const {
    open: isWarrantyOpen,
    onOpen: onWarrantyOpen,
    onClose: onWarrantyClose,
  } = useDisclosure();
  const {
    open: isClaimOpen,
    onOpen: onClaimOpen,
    onClose: onClaimClose,
  } = useDisclosure();

  // reCAPTCHA token (we still fetch a fresh one on submit)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("");

  // --- Load reCAPTCHA v3 script once (same pattern as QuoteRequest)
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;

    const SCRIPT_ID = "recaptcha-v3";
    const ensureToken = () => {
      window.grecaptcha?.ready(() => {
        window.grecaptcha
          ?.execute(RECAPTCHA_SITE_KEY, { action: "warranty" })
          .then((t) => setRecaptchaToken(t))
          .catch(() => setRecaptchaToken(""));
      });
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      s.async = true;
      s.defer = true;
      s.onload = ensureToken;
      document.head.appendChild(s);
    } else {
      ensureToken();
    }
  }, []);

  // Always get a fresh token right before submit (v3 tokens are short-lived)
  const getFreshRecaptchaToken = async (action: string): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return "";
    try {
      await new Promise<void>((resolve) => window.grecaptcha!.ready(() => resolve()));
      const t = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action });
      setRecaptchaToken(t);
      return t;
    } catch {
      return "";
    }
  };

  // Warranty validation form state
  const [warrantyFormData, setWarrantyFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    invoiceNumber: "",
    mechanicOrInstaller: "",
    dateOfInstallation: "",
    mechanicLicense: "",
  });
  const [isWarrantySubmitting, setIsWarrantySubmitting] = useState(false);

  // Warranty claim form state
  const [claimFormData, setClaimFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    invoiceNumber: "",
    issueDescription: "",
  });
  const [isClaimSubmitting, setIsClaimSubmitting] = useState(false);

  const handleWarrantyInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWarrantyFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClaimInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClaimFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit warranty validation form (with reCAPTCHA like QuoteRequest)
  const handleWarrantySubmit = async () => {
    if (
      !warrantyFormData.fullName ||
      !warrantyFormData.email ||
      !warrantyFormData.phone ||
      !warrantyFormData.invoiceNumber
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsWarrantySubmitting(true);

    try {
      const token = await getFreshRecaptchaToken("warranty_validate");
      if (!token) {
        toast.error("Missing reCAPTCHA token.");
        setIsWarrantySubmitting(false);
        return;
      }

      const payload = { ...warrantyFormData, recaptchaToken: token };

      const response = await fetch(`${API_BASE}/warranty/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message ||
            "Warranty validation request submitted successfully! We will get back to you within 24 hours."
        );

        setWarrantyFormData({
          fullName: "",
          email: "",
          phone: "",
          invoiceNumber: "",
          mechanicOrInstaller: "",
          dateOfInstallation: "",
          mechanicLicense: "",
        });
        onWarrantyClose();

        // quietly refresh next token
        getFreshRecaptchaToken("warranty_validate").catch(() => {});
      } else {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to submit warranty validation request"
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit warranty validation request. Please try again."
      );
      console.error("Warranty validation error:", error);
    } finally {
      setIsWarrantySubmitting(false);
    }
  };

  // Submit warranty claim form (with reCAPTCHA like QuoteRequest)
  const handleClaimSubmit = async () => {
    if (
      !claimFormData.fullName ||
      !claimFormData.email ||
      !claimFormData.phone ||
      !claimFormData.invoiceNumber ||
      !claimFormData.issueDescription
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsClaimSubmitting(true);

    try {
      const token = await getFreshRecaptchaToken("warranty_claim");
      if (!token) {
        toast.error("Missing reCAPTCHA token.");
        setIsClaimSubmitting(false);
        return;
      }

      const payload = { ...claimFormData, recaptchaToken: token };

      const response = await fetch(`${API_BASE}/warranty/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message ||
            "Warranty claim submitted successfully! We will review your claim and get back to you within 24 hours."
        );

        setClaimFormData({
          fullName: "",
          email: "",
          phone: "",
          invoiceNumber: "",
          issueDescription: "",
        });
        onClaimClose();

        // quietly refresh next token
        getFreshRecaptchaToken("warranty_claim").catch(() => {});
      } else {
        throw new Error(
          data.message || data.error || "Failed to submit warranty claim"
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit warranty claim. Please try again."
      );
      console.error("Warranty claim error:", error);
    } finally {
      setIsClaimSubmitting(false);
    }
  };

  return (
    <>
      <Box as="section" minH="80vh" position="relative">
        {/* Full Width Image Background */}
        <Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex={1}>
          <Image
            src="/resolutionhero.jpg"
            alt="S-Twins Resolution Center - Warranty Validation"
            w="full"
            h="full"
            objectFit="cover"
            objectPosition="center"
            filter="brightness(0.7) contrast(1.2)"
          />
        </Box>

        {/* Dark Overlay */}
        <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="rgba(0,0,0,0.4)" zIndex={2} />

        {/* Content Overlay */}
        <Box
          position="relative"
          zIndex={3}
          h="full"
          display="flex"
          alignItems={{ base: "center", lg: "flex-end" }}
          justifyContent={{ base: "center", lg: "flex-start" }}
          px={{ base: 8, md: 12, lg: 16 }}
          pt={{ base: "55%", lg: "0" }}
        >
          <Box
            flex={{ base: "1", lg: "1" }}
            maxW={{ base: "full", lg: "600px" }}
            color="white"
            textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            display="flex"
            alignItems={{ base: "center", lg: "flex-end" }}
            justifyContent={{ base: "center", lg: "flex-start" }}
            h="full"
            pt={{ base: "0", lg: "20%" }}
          >
            <VStack align={{ base: "center", lg: "flex-start" }} gap={3}>
              <Text
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "85px" }}
                fontWeight="extrabold"
                lineHeight="0.9"
                letterSpacing="tight"
                textAlign={{ base: "center", lg: "left" }}
                color="white"
                fontFamily={heroFont}
              >
                <Box as="span" color="#d80c19">Validate </Box>
                Warranty
              </Text>
            </VStack>
          </Box>
        </Box>        
      </Box>

      {/* Warranty Information Section */}
      <Box as="section" bg="black" py={12}>
        <Box w="100%" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
          <Flex direction={{ base: "column", lg: "row" }} gap={8}>
            {/* Left Section - Warranty Details */}
            <Box flex="1">
              <VStack align="flex-start" gap={6}>
                <Box>
                  <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} fontWeight="bold" color="white" mb={3}>
                    Warranty included on all parts
                  </Text>
                  <Box w="100" h="1" bg="#d80c19" />
                </Box>

                <Text fontSize={{ base: "lg", md: "xl" }} color="white" lineHeight="1.6">
                  We provide reconditioned parts like engines & gearboxes with 6 to 12 months warranty.
                </Text>

                <VStack align="flex-start" gap={3} w="full">
                  <HStack gap={3} align="flex-start">
                    <Box w="3" h="3" bg="#d80c19" borderRadius="full" mt={1} flexShrink={0} />
                    <Text color="white" fontSize={{ base: "md", md: "lg" }}>
                      All Parts come with 3 months parts only warranty
                    </Text>
                  </HStack>

                  <HStack gap={3} align="flex-start">
                    <Box w="3" h="3" bg="#d80c19" borderRadius="full" mt={1} flexShrink={0} />
                    <Text color="white" fontSize={{ base: "md", md: "lg" }}>
                      Part and labour warranty available by request on most parts
                    </Text>
                  </HStack>

                  <HStack gap={3} align="flex-start">
                    <Box w="3" h="3" bg="#d80c19" borderRadius="full" mt={1} flexShrink={0} />
                    <Text color="white" fontSize={{ base: "md", md: "lg" }}>
                      Extended warranty available on most parts (Conditions apply to all the above)
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>

            {/* Right Section - Warranty Actions */}
            <Box flex="1">
              <VStack align="flex-start" gap={6}>
                <Text fontSize={{ base: "lg", md: "xl" }} color="white" lineHeight="1.6">
                  All parts must be validated prior to submitting a claim. To validate your warranty, or make a claim
                  on a purchase, please click below.
                </Text>

                <VStack gap={4} align="stretch" w="full">
                  <Button
                    bg="#d80c19"
                    color="white"
                    _hover={{ bg: "#b30915" }}
                    size="lg"
                    py={3}
                    fontSize="md"
                    fontWeight="600"
                    borderRadius="md"
                    transition="all 0.3s ease"
                    w="full"
                    onClick={onWarrantyOpen}
                  >
                    <HStack gap={2}>
                      <FaShieldAlt />
                      <Text>Validate Warranty</Text>
                    </HStack>
                  </Button>

                  <Button
                    bg="#d80c19"
                    color="white"
                    _hover={{ bg: "#b30915" }}
                    size="lg"
                    py={3}
                    fontSize="md"
                    fontWeight="600"
                    borderRadius="md"
                    transition="all 0.3s ease"
                    w="full"
                    onClick={onClaimOpen}
                  >
                    <HStack gap={2}>
                      <FaFileAlt />
                      <Text>Make a Warranty Claim</Text>
                    </HStack>
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Quote Request Section */}
      <QuoteRequest />

      {/* Footer */}
      <Footer />

      {/* Warranty Validation Modal */}
      {isWarrantyOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" bg="rgba(0,0,0,0.8)" zIndex={9999} display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="xl" maxW="500px" w="full" maxH="90vh" overflow="auto" position="relative" boxShadow="2xl">
            <Box bg="#d80c19" color="white" p={6} borderTopRadius="xl" position="relative">
              <HStack gap={3} align="center">
                <FaShieldAlt size="24" />
                <Text fontSize="2xl" fontWeight="bold">Warranty Validation</Text>
              </HStack>
              <IconButton aria-label="Close modal" position="absolute" top={4} right={4} bg="transparent" color="white" _hover={{ bg: "rgba(255,255,255,0.2)" }} onClick={onWarrantyClose} size="sm">
                <FaTimes />
              </IconButton>
            </Box>

            <Box p={6}>
              <VStack gap={6} align="stretch">
                <Text fontSize="lg" color="gray.700" lineHeight="1.6">
                  To validate your S-TWINS warranty, please provide the following information:
                </Text>

                <VStack gap={4} align="stretch">
                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Full Name*</Text>
                    <Input name="fullName" value={warrantyFormData.fullName} onChange={handleWarrantyInputChange} placeholder="Full Name*" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Email*</Text>
                    <Input name="email" value={warrantyFormData.email} onChange={handleWarrantyInputChange} placeholder="Email*" type="email" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Phone*</Text>
                    <Input name="phone" value={warrantyFormData.phone} onChange={handleWarrantyInputChange} placeholder="Phone*" type="tel" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Invoice Number*</Text>
                    <Input name="invoiceNumber" value={warrantyFormData.invoiceNumber} onChange={handleWarrantyInputChange} placeholder="Invoice Number*" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Mechanic or Installer</Text>
                    <Input name="mechanicOrInstaller" value={warrantyFormData.mechanicOrInstaller} onChange={handleWarrantyInputChange} placeholder="Mechanic or Installer" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Date of Installation</Text>
                    <Input name="dateOfInstallation" value={warrantyFormData.dateOfInstallation} onChange={handleWarrantyInputChange} placeholder="Date of Installation" type="date" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Mechanic License</Text>
                    <Input name="mechanicLicense" value={warrantyFormData.mechanicLicense} onChange={handleWarrantyInputChange} placeholder="Mechanic License Number" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>
                </VStack>

                <Button
                  bg="#d80c19"
                  color="white"
                  _hover={{ bg: "#b30915" }}
                  size="lg"
                  py={4}
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="md"
                  w="full"
                  onClick={handleWarrantySubmit}
                  loading={isWarrantySubmitting}
                  loadingText="Submitting..."
				  disabled={isWarrantySubmitting}
                >
                  Validate Warranty
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      )}

      {/* Warranty Claim Modal */}
      {isClaimOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" bg="rgba(0,0,0,0.8)" zIndex={9999} display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="xl" maxW="500px" w="full" maxH="90vh" overflow="auto" position="relative" boxShadow="2xl">
            <Box bg="#d80c19" color="white" p={6} borderTopRadius="xl" position="relative">
              <HStack gap={3} align="center">
                <FaShieldAlt size="24" />
                <Text fontSize="2xl" fontWeight="bold">Warranty Claim</Text>
              </HStack>
              <IconButton aria-label="Close modal" position="absolute" top={4} right={4} bg="transparent" color="white" _hover={{ bg: "rgba(255,255,255,0.2)" }} onClick={onClaimClose} size="sm">
                <FaTimes />
              </IconButton>
            </Box>

            <Box p={6}>
              <VStack gap={6} align="stretch">
                <Text fontSize="lg" color="gray.700" lineHeight="1.6">
                  To submit a warranty claim, please provide the following details:
                </Text>

                <VStack gap={4} align="stretch">
                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Full Name*</Text>
                    <Input name="fullName" value={claimFormData.fullName} onChange={handleClaimInputChange} placeholder="Full Name*" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Email*</Text>
                    <Input name="email" value={claimFormData.email} onChange={handleClaimInputChange} placeholder="Email*" type="email" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Phone*</Text>
                    <Input name="phone" value={claimFormData.phone} onChange={handleClaimInputChange} placeholder="Phone*" type="tel" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Invoice Number*</Text>
                    <Input name="invoiceNumber" value={claimFormData.invoiceNumber} onChange={handleClaimInputChange} placeholder="Invoice Number*" w="full" p={3} border="2px solid" borderColor="gray.200" borderRadius="md" _focus={{ borderColor: "#d80c19" }} />
                  </Box>

                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>Issue Description</Text>
                    <Textarea
                      name="issueDescription"
                      value={claimFormData.issueDescription}
                      onChange={handleClaimInputChange}
                      placeholder="Describe the issue with your part"
                      w="full"
                      p={3}
                      border="2px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      _focus={{ borderColor: "#d80c19" }}
                      rows={4}
                      resize="vertical"
                    />
                  </Box>
                </VStack>

                <Button
                  bg="#d80c19"
                  color="white"
                  _hover={{ bg: "#b30915" }}
                  size="lg"
                  py={4}
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="md"
                  w="full"
                  onClick={handleClaimSubmit}
                  loading={isClaimSubmitting}
                  loadingText="Submitting..."
				  disabled={isClaimSubmitting}
                >
                  Submit Claim
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ResolutionHero;
