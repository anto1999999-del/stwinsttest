"use client";

import { Box, Text, VStack, HStack } from "@chakra-ui/react";

const ClientTestimonials = () => {
  return (
    <Box bg="white" py={16} px={{ base: 6, md: 8, lg: 12 }}>
      <Box maxW="1200px" mx="auto">
        <Box position="relative" h="500px">
          {/* Left Column - White Background */}
          <Box
            bg="white"
            w={{ base: "100%", lg: "50%" }}
            h="full"
            p={{ base: 8, md: 12, lg: 16 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            position="absolute"
            left="0"
            top="0"
            zIndex={1}
          >
            <VStack align="flex-start" gap={6} maxW="500px">
              {/* Company Description */}
              <Text
                fontSize="md"
                color="gray.700"
                lineHeight="1.6"
                maxW="450px"
              >
                S-Twins has been serving satisfied customers for over 30 years,
                building a reputation for quality, reliability, and exceptional
                service. Our commitment to excellence is reflected in every
                interaction and every part we supply.
              </Text>

              {/* Google Rating */}
              <VStack align="flex-start" gap={2}>
                <HStack gap={1}>
                  {[...Array(5)].map((_, i) => (
                    <Box key={i} color="yellow.400" fontSize="lg">
                      ★
                    </Box>
                  ))}
                </HStack>
                <Text fontSize="md" color="gray.700" fontWeight="500">
                  4.9 (100+ reviews)
                </Text>
              </VStack>

              {/* TESTIMONIALS Heading */}
              <Text
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="800"
                color="gray.800"
                letterSpacing="tight"
                lineHeight="0.9"
                textTransform="uppercase"
              >
                TESTIMONIALS
              </Text>
            </VStack>
          </Box>

          {/* Right Column - Red Background with Diagonal Cut */}
          <Box
            bg="#ff0000"
            w={{ base: "100%", lg: "50%" }}
            h="full"
            p={{ base: 8, md: 12, lg: 16 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            position="absolute"
            right="0"
            top="0"
            color="white"
            zIndex={2}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100px",
              width: "100px",
              height: "100%",
              background: "#ff0000",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          >
            {/* Testimonial Content */}
            <VStack align="flex-start" gap={6} textAlign="left" maxW="500px">
              {/* Quote */}
              <Box>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="1.6"
                  fontStyle="italic"
                >
                  &ldquo;Absolutely 10/10 cannot fault these guys. First
                  purchase from a wreckers online needing it freighted 5 hours
                  away and was not a cheap purchase new bonnet colour matched yo
                  my vehicle it excellent condition. Great customer service easy
                  to deal with very helpful. Freight was 1 day early. Definitely
                  recommend stwins you will definitely get my business again.
                  Much appreciated. Shout out to Corey from stwins for a very
                  truthful honest description of the bonnet. Tim&rdquo;
                </Text>
              </Box>

              {/* Author and Rating */}
              <VStack align="flex-start" gap={3} w="full">
                <Text fontSize="xl" fontWeight="bold">
                  Tim Lamont
                </Text>
                <Text fontSize="md" opacity="0.9">
                  Sydney, NSW
                </Text>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientTestimonials;
