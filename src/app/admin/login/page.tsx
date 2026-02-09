"use client";

import { Box, Text, Button, VStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/shared/api/admin";

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await adminApi.login({
        username: credentials.username,
        password: credentials.password,
      });

      // Store admin token and data in localStorage
      localStorage.setItem("adminToken", response.accessToken);
      localStorage.setItem("adminData", JSON.stringify(response.admin));

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
            "Invalid username or password. Please try again."
          : "Invalid username or password. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box bg="white" p={8} borderRadius="xl" shadow="xl" w="full" maxW="400px">
        <VStack gap={6}>
          {/* Logo/Title */}
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="#d80c19" mb={2}>
              Admin Login
            </Text>
            <Text color="gray.600">S-Twins Auto Parts Management</Text>
          </Box>

          {/* Login Form */}
          <Box w="full">
            <form onSubmit={handleSubmit}>
              <VStack gap={4}>
                <Box w="full">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Username
                  </Text>
                  <Input
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    required
                  />
                </Box>

                <Box w="full">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Password
                  </Text>
                  <Input
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    required
                  />
                </Box>

                {error && (
                  <Box
                    bg="red.50"
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="red.200"
                  >
                    <Text color="red.600" fontSize="sm">
                      {error}
                    </Text>
                  </Box>
                )}

                <Button
                  type="submit"
                  colorScheme="red"
                  size="lg"
                  w="full"
                  loading={isLoading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  w="full"
                  onClick={() => router.push("/admin/forgot-password")}
                >
                  Forgot Password?
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
