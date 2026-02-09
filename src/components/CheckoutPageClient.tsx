"use client";

import { useEffect, useState } from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
import CheckoutPage from "./CheckoutPage";

export default function CheckoutPageClient() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        flexDirection="column"
        gap={4}
      >
        <Spinner size="xl" color="#d80c19" />
        <Text>Loading checkout...</Text>
      </Box>
    );
  }

  return <CheckoutPage />;
}
