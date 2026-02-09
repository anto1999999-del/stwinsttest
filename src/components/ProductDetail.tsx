"use client";

import { Box, Image, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { useState } from "react";

interface ProductDetailProps {
  id: string;
  title: string;
  price: number;
  stockNumber: string;
  model: string;
  year: number;
  make: string;
  description: string;
  tagNumber: string;
  odometer: string;
  images: string[];
  oemnumber?: string; // <-- NEW
}

const ProductDetail = ({
  id,
  title,
  price,
  stockNumber,
  model,
  year,
  make,
  description,
  tagNumber,
  odometer,
  images,
  oemnumber, // <-- NEW
}: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleContactUs = () => {
    // console.log("Contact Us clicked for:", id);
  };

  return (
    <Box bg="black" minH="100vh" py={8}>
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
        <Box bg="black" borderRadius="xl" overflow="hidden">
          <HStack align="flex-start" gap={0} direction={{ base: "column", lg: "row" }}>
            {/* Left: Gallery */}
            <Box w={{ base: "100%", lg: "50%" }} p={6}>
              <VStack gap={4}>
                <Box
                  w="full"
                  h="500px"
                  borderRadius="lg"
                  overflow="hidden"
                  position="relative"
                  bg="gray.800"
                >
                  <Image
                    src={images[selectedImage]}
                    alt={title}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                  <Box
                    position="absolute"
                    top="4"
                    right="4"
                    bg="rgba(255,255,255,0.9)"
                    color="black"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="600"
                    boxShadow="md"
                  >
                    S TWINS
                  </Box>
                  <Box
                    position="absolute"
                    bottom="4"
                    left="4"
                    bg="rgba(255,255,255,0.8)"
                    color="black"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="600"
                  >
                    S TWINS (SYDNEY)
                  </Box>
                </Box>

                <HStack gap={3} justify="center" flexWrap="wrap">
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      w="80px"
                      h="80px"
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      border={selectedImage === index ? "3px solid" : "1px solid"}
                      borderColor={selectedImage === index ? "#d80c19" : "gray.600"}
                      onClick={() => setSelectedImage(index)}
                      _hover={{ transform: "scale(1.05)" }}
                      transition="all 0.2s ease"
                    >
                      <Image
                        src={image}
                        alt={`${title} ${index + 1}`}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </HStack>
              </VStack>
            </Box>

            {/* Right: Summary */}
            <Box w={{ base: "100%", lg: "50%" }} p={6} color="white">
              <VStack align="flex-start" gap={6}>
                {/* Title */}
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="#d80c19" lineHeight="1.2">
                  {title}
                </Text>

                {/* Big Price (kept) */}
                <Text fontSize="4xl" fontWeight="bold" color="white">
                  ${price.toLocaleString()}
                </Text>

                {/* Item Details */}
                <Box
                  bg="gray.800"
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.600"
                  w="full"
                >
                  <Text fontSize="lg" fontWeight="600" color="white" mb={3}>
                    Item Details
                  </Text>
                  <VStack align="flex-start" gap={2}>
                    <Text fontSize="sm" color="white">
                      Price: ${price.toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="white">
                      Part Number (OEM): {oemnumber && oemnumber.trim() ? oemnumber : "—"}
                    </Text>
                    <Text fontSize="sm" color="white">
                      Make / Model: {make} {model}
                    </Text>
                    <Text fontSize="sm" color="white">
                      Desc: {description}
                    </Text>
                    <Text fontSize="sm" color="white">
                      Year: {year}
                    </Text>
                    <Text fontSize="sm" color="white">
                      Stock Number: {stockNumber}
                    </Text>
                    {tagNumber && (
                      <Text fontSize="sm" color="white">
                        Tag Number: {tagNumber}
                      </Text>
                    )}
                    {odometer && (
                      <Text fontSize="sm" color="white">
                        Odometer: {odometer}
                      </Text>
                    )}
                  </VStack>
                </Box>

                {/* CTA */}
                <VStack gap={4} w="full">
                  <Button
                    bg="white"
                    color="black"
                    _hover={{ bg: "gray.100" }}
                    size="lg"
                    w="full"
                    py={6}
                    fontSize="lg"
                    fontWeight="600"
                    borderRadius="lg"
                    textTransform="uppercase"
                    onClick={handleContactUs}
                  >
                    Contact Us
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </HStack>
        </Box>

        {/* SEO blurb */}
        <Box
          bg="gray.800"
          borderRadius="xl"
          p={6}
          mt={6}
          border="1px solid"
          borderColor="gray.600"
        >
          <Text fontSize="lg" fontWeight="600" color="white" mb={4}>
            Description
          </Text>
          <Text fontSize="md" color="white" lineHeight="1.6">
            S-Twins is Sydney&apos;s premier auto wrecker, specializing in new
            and second-hand {make} {model} engines. We offer budget-friendly
            prices without compromising on quality. Our extensive inventory
            includes carefully tested engines with nationwide shipping
            available. Whether you need a replacement engine or spare parts, our
            expert team is here to help you find the perfect solution for your
            vehicle.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetail;
