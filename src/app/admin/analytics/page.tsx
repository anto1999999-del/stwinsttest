"use client";

import { Box, Text, VStack, Flex, Button } from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaChartBar,
  FaCar,
  FaCogs,
  FaDollarSign,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AnalyticsData {
  totalParts: number;
  totalCars: number;
  totalCategories: number;
  lowStockParts: number;
  availableCars: number;
  soldCars: number;
  pendingCars: number;
  totalValue: number;
  recentParts: Array<{
    id: string;
    name: string;
    brand: string;
    price: number;
    stock: number;
  }>;
  recentCars: Array<{
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    status: string;
  }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalParts: 0,
    totalCars: 0,
    totalCategories: 0,
    lowStockParts: 0,
    availableCars: 0,
    soldCars: 0,
    pendingCars: 0,
    totalValue: 0,
    recentParts: [],
    recentCars: [],
  });

  useEffect(() => {
    // Check authentication
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }

    // Load data from localStorage
    const parts = JSON.parse(localStorage.getItem("adminParts") || "[]");
    const cars = JSON.parse(localStorage.getItem("adminCars") || "[]");
    const categories = JSON.parse(
      localStorage.getItem("adminCategories") || "[]"
    );

    // Calculate analytics
    const totalParts = parts.length;
    const totalCars = cars.length;
    const totalCategories = categories.length;
    const lowStockParts = parts.filter(
      (p: { stock: number }) => p.stock < 10
    ).length;
    const availableCars = cars.filter(
      (c: { status: string }) => c.status === "available"
    ).length;
    const soldCars = cars.filter(
      (c: { status: string }) => c.status === "sold"
    ).length;
    const pendingCars = cars.filter(
      (c: { status: string }) => c.status === "pending"
    ).length;
    const totalValue =
      parts.reduce(
        (sum: number, p: { price: number; stock: number }) =>
          sum + p.price * p.stock,
        0
      ) + cars.reduce((sum: number, c: { price: number }) => sum + c.price, 0);

    const recentParts = parts.slice(-5).reverse();
    const recentCars = cars.slice(-5).reverse();

    setAnalytics({
      totalParts,
      totalCars,
      totalCategories,
      lowStockParts,
      availableCars,
      soldCars,
      pendingCars,
      totalValue,
      recentParts,
      recentCars,
    });
  }, [router]);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="sm" px={8} py={4}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={4}>
            <Button onClick={() => router.push("/admin")} variant="ghost">
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Back
            </Button>
            <Text fontSize="2xl" fontWeight="bold" color="#d80c19">
              Analytics Dashboard
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={8}>
        <VStack gap={8} align="stretch">
          {/* Overview Cards */}
          <Box
            display="grid"
            gridTemplateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              textAlign="center"
            >
              <Box as={FaCogs} boxSize={8} color="blue.500" mb={2} mx="auto" />
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {analytics.totalParts}
              </Text>
              <Text color="blue.600">Total Parts</Text>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              textAlign="center"
            >
              <Box as={FaCar} boxSize={8} color="green.500" mb={2} mx="auto" />
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {analytics.totalCars}
              </Text>
              <Text color="green.600">Total Cars</Text>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              textAlign="center"
            >
              <Box
                as={FaChartBar}
                boxSize={8}
                color="purple.500"
                mb={2}
                mx="auto"
              />
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {analytics.totalCategories}
              </Text>
              <Text color="purple.600">Categories</Text>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="sm"
              textAlign="center"
            >
              <Box
                as={FaDollarSign}
                boxSize={8}
                color="orange.500"
                mb={2}
                mx="auto"
              />
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                ${analytics.totalValue.toLocaleString()}
              </Text>
              <Text color="orange.600">Total Value</Text>
            </Box>
          </Box>

          {/* Inventory Status */}
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
          >
            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                Parts Inventory Status
              </Text>
              <VStack gap={3} align="stretch">
                <Flex justify="space-between">
                  <Text>Total Parts</Text>
                  <Text fontWeight="bold" color="blue.600">
                    {analytics.totalParts}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Low Stock (&lt; 10)</Text>
                  <Text
                    fontWeight="bold"
                    color={
                      analytics.lowStockParts > 0 ? "red.500" : "green.500"
                    }
                  >
                    {analytics.lowStockParts}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>In Stock</Text>
                  <Text fontWeight="bold" color="green.500">
                    {analytics.totalParts - analytics.lowStockParts}
                  </Text>
                </Flex>
              </VStack>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                Cars Status
              </Text>
              <VStack gap={3} align="stretch">
                <Flex justify="space-between">
                  <Text>Available</Text>
                  <Text fontWeight="bold" color="green.500">
                    {analytics.availableCars}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Pending</Text>
                  <Text fontWeight="bold" color="yellow.500">
                    {analytics.pendingCars}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Sold</Text>
                  <Text fontWeight="bold" color="red.500">
                    {analytics.soldCars}
                  </Text>
                </Flex>
              </VStack>
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
          >
            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                Recent Parts Added
              </Text>
              <Box maxH="300px" overflowY="auto">
                {analytics.recentParts.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No parts added yet.
                  </Text>
                ) : (
                  <VStack gap={3} align="stretch">
                    {analytics.recentParts.map((part) => (
                      <Box key={part.id} p={3} bg="gray.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold" color="gray.800">
                          {part.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          {part.brand}
                        </Text>
                        <Flex justify="space-between" fontSize="xs">
                          <Text color="blue.600">${part.price}</Text>
                          <Text
                            color={part.stock < 10 ? "red.500" : "green.500"}
                          >
                            Stock: {part.stock}
                          </Text>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                Recent Cars Added
              </Text>
              <Box maxH="300px" overflowY="auto">
                {analytics.recentCars.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No cars added yet.
                  </Text>
                ) : (
                  <VStack gap={3} align="stretch">
                    {analytics.recentCars.map((car) => (
                      <Box key={car.id} p={3} bg="gray.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold" color="gray.800">
                          {car.make} {car.model}
                        </Text>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          {car.year}
                        </Text>
                        <Flex justify="space-between" fontSize="xs">
                          <Text color="blue.600">
                            ${car.price.toLocaleString()}
                          </Text>
                          <Text
                            color={
                              car.status === "available"
                                ? "green.500"
                                : car.status === "pending"
                                ? "yellow.500"
                                : "red.500"
                            }
                          >
                            {car.status}
                          </Text>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
              Quick Actions
            </Text>
            <Flex gap={4} wrap="wrap">
              <Button
                colorScheme="blue"
                onClick={() => router.push("/admin/parts")}
              >
                <FaCogs style={{ marginRight: "8px" }} />
                Manage Parts
              </Button>
              <Button
                colorScheme="green"
                onClick={() => router.push("/admin/cars")}
              >
                <FaCar style={{ marginRight: "8px" }} />
                Manage Cars
              </Button>
              <Button
                colorScheme="purple"
                onClick={() => router.push("/admin/categories")}
              >
                <FaChartBar style={{ marginRight: "8px" }} />
                Manage Categories
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
