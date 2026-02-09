"use client";

import { useEffect, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

const DISMISS_KEY = "holiday-closure-2025-dismissed";

function isWithinClosurePeriod() {
  // Closed from 19 Dec 2025 to 4 Jan 2026 (inclusive)
  const now = new Date();
  const start = new Date(2025, 11, 19); // month is 0-based: 11 = December
  const end = new Date(2026, 0, 4, 23, 59, 59, 999); // up to end of 4 Jan

  return now >= start && now <= end;
}

export default function HolidayClosureBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isWithinClosurePeriod()) return;

    const dismissed = window.localStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "true");
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      width="100%"
      zIndex={1400}
      bg="red.600"
      color="white"
      px={4}
      py={3}
      boxShadow="0 -4px 10px rgba(0,0,0,0.25)"
    >
      <Flex
        maxW="7xl"
        mx="auto"
        align="center"
        justify="space-between"
        gap={4}
        flexWrap="wrap"
      >
        <Text fontSize="sm">
          <strong>Holiday Closure:</strong> We are closed from{" "}
          <strong>19 December</strong> to <strong>4 January</strong>.  
          Online enquiries are still welcome and will be processed when we
          reopen.
        </Text>
        <Button size="sm" variant="outline" colorScheme="whiteAlpha" onClick={handleClose}>
          Got it
        </Button>
      </Flex>
    </Box>
  );
}
