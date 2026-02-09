"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Image,
  Icon,
  Link,
} from "@chakra-ui/react";
import { FaPhone, FaCheck } from "react-icons/fa";

interface LocationPageProps {
  slug: string;
}

const LocationPage = ({ slug }: LocationPageProps) => {
  // Convert slug back to location name
  const locationName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // const locationData = {
  //   name: locationName,
  //   phone: "02 9604 7366", // Default phone, you can customize per location
  //   address: "755 The Horsley Dr, Smithfield NSW 2164", // Default address
  // };

  const parts = [
    { name: "Used Car Batteries", image: "/parts1.jpeg" },
    { name: "Engines", image: "/parts2.jpeg", category: "ENGINE" },
    { name: "Bonnets and Bumpers", image: "/parts3.jpeg" },
    { name: "Headlights", image: "/parts4.jpg" },
    { name: "Car Wheels", image: "/parts5.jpeg" },
    { name: "Front and Rear Doors", image: "/parts6.jpeg" },
    { name: "Car Windows", image: "/parts7.jpeg" },
    { name: "Seats", image: "/parts8.jpeg" },
    { name: "Brakes", image: "/parts9.jpeg", category: "BRAKE_BOOSTER" },
    { name: "And More!", image: "/parts10.jpeg" },
  ];

  const brands = [
    { name: "Audi", logo: "/audi.png", icon: "🚗" },
    { name: "BMW", logo: "/bmw.png", icon: "🚙" },
    { name: "Holden", logo: "/holden.png", icon: "🚘" },
    { name: "Honda", logo: "/honda.png", icon: "🚗" },
    { name: "Hyundai", logo: "/hyundai.png", icon: "🚙" },
    { name: "Kia", logo: "/kia.png", icon: "🚘" },
    { name: "Mazda", logo: "/mazda.png", icon: "🚗" },
    { name: "Nissan", logo: "/nissan.png", icon: "🚙" },
    { name: "Subaru", logo: "/subaru.png", icon: "🚘" },
    { name: "Suzuki", logo: "/suzuki.png", icon: "🚗" },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        minH="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {/* Background Image */}
        <Image
          src="/Home-Page-Hero-Image-scaled-1.jpg"
          alt="S-Twins Spares Hero"
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="center"
          zIndex={1}
        />

        {/* Dark Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="rgba(0, 0, 0, 0.6)"
          zIndex={2}
        />

        {/* Hero Content */}
        <Box
          position="relative"
          zIndex={3}
          textAlign="center"
          color="white"
          px={6}
          maxW="800px"
          mx="auto"
        >
          <VStack gap={8}>
            <VStack gap={4}>
              <Text
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="900"
                lineHeight="1.1"
                textTransform="uppercase"
              >
                Used Car Parts & Wreckers Artarmon
              </Text>
              <Text
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="1.1"
                textTransform="uppercase"
                color="#d80c19"
              >
                {locationName}
              </Text>
            </VStack>

            <Button
              bg="#d80c19"
              color="white"
              _hover={{ bg: "#b30915" }}
              size="lg"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="md"
              onClick={() => window.open("tel:0296047366", "_self")}
            >
              <HStack gap={2}>
                <Icon as={FaPhone} style={{ transform: "rotate(90deg)" }} />
                <Text>Call Us</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </Box>

      {/* Section 1: Introduction */}
      <Box bg="gray.50" py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          gap={12}
          maxW="1400px"
          mx="auto"
        >
          {/* Left Content */}
          <Box flex="1">
            <VStack align="flex-start" gap={6}>
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="gray.800"
                fontFamily="'MADE Outer Sans', sans-serif"
                lineHeight="1.2"
              >
                Leading Car Wreckers in {locationName}
              </Text>

              <VStack align="flex-start" gap={4}>
                <Text fontSize="lg" color="gray.700" lineHeight="1.6">
                  In search of premium quality used car parts in {locationName}?
                  S-Twins stands as your premier destination. We specialize in
                  providing exceptional second-hand auto parts, accommodating a
                  diverse range of vehicle makes and models.
                </Text>

                <Text fontSize="lg" color="gray.700" lineHeight="1.6">
                  Our commitment to quality is unwavering, with every part
                  undergoing stringent quality testing. Trust S-Twins for all
                  your used car parts needs in {locationName}, where
                  satisfaction and reliability are guaranteed, complete with a
                  3-month warranty on all parts.
                </Text>
              </VStack>

              <Button
                bg="#d80c19"
                color="white"
                _hover={{ bg: "#b30915" }}
                size="lg"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="md"
                onClick={() => window.open("tel:0296047366", "_self")}
              >
                Call Us
              </Button>
            </VStack>
          </Box>

          {/* Right Image */}
          <Box flex="0.8">
            <Image
              src="/yard.png"
              alt="Car Wrecking Yard"
              w="full"
              h="500px"
              objectFit="cover"
              borderRadius="lg"
            />
          </Box>
        </Flex>
      </Box>

      {/* Section 2: Why Choose Us */}
      <Box bg="white" py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          gap={12}
          maxW="1400px"
          mx="auto"
        >
          {/* Left Image */}
          <Box flex="0.8">
            <Image
              src="/about1.jpg"
              alt="S-Twins Sign"
              w="full"
              h="500px"
              objectFit="cover"
              borderRadius="lg"
            />
          </Box>

          {/* Right Content */}
          <Box flex="1">
            <VStack align="flex-start" gap={6}>
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="gray.800"
                fontFamily="'MADE Outer Sans', sans-serif"
                lineHeight="1.2"
              >
                Why Choose S-Twins in {locationName}?
              </Text>

              <VStack align="flex-start" gap={4}>
                <HStack align="flex-start" gap={3}>
                  <Icon as={FaCheck} color="#d80c19" fontSize="lg" mt={1} />
                  <VStack align="flex-start" gap={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Competitive Pricing
                    </Text>
                    <Text fontSize="md" color="gray.700" lineHeight="1.6">
                      Leveraging our auto expertise and a customer-centric
                      approach, we ensure fair pricing on all used parts,
                      offering you the best possible deals.
                    </Text>
                  </VStack>
                </HStack>

                <HStack align="flex-start" gap={3}>
                  <Icon as={FaCheck} color="#d80c19" fontSize="lg" mt={1} />
                  <VStack align="flex-start" gap={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Extensive Inventory
                    </Text>
                    <Text fontSize="md" color="gray.700" lineHeight="1.6">
                      Years of experience in the industry have enabled us to
                      maintain an expansive stock of parts across various makes,
                      models, and brands.
                    </Text>
                  </VStack>
                </HStack>

                <HStack align="flex-start" gap={3}>
                  <Icon as={FaCheck} color="#d80c19" fontSize="lg" mt={1} />
                  <VStack align="flex-start" gap={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Assured Quality
                    </Text>
                    <Text fontSize="md" color="gray.700" lineHeight="1.6">
                      As the top car wreckers and auto part supplier in{" "}
                      {locationName}, we ensure every part passes through
                      rigorous quality checks by our skilled mechanics.
                    </Text>
                  </VStack>
                </HStack>

                <HStack align="flex-start" gap={3}>
                  <Icon as={FaCheck} color="#d80c19" fontSize="lg" mt={1} />
                  <VStack align="flex-start" gap={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Prompt Service
                    </Text>
                    <Text fontSize="md" color="gray.700" lineHeight="1.6">
                      Contact us anytime, and our responsive team will provide
                      expert advice and immediate assistance with your auto part
                      requirements.
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Flex>
      </Box>

      {/* Section 3: Our Process */}
      <Box bg="gray.50" py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          gap={12}
          maxW="1400px"
          mx="auto"
        >
          {/* Left Content */}
          <Box flex="1">
            <VStack align="flex-start" gap={6}>
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="gray.800"
                fontFamily="'MADE Outer Sans', sans-serif"
                lineHeight="1.2"
              >
                {locationName}&apos;s Premier Used Parts Supplier
              </Text>

              <Text fontSize="lg" color="gray.700" lineHeight="1.6">
                At S-Twins, we pride ourselves on our expertise in identifying
                high-quality car parts. Our process includes:
              </Text>

              <VStack align="flex-start" gap={3}>
                <HStack align="flex-start" gap={3}>
                  <Icon as={FaCheck} color="#d80c19" fontSize="lg" mt={1} />
                  <Text fontSize="lg" color="gray.700">
                    Meticulous Dismantling of Vehicles
                  </Text>
                </HStack>
                <HStack align="flex-start" gap={3}>
                  <Icon as={FaCheck} color="#d80c19" fontSize="lg" mt={1} />
                  <Text fontSize="lg" color="gray.700">
                    Salvaging All Usable Parts
                  </Text>
                </HStack>
                <HStack align="flex-start" gap={3}>
                  <Icon as={FaCheck} color="#d80c19" fontSize="lg" mt={1} />
                  <Text fontSize="lg" color="gray.700">
                    Thorough Cleaning and Reconditioning
                  </Text>
                </HStack>
                <HStack align="flex-start" gap={3}>
                  <Icon as={FaCheck} color="#d80c19" fontSize="lg" mt={1} />
                  <Text fontSize="lg" color="gray.700">
                    Rigorous Quality Assessment and Cataloging
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Right Image */}
          <Box flex="0.8">
            <Image
              src="/aboutushero.jpg"
              alt="S-Twins Team"
              w="full"
              h="500px"
              objectFit="cover"
              borderRadius="lg"
            />
          </Box>
        </Flex>
      </Box>

      {/* Section 4: Essential Parts */}
      <Box bg="white" py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          gap={12}
          maxW="1400px"
          mx="auto"
        >
          {/* Left Image */}
          <Box flex="0.8">
            <Image
              src="/workshopsecond.jpg"
              alt="Mechanic Working"
              w="full"
              h="500px"
              objectFit="cover"
              borderRadius="lg"
            />
          </Box>

          {/* Right Content */}
          <Box flex="1">
            <VStack align="flex-start" gap={6}>
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="gray.800"
                fontFamily="'MADE Outer Sans', sans-serif"
                lineHeight="1.2"
              >
                Get Your Essential Parts from S-Twins in {locationName}
              </Text>

              <Text fontSize="lg" color="gray.700" lineHeight="1.6">
                As leading car wreckers, we ensure our inventory covers all
                essential components. We are dedicated to supplying quality
                parts, subjecting each item to extensive quality checks. Our
                wide network enables us to provide even the most elusive parts,
                whether it&apos;s for foreign or domestic vehicles, complete
                engines, diesel components, hybrid systems, or high-performance
                parts.
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Box>

      {/* Section 5: Our Range of Parts */}
      <Box bg="gray.50" py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <VStack gap={12} maxW="1400px" mx="auto">
          <Text
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="bold"
            color="gray.800"
            fontFamily="'MADE Outer Sans', sans-serif"
            textAlign="center"
          >
            Our Range of Parts Includes:
          </Text>

          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={6}
            w="full"
          >
            {parts.map((part, index) => (
              <Link
                key={index}
                href={
                  part.category ? `/parts?category=${part.category}` : `/parts`
                }
                textDecoration="none"
              >
                <VStack
                  gap={3}
                  cursor="pointer"
                  _hover={{ transform: "scale(1.05)" }}
                  transition="all 0.2s"
                >
                  <Box
                    w="full"
                    h="200px"
                    bg="white"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    position="relative"
                  >
                    <Image
                      src={part.image}
                      alt={part.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                  </Box>
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    color="#d80c19"
                    textAlign="center"
                  >
                    {part.name}
                  </Text>
                </VStack>
              </Link>
            ))}
          </Grid>
        </VStack>
      </Box>

      {/* Section 6: Brands We Carry */}
      <Box bg="white" py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <VStack gap={12} maxW="1400px" mx="auto">
          <VStack gap={4}>
            <Text
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              color="gray.800"
              fontFamily="'MADE Outer Sans', sans-serif"
              textAlign="center"
            >
              Brands We Carry
            </Text>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              We stock parts from various brands, including:
            </Text>
          </VStack>

          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={8}
            w="full"
          >
            {brands.map((brand, index) => (
              <Link
                key={index}
                href={`/cars?q=${brand.name}`}
                textDecoration="none"
              >
                <VStack
                  gap={3}
                  cursor="pointer"
                  _hover={{ transform: "scale(1.05)" }}
                  transition="all 0.2s"
                >
                  <Box
                    w="120px"
                    h="120px"
                    bg="white"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      w="80px"
                      h="80px"
                      objectFit="contain"
                    />
                  </Box>
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    color="#d80c19"
                    textAlign="center"
                  >
                    {brand.name}
                  </Text>
                </VStack>
              </Link>
            ))}
          </Grid>
        </VStack>
      </Box>

      {/* Section 7: Servicing Areas */}
      <Box bg="gray.50" py={16} px={{ base: 6, md: 8, lg: 12 }}>
        <VStack gap={12} maxW="1400px" mx="auto">
          {/* Top Text Section */}
          <VStack gap={4} textAlign="center">
            <Text
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              color="gray.800"
              fontFamily="'MADE Outer Sans', sans-serif"
            >
              Servicing Areas Beyond {locationName}:
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="600px"
              mx="auto"
            >
              In addition to {locationName}, we also serve nearby locations such
              as Smithfield and Guildford.
            </Text>
          </VStack>

          {/* Main Content Block */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            gap={12}
            maxW="1000px"
            mx="auto"
          >
            {/* Left Column - Image */}
            <Box flex="1">
              <Image
                src="/aboutus2.jpg"
                alt="S-Twins Team"
                w="full"
                h="500px"
                objectFit="cover"
                borderRadius="lg"
              />
            </Box>

            {/* Right Column - Contact Information */}
            <Box flex="1">
              <VStack align="flex-start" gap={6}>
                <Text
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  color="gray.800"
                  fontFamily="'MADE Outer Sans', sans-serif"
                  lineHeight="1.2"
                >
                  Contact S-Twins Today
                </Text>

                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color="gray.700"
                  lineHeight="1.6"
                >
                  Skip the middleman and reach out to S-Twins, your go-to car
                  wreckers in {locationName}, for all your used car part needs.
                  Experience premium service and quality with us.
                </Text>
              </VStack>
            </Box>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default LocationPage;
