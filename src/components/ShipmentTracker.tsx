"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { FaCheck, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { shippingApi, TrackingResponse } from "@/shared/api/shipping";

interface ShipmentTrackerProps {
  initialTrackingNumber?: string;
  onTrackingUpdate?: (tracking: TrackingResponse) => void;
}

export const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({
  initialTrackingNumber = "",
  onTrackingUpdate,
}) => {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [tracking, setTracking] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackShipment = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await shippingApi.trackShipment(trackingNumber.trim());

      if (!response.success) {
        setError(response.error || "Failed to track shipment");
        setTracking(null);
      } else {
        setTracking(response);
        onTrackingUpdate?.(response);
      }
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to track shipment"
          : "Failed to track shipment";
      setError(errorMessage);
      setTracking(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, isLatest: boolean = false) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("delivered")) {
      return <FaCheck color="green" />;
    }
    if (statusLower.includes("failed") || statusLower.includes("cancelled")) {
      return <FaExclamationTriangle color="red" />;
    }
    if (isLatest) {
      return <FaClock color="blue" />;
    }
    return <FaCheck color="gray" />;
  };

  const formatEventDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch {
      return timestamp;
    }
  };

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.200"
    >
      <Box mb={6}>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Track Your Shipment
        </Text>
      </Box>

      <VStack gap={4} align="stretch">
        {/* Tracking Input */}
        <HStack>
          <Box flex={1}>
            <Text mb={2} fontWeight="medium">
              Tracking Number
            </Text>
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              onKeyPress={(e) => e.key === "Enter" && trackShipment()}
            />
          </Box>
          <Box pt={8}>
            <Button
              onClick={trackShipment}
              loading={loading}
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
            >
              {loading ? "Tracking..." : "Track"}
            </Button>
          </Box>
        </HStack>

        {error && (
          <Box
            bg="red.50"
            p={4}
            borderRadius="md"
            border="1px solid"
            borderColor="red.200"
          >
            <Text color="red.600">{error}</Text>
          </Box>
        )}

        {loading && (
          <Box textAlign="center" py={4}>
            <Spinner size="lg" />
            <Text mt={2}>Tracking shipment...</Text>
          </Box>
        )}

        {/* Tracking Results */}
        {tracking && (
          <VStack gap={4} align="stretch">
            <Box h="1px" bg="gray.200" w="full" />

            {/* Shipment Summary */}
            <Box
              bg="gray.50"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack align="start" gap={2}>
                <HStack>
                  <Text fontWeight="semibold">Status:</Text>
                  <Box bg="gray.100" px={2} py={1} borderRadius="sm">
                    <Text fontSize="sm" fontWeight="bold" color="gray.800">
                      {tracking.status.replace(/_/g, " ").toUpperCase()}
                    </Text>
                  </Box>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Tracking Number:</Text>
                  <Text fontFamily="mono">{tracking.trackingNumber}</Text>
                </HStack>
                {tracking.estimatedDelivery && (
                  <HStack>
                    <Text fontWeight="semibold">Estimated Delivery:</Text>
                    <Text>{formatEventDate(tracking.estimatedDelivery)}</Text>
                  </HStack>
                )}
              </VStack>
            </Box>

            {/* Tracking Events */}
            {tracking.events && tracking.events.length > 0 && (
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Tracking History
                </Text>

                <VStack align="stretch" gap={3}>
                  {tracking.events.map((event, index) => (
                    <Box
                      key={index}
                      bg={index === 0 ? "blue.50" : "white"}
                      p={4}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={index === 0 ? "blue.200" : "gray.200"}
                    >
                      <HStack justify="space-between" align="start">
                        <VStack align="start" gap={1} flex={1}>
                          <HStack>
                            {getStatusIcon(event.status, index === 0)}
                            <Text fontWeight="semibold">
                              {event.status.replace(/_/g, " ").toUpperCase()}
                            </Text>
                            {index === 0 && (
                              <Box
                                bg="blue.100"
                                px={2}
                                py={1}
                                borderRadius="sm"
                              >
                                <Text
                                  fontSize="xs"
                                  fontWeight="bold"
                                  color="blue.800"
                                >
                                  Latest
                                </Text>
                              </Box>
                            )}
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {event.description}
                          </Text>
                          {event.location && (
                            <Text fontSize="sm" color="gray.500">
                              📍 {event.location}
                            </Text>
                          )}
                        </VStack>
                        <VStack align="end" gap={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            {formatEventDate(event.timestamp)}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {(!tracking.events || tracking.events.length === 0) && (
              <Box
                bg="blue.50"
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor="blue.200"
              >
                <Text color="blue.600">
                  No tracking events available yet. Please check back later.
                </Text>
              </Box>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
