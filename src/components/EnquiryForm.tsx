"use client";

import {
  Box,
  Text,
  Button,
  VStack,
  Input,
  Textarea,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

interface EnquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  carTitle?: string;
  stockNumber?: string;
}

const EnquiryForm = ({
  isOpen,
  onClose,
  carTitle,
  stockNumber,
}: EnquiryFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // console.log("Enquiry form submitted:", { ...formData, carTitle, stockNumber,});
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.8)"
      zIndex={10000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="white"
        borderRadius="xl"
        maxW="600px"
        w="full"
        maxH="90vh"
        overflow="auto"
        position="relative"
        boxShadow="2xl"
      >
        {/* Header */}
        <Box
          bg="#d80c19"
          color="white"
          p={6}
          borderTopRadius="xl"
          position="relative"
        >
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Send Enquiry
          </Text>
          {carTitle && (
            <Text fontSize="sm" opacity={0.9} mt={1} textAlign="center">
              {carTitle} - {stockNumber}
            </Text>
          )}
          <IconButton
            aria-label="Close modal"
            position="absolute"
            top={4}
            right={4}
            bg="transparent"
            color="white"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            onClick={onClose}
            size="sm"
          >
            <FaTimes />
          </IconButton>
        </Box>

        {/* Body */}
        <Box p={6}>
          <form onSubmit={handleSubmit}>
            <VStack gap={4} align="stretch">
              <Flex direction={{ base: "column", md: "row" }} gap={4}>
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    First Name*
                  </Text>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    _focus={{ borderColor: "#d80c19" }}
                  />
                </Box>
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Last Name*
                  </Text>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    _focus={{ borderColor: "#d80c19" }}
                  />
                </Box>
              </Flex>

              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Email Address*
                </Text>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  _focus={{ borderColor: "#d80c19" }}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Phone Number*
                </Text>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  _focus={{ borderColor: "#d80c19" }}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                  Message
                </Text>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your enquiry..."
                  rows={4}
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  _focus={{ borderColor: "#d80c19" }}
                />
              </Box>

              <Flex gap={3} justify="center" mt={4}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  borderColor="gray.300"
                  color="gray.600"
                  _hover={{ borderColor: "gray.400" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  bg="#d80c19"
                  color="white"
                  _hover={{ bg: "#b30915" }}
                  px={8}
                >
                  Send Enquiry
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default EnquiryForm;
