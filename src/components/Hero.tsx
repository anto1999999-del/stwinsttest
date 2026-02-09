"use client";

import {
  Box,
  Grid,
  Text,
  Button,
  Flex,
  Image,
  Link,
  VStack,
} from "@chakra-ui/react";
import { heroFont } from "@/shared/lib/heroFont";

const Hero = () => {
  return (
    <Box as="section" bg="#0f0f0f" color="white">
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "3fr 7fr" }}
        minH="600px"
        borderTop="1px solid transparent"
      >
        {/* LEFT: Text Content */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ base: "center", lg: "flex-start" }}
          px={{ base: 6, md: 16 }}
          py={12}
          zIndex={10}
        >
          <VStack align={{ base: "center", lg: "flex-start" }} gap={0}>
            <Text
              as="h2"
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="extrabold"
              lineHeight="1"
              mb={4}
              textAlign={{ base: "center", lg: "left" }}
              fontFamily={heroFont}
            >
              RARE PARTS DELIVERED FAST
            </Text>
          </VStack>
          <Text
            fontSize={{ base: "md", sm: "lg", lg: "lg" }}
            mb={6}
            color="gray.300"
            fontWeight="medium"
            textAlign={{ base: "center", lg: "left" }}
          >
            First Place for Premium Car Parts
          </Text>
          <Flex
            flexDirection="row"
            gap={4}
            justify={{ base: "center", lg: "flex-start" }}
            align={{ base: "center", lg: "flex-start" }}
          >
            <Link href="parts">
              <Button
                bg="red.600"
                _hover={{ bg: "red.700" }}
                color="white"
                fontWeight="bold"
                py={2}
                px={5}
                borderRadius="sm"
                textAlign="center"
                w={{ base: "full", sm: "auto" }}
                size={{ base: "sm", lg: "md" }}
              >
                View Parts
              </Button>
            </Link>
            <Link href="cars">
              <Button
                bg="red.600"
                _hover={{ bg: "red.700" }}
                color="white"
                fontWeight="bold"
                py={2}
                px={5}
                borderRadius="sm"
                textAlign="center"
                w={{ base: "full", sm: "auto" }}
                size={{ base: "sm", lg: "md" }}
              >
                View Cars
              </Button>
            </Link>
          </Flex>
        </Box>

        {/* RIGHT: Image */}
        <Box position="relative" w="full" h={{ base: "300px", md: "auto" }}>
          <Image
            src="/hero-image.jpg"
            alt="Hero Image"
            w="full"
            h="full"
            objectFit="cover"
          />
        </Box>
      </Grid>
    </Box>
  );
};

export default Hero;
