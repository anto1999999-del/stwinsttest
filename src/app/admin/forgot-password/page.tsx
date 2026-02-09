"use client";

import { Box, Text, Button, VStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/shared/api/admin";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await adminApi.forgotPassword({ email });
      console.log("response", response);
      setMessage(response.message);
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error("Forgot password error:", err);
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "An error occurred. Please try again."
          : "An error occurred. Please try again.";
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
              Forgot Password
            </Text>
            <Text color="gray.600">
              Enter your email to receive a password reset link
            </Text>
          </Box>

          {/* Form */}
          <Box w="full">
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <VStack gap={4}>
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Email Address
                    </Text>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
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
                      w="full"
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
                    loadingText="Sending..."
                  >
                    Send Reset Link
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    w="full"
                    onClick={() => router.push("/admin/login")}
                  >
                    Back to Login
                  </Button>
                </VStack>
              </form>
            ) : (
              <VStack gap={4}>
                <Box
                  bg="green.50"
                  p={4}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="green.200"
                  w="full"
                >
                  <Text color="green.700" fontSize="sm" textAlign="center">
                    {message}
                  </Text>
                </Box>

                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Please check your email for the password reset link.
                </Text>

                <Button
                  colorScheme="red"
                  variant="outline"
                  size="lg"
                  w="full"
                  onClick={() => router.push("/admin/login")}
                >
                  Return to Login
                </Button>
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
