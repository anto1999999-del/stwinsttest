"use client";

import { Box, Text, Button, VStack, Input } from "@chakra-ui/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminApi } from "@/shared/api/admin";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams?.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await adminApi.resetPassword({ token, newPassword });
      setMessage(response.message);
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
            "An error occurred. The reset link may be invalid or expired."
          : "An error occurred. The reset link may be invalid or expired.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && error) {
    return (
      <Box
        minH="100vh"
        bg="linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          shadow="xl"
          w="full"
          maxW="400px"
        >
          <VStack gap={6}>
            <Box textAlign="center">
              <Text fontSize="3xl" fontWeight="bold" color="#d80c19" mb={2}>
                Invalid Link
              </Text>
            </Box>
            <Box
              bg="red.50"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor="red.200"
              w="full"
            >
              <Text color="red.600" fontSize="sm" textAlign="center">
                {error}
              </Text>
            </Box>
            <Button
              colorScheme="red"
              size="lg"
              w="full"
              onClick={() => router.push("/admin/forgot-password")}
            >
              Request New Reset Link
            </Button>
          </VStack>
        </Box>
      </Box>
    );
  }

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
              Reset Password
            </Text>
            <Text color="gray.600">Enter your new password below</Text>
          </Box>

          {/* Form */}
          <Box w="full">
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <VStack gap={4}>
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      New Password
                    </Text>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                  </Box>

                  <Box w="full">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Confirm Password
                    </Text>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
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
                    loadingText="Resetting..."
                  >
                    Reset Password
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
                  <Text
                    color="green.700"
                    fontSize="sm"
                    textAlign="center"
                    fontWeight="bold"
                  >
                    {message}
                  </Text>
                </Box>

                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Redirecting to login page...
                </Text>

                <Button
                  colorScheme="red"
                  size="lg"
                  w="full"
                  onClick={() => router.push("/admin/login")}
                >
                  Go to Login
                </Button>
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <Box
          minH="100vh"
          bg="linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text>Loading...</Text>
        </Box>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
