"use client";

import { Box, Text, Button, VStack, Input, Textarea } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";

interface SellYourCarFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellYourCarForm = ({ isOpen, onClose }: SellYourCarFormProps) => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    vehicleMakeModel: "",
    vehicleYear: "",
    odometerReading: "",
    registrationNumber: "",
    mechanicalCondition: "",
    bodyCondition: "",
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

  const validateYear = (year: string) => {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    return yearNum >= 1900 && yearNum <= currentYear + 1;
  };

  const validateOdometer = (odometer: string) => {
    const odometerNum = parseInt(odometer.replace(/\D/g, ""));
    return !isNaN(odometerNum) && odometerNum >= 0 && odometerNum <= 999999;
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
      case "phone":
        return !validatePhone(value) ? "Please enter a valid phone number" : "";
      case "vehicleMakeModel":
        return value.trim().length < 2
          ? "Vehicle make/model must be at least 2 characters"
          : "";
      case "vehicleYear":
        return !validateYear(value) ? "Please enter a valid year" : "";
      case "odometerReading":
        return !validateOdometer(value)
          ? "Please enter a valid odometer reading"
          : "";
      case "registrationNumber":
        return value.trim().length < 2
          ? "Registration number must be at least 2 characters"
          : "";
      case "mechanicalCondition":
        return value.trim().length < 10
          ? "Mechanical condition description must be at least 10 characters"
          : "";
      case "bodyCondition":
        return value.trim().length < 10
          ? "Body condition description must be at least 10 characters"
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
      const apiBaseUrl =
        process.env.BACK_END ||
        process.env.NEXT_PUBLIC_BACK_END ||
        process.env.BACKEND_URL ||
        "http://localhost:3001/api";

      const submitData = {
        ...formData,
        vehicleYear: parseInt(formData.vehicleYear),
      };

      const response = await fetch(`${apiBaseUrl}/cars/sell-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message ||
            "Vehicle details submitted successfully! We'll contact you within 24 hours."
        );
        // console.log("SellYourCarForm submitted:", submitData);

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          vehicleMakeModel: "",
          vehicleYear: "",
          odometerReading: "",
          registrationNumber: "",
          mechanicalCondition: "",
          bodyCondition: "",
        });
        setErrors({});
        onClose();
      } else {
        throw new Error(
          data.message || data.error || "Failed to submit vehicle details"
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit vehicle details. Please try again."
      );
      console.error("SellYourCarForm error:", error);
    } finally {
      setIsSubmitting(false);
    }
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
      >
        {/* Header */}
        <Box
          bg="#d80c19"
          color="white"
          textAlign="center"
          borderTopRadius="xl"
          py={6}
          px={6}
          position="relative"
        >
          <Text fontSize="2xl" fontWeight="bold">
            SELL YOUR CAR
          </Text>

          {/* Close Button */}
          <Button
            position="absolute"
            top="4"
            right="4"
            variant="ghost"
            color="white"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
            onClick={onClose}
            size="lg"
            p={2}
            minW="auto"
          >
            <FaTimes />
          </Button>
        </Box>

        {/* Body */}
        <Box p={8}>
          <VStack gap={6} align="stretch">
            {/* Personal Information */}
            <VStack gap={4} align="stretch">
              <Text fontSize="lg" fontWeight="600" color="gray.800">
                Personal Information
              </Text>

              <Box>
                <Input
                  name="fullName"
                  placeholder="Full Name*"
                  bg="gray.100"
                  color="gray.800"
                  border="none"
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontSize="md"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.fullName
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
                />
                {errors.fullName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.fullName}
                  </Text>
                )}
              </Box>

              <Box>
                <Input
                  name="email"
                  placeholder="Email Address*"
                  bg="gray.100"
                  color="gray.800"
                  border="none"
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontSize="md"
                  value={formData.email}
                  onChange={handleInputChange}
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.email
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
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
                  bg="gray.100"
                  color="gray.800"
                  border="none"
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
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.phone
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
                />
                {errors.phone && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.phone}
                  </Text>
                )}
              </Box>
            </VStack>

            {/* Vehicle Information */}
            <VStack gap={4} align="stretch">
              <Text fontSize="lg" fontWeight="600" color="gray.800">
                Vehicle Information
              </Text>

              <Box>
                <Input
                  name="vehicleMakeModel"
                  placeholder="Vehicle Make / Model*"
                  bg="gray.100"
                  color="gray.800"
                  border="none"
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontSize="md"
                  value={formData.vehicleMakeModel}
                  onChange={handleInputChange}
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.vehicleMakeModel
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
                />
                {errors.vehicleMakeModel && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.vehicleMakeModel}
                  </Text>
                )}
              </Box>

              <Box>
                <Input
                  name="vehicleYear"
                  placeholder="Vehicle Year (e.g. 2020)*"
                  type="number"
                  bg="gray.100"
                  color="gray.800"
                  border="none"
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontSize="md"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.vehicleYear
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
                />
                {errors.vehicleYear && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.vehicleYear}
                  </Text>
                )}
              </Box>

              <Box>
                <Input
                  name="odometerReading"
                  placeholder="Odometer Reading (Kms)*"
                  type="number"
                  bg="gray.100"
                  color="gray.800"
                  border="none"
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontSize="md"
                  value={formData.odometerReading}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.odometerReading
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
                />
                {errors.odometerReading && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.odometerReading}
                  </Text>
                )}
              </Box>

              <Box>
                <Input
                  name="registrationNumber"
                  placeholder="Vehicle Registration Number*"
                  bg="gray.100"
                  color="gray.800"
                  border="none"
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontSize="md"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.registrationNumber
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
                />
                {errors.registrationNumber && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.registrationNumber}
                  </Text>
                )}
              </Box>
            </VStack>

            {/* Vehicle Condition */}
            <VStack gap={4} align="stretch">
              <Text fontSize="lg" fontWeight="600" color="gray.800">
                Vehicle Condition
              </Text>

              <Box>
                <Textarea
                  name="mechanicalCondition"
                  placeholder="Describe mechanical condition of the vehicle*"
                  bg="gray.100"
                  color="gray.800"
                  border="none"
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontSize="md"
                  rows={4}
                  resize="none"
                  value={formData.mechanicalCondition}
                  onChange={handleInputChange}
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.mechanicalCondition
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
                />
                {errors.mechanicalCondition && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.mechanicalCondition}
                  </Text>
                )}
              </Box>

              <Box>
                <Textarea
                  name="bodyCondition"
                  placeholder="Describe body condition (scratches, dents, etc.)*"
                  bg="gray.100"
                  color="gray.800"
                  border="none"
                  borderRadius="lg"
                  px={4}
                  py={3}
                  fontSize="md"
                  rows={4}
                  resize="none"
                  value={formData.bodyCondition}
                  onChange={handleInputChange}
                  _placeholder={{ color: "gray.500" }}
                  _focus={{
                    bg: "white",
                    boxShadow: errors.bodyCondition
                      ? "0 0 0 3px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 3px rgba(216, 12, 25, 0.2)",
                    outline: "none",
                  }}
                />
                {errors.bodyCondition && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.bodyCondition}
                  </Text>
                )}
              </Box>
            </VStack>

            {/* Submit Button */}
            <Button
              bg="#d80c19"
              color="white"
              _hover={{ bg: "#b30915" }}
              size="lg"
              py={4}
              fontSize="lg"
              fontWeight="600"
              borderRadius="lg"
              w="full"
              textTransform="uppercase"
              letterSpacing="wide"
              mt={4}
              onClick={onSubmit}
              loading={isSubmitting}
              loadingText="Submitting..."
              disabled={isSubmitting}
            >
              Submit Vehicle Details
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default SellYourCarForm;
