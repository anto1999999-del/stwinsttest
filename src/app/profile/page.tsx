"use client";

import ProfileAuth from "@/components/ProfileAuth";
import { useMeQuery } from "@/features/auth/api/me";
import { useLogoutMutation } from "@/features/auth/api/logout";
import { Box, Flex, Text, Button, VStack, Stack } from "@chakra-ui/react";
import ProfileEditForm from "@/components/ProfileEditForm";
import EmailChangeForm from "@/components/EmailChangeForm";
import PasswordChangeForm from "@/components/PasswordChangeForm";

export default function ProfilePage() {
  const { data, isLoading, isError } = useMeQuery();
  // console.log("data", data);  
  const { mutate: doLogout, isPending } = useLogoutMutation();

  if (isLoading) {
    return (
      <main>
        <Box
          minH="60vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.300">Loading profile…</Text>
        </Box>
      </main>
    );
  }

  if (data && !isError) {
    const name = data.display_name || data.user_login;
    const initials =
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join("") ||
      data.user_login[0]?.toUpperCase() ||
      "U";

    return (
      <main>
        <Box as="section" minH="100vh" bg="black" py={{ base: 8, md: 16 }}>
          <Flex align="center" justify="center" px={4}>
            <Box
              bg="#0b0b0b"
              borderRadius="xl"
              w="full"
              maxW={{ base: "100%", md: "800px" }}
              boxShadow="0 10px 30px rgba(0,0,0,0.4)"
              border="1px solid"
              borderColor="rgba(255,255,255,0.06)"
              overflow="hidden"
            >
              <Box
                bg="linear-gradient(135deg, rgba(216,12,25,0.2), rgba(216,12,25,0.05))"
                p={{ base: 6, md: 8 }}
              >
                <Stack
                  direction={{ base: "column", md: "row" }}
                  gap={5}
                  align={{ base: "stretch", md: "center" }}
                >
                  <Box
                    w={{ base: 16, md: 20 }}
                    h={{ base: 16, md: 20 }}
                    borderRadius="full"
                    bg="#d80c19"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    boxShadow="0 8px 24px rgba(216,12,25,0.35)"
                  >
                    {initials}
                  </Box>
                  <VStack align="start" gap={1} flex={1}>
                    <Text
                      color="white"
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="bold"
                    >
                      {name}
                    </Text>
                    <Text color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                      {data.user_email}
                    </Text>
                  </VStack>
                  <Button
                    onClick={() => doLogout()}
                    loading={isPending}
                    bg="transparent"
                    color="#d80c19"
                    border="2px solid"
                    borderColor="#d80c19"
                    _hover={{
                      bg: "#d80c19",
                      color: "white",
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s ease"
                    alignSelf={{ base: "stretch", md: "auto" }}
                    w={{ base: "full", md: "auto" }}
                  >
                    Logout
                  </Button>
                </Stack>
              </Box>

              <Box h="1px" bg="rgba(255,255,255,0.06)" />

              <Box p={{ base: 4, md: 8 }}>
                <VStack align="stretch" gap={{ base: 4, md: 5 }}>
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>
                      Username
                    </Text>
                    <Text color="white" fontWeight="semibold">
                      {data.user_login}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>
                      Email
                    </Text>
                    <Text color="white" fontWeight="semibold">
                      {data.user_email}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>
                      Address
                    </Text>
                    <Text color="white" fontWeight="semibold">
                      {data.user_address || "No address provided"}
                    </Text>
                  </Box>
                  <Box h="1px" bg="rgba(255,255,255,0.06)" />
                  <Text color="gray.300" fontSize="lg" fontWeight="bold">
                    Edit profile
                  </Text>
                  <ProfileEditForm
                    id={data.ID}
                    defaults={{
                      display_name: data.display_name,
                      user_login: data.user_login,
                      user_nicename: data.user_nicename,
                      user_email: data.user_email,
                      user_url: data.user_url,
                      user_status: data.user_status,
                      user_address: data.user_address,
                    }}
                  />
                  <Box h="1px" bg="rgba(255,255,255,0.06)" />
                  <Text color="gray.300" fontSize="lg" fontWeight="bold">
                    Change email (validation only)
                  </Text>
                  <EmailChangeForm defaultEmail={data.user_email} />
                  <Box h="1px" bg="rgba(255,255,255,0.06)" />
                  <Text color="gray.300" fontSize="lg" fontWeight="bold">
                    Change password (validation only)
                  </Text>
                  <PasswordChangeForm />
                </VStack>
              </Box>
            </Box>
          </Flex>
        </Box>
      </main>
    );
  }

  return (
    <main>
      <ProfileAuth />
    </main>
  );
}
