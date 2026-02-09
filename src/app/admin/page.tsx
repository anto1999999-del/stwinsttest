"use client";

import { Box, Text, Button, VStack, Flex } from "@chakra-ui/react";
import {
  FaCog,
  FaCar,
  FaCogs,
  FaChartBar,
  FaSignOutAlt,
  FaShoppingCart,
  FaTags,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { adminApi } from "@/shared/api/admin";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        router.push("/admin/login");
        setIsLoading(false);
        return;
      }
      try {
        await adminApi.getProfile(adminToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!isAuthenticated) {
    router.push("/admin/login");
    return null;
  }

  const adminMenuItems = [
    {
      title: "Orders Management",
      description: "View and manage customer orders",
      icon: FaShoppingCart,
      color: "red",
      route: "/admin/orders",
    },
    {
      title: "Parts Management",
      description: "Add, edit, and manage car parts",
      icon: FaCogs,
      color: "blue",
      route: "/admin/parts",
    },
    {
      title: "Cars Management",
      description: "Add, edit, and manage cars",
      icon: FaCar,
      color: "green",
      route: "/admin/cars",
    },
    {
      title: "Offers",
      description: "Review and respond to customer offers",
      icon: FaTags,
      color: "teal",
      route: "/admin/offers",
    },
    {
      title: "Categories",
      description: "Manage product categories",
      icon: FaCog,
      color: "purple",
      route: "/admin/categories",
    },
    {
      title: "Analytics",
      description: "View sales and inventory reports",
      icon: FaChartBar,
      color: "orange",
      route: "/admin/analytics",
    },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="sm" px={8} py={4}>
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="#d80c19">
            Admin Dashboard
          </Text>
          <Button colorScheme="red" variant="outline" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: "8px" }} />
            Logout
          </Button>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={8}>
        <VStack gap={8} align="stretch">
          {/* Welcome Section */}
          <Box>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
              Welcome to Admin Panel
            </Text>
            <Text fontSize="lg" color="gray.600">
              Manage your inventory, products, and website content
            </Text>
          </Box>

          {/* Admin Menu Grid */}
          <Box
            display="grid"
            gridTemplateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(5, 1fr)",
            }}
            gap={6}
          >
            {adminMenuItems.map((item) => (
              <Box
                key={item.title}
                bg="white"
                p={8}
                borderRadius="lg"
                shadow="md"
                cursor="pointer"
                _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
                transition="all 0.3s ease"
                onClick={() => router.push(item.route)}
                textAlign="center"
              >
                <Box as={item.icon} boxSize={12} color={`${item.color}.500`} mb={4} mx="auto" />
                <Text fontSize="xl" fontWeight="bold" mb={2} color="gray.800">
                  {item.title}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  {item.description}
                </Text>
              </Box>
            ))}
          </Box>

          {/* Quick Stats */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.800">
              Quick Overview
            </Text>
            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={4}
            >
              <Box textAlign="center" p={4} bg="blue.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  0
                </Text>
                <Text color="blue.600">Total Parts</Text>
              </Box>
              <Box textAlign="center" p={4} bg="green.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  0
                </Text>
                <Text color="green.600">Total Cars</Text>
              </Box>
              <Box textAlign="center" p={4} bg="purple.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  0
                </Text>
                <Text color="purple.600">Categories</Text>
              </Box>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
