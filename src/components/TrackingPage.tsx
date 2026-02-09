"use client";

import React from "react";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { ShipmentTracker } from "./ShipmentTracker";

interface TrackingPageProps {
  trackingNumber?: string;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({
  trackingNumber,
}) => {
  return (
    <Box
      as="section"
      bg="linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
      minH="100vh"
      py={10}
    >
      <Container maxW="1200px">
        {/* Page Title */}
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, #d80c19, #ff6b6b)"
              bgClip="text"
              mb={4}
            >
              Track Your Order
            </Heading>
            <Box
              w="100px"
              h="4px"
              bgGradient="linear(to-r, #d80c19, #ff6b6b)"
              mx="auto"
              borderRadius="full"
              mb={6}
            />
            <Text fontSize="lg" color="gray.600" maxW="600px" mx="auto">
              Enter your tracking number below to get real-time updates on your
              shipment status and delivery progress.
            </Text>
          </Box>

          {/* Shipment Tracker Component */}
          <Box maxW="800px" mx="auto" w="full">
            <ShipmentTracker initialTrackingNumber={trackingNumber} />
          </Box>

          {/* Additional Information */}
          <Box
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="0 4px 20px rgba(0,0,0,0.08)"
            border="1px solid"
            borderColor="gray.100"
            maxW="800px"
            mx="auto"
            w="full"
          >
            <Heading size="md" mb={4} color="gray.800">
              Tracking Information
            </Heading>
            <VStack align="start" gap={3}>
              <Text color="gray.600">
                • Tracking numbers are provided via email once your order has
                been dispatched
              </Text>
              <Text color="gray.600">
                • Updates typically appear within 2-4 hours of a status change
              </Text>
              <Text color="gray.600">
                • Delivery times may vary based on location and service type
                selected
              </Text>
              <Text color="gray.600">
                • For urgent tracking inquiries, please contact our customer
                service team
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
