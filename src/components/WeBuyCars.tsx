"use client";

import { Box, Text, Button, VStack, useDisclosure } from "@chakra-ui/react";
import SellYourCarForm from "./SellYourCarForm";
import Image from "next/image";

const WeBuyCars = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      {/* Responsive container */}
      <Box
        display={{ base: "block", md: "flex" }}
        flexDirection={{ base: "column", md: "row" }}
        minH="500px"
      >
        {/* Left Side - Image */}
        <Box
          w={{ base: "100%", md: "50%" }}
          h={{ base: "300px", md: "500px" }}
          position="relative"
        >
          <Image
            src="/yard.png"
            alt="Car junkyard"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Right Side - Content */}
        <Box
          w={{ base: "100%", md: "50%" }}
          bg="gray.100"
          p={{ base: "30px", md: "40px", lg: "80px" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
        >
          <VStack
            align={{ base: "center", md: "flex-start" }}
            gap={{ base: "16px", md: "20px" }}
            maxW={{ base: "100%", md: "auto" }}
          >
            {/* Title with red underline */}
            <Box textAlign={{ base: "center", md: "left" }}>
              <Text
                as="h2"
                fontSize={{ base: "3xl", md: "3xl" }}
                fontWeight="800"
                color="gray.800"
              >
                WE BUY CARS!
              </Text>
              <Box
                w={{ base: "80%", md: "100%" }}
                h="3px"
                bg="#ff0000"
                mt="10px"
                mx={{ base: "auto", md: "0" }}
              />
            </Box>

            {/* Description */}
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.700"
              lineHeight="1.6"
              maxW={{ base: "90%", md: "100%" }}
              fontFamily='"Objektiv Mk1 Regular", Sans-serif'
            >
              Have a car you want to sell? Fill out our sale form and we will
              get back to you with an offer.
            </Text>

            {/* Button */}
            <Button
              bg="#ff0000"
              color="white"
              _hover={{ bg: "#cc0000" }}
              size={{ base: "sm", md: "md" }}
              px={{ base: "20px", md: "24px" }}
              py={{ base: "12px", md: "16px" }}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="600"
              borderRadius="md"
              textTransform="uppercase"
              onClick={onOpen}
              w={{ base: "100%", md: "auto" }}
              maxW={{ base: "280px", md: "none" }}
              fontFamily='"Objektiv Mk1 Regular", Sans-serif'
            >
              Sell Your Car
            </Button>
          </VStack>
        </Box>
      </Box>

      {/* Use the same SellYourCarForm modal as Footer */}
      <SellYourCarForm isOpen={open} onClose={onClose} />
    </Box>
  );
};

export default WeBuyCars;
