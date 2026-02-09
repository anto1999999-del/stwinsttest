"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  Link,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa";
import NextLink from "next/link";
import QuoteRequest from "./QuoteRequest";

interface CarBrandPageProps {
  brandName: string;
}

const CarBrandPage = ({ brandName }: CarBrandPageProps) => {
  // Brand-specific content
  const brandContent = {
    audi: {
      title: "Audi Wreckers – Find Quality Used Audi Parts",
      heroTitle: "Your Premier Audi Wreckers in Australia",
      heroDescription:
        "Are you on the lookout for trustworthy Audi wreckers? S-Twins is your ultimate solution in Australia for all Audi used car parts. Our team, boasting over a decade of specialized experience in Audi models, stands ready to assist you with expert guidance and unparalleled service.",
      directAccessTitle: "DIRECT ACCESS TO AUDI REPLACEMENT PARTS",
      directAccessDescription:
        "Why go through intermediaries when you can obtain genuine used Audi parts directly from us? S-Twins offers you substantial savings in both cost and time. Our direct-to-customer approach ensures you get the best deals on used Audi parts in Sydney and across Australia.",
      qualityTitle: "Quality Assured Used Audi Parts",
      qualityDescription:
        "At S-Twins, we specialize in offering high-grade used Audi spare parts. Our rigorous quality checks, performed by skilled technicians, ensure each part meets the highest standards of reliability and performance. As leading Audi wreckers, our inventory is constantly replenished, guaranteeing we have the parts you need when you need them.",
      whyChooseTitle: "Why Choose S-Twins as Your Audi Wreckers?",
      whyChooseDescription:
        "Choosing S-Twins for Audi used spare parts means opting for a cost-effective, reliable, and eco-friendly solution. We pride ourselves on our sustainable practices, recycling Audi parts to reduce environmental impact. Our Audi wrecking services are tailored to offer:",
      benefits: [
        "Cost-Effectiveness",
        "Reliable Quality",
        "Ease of Sourcing Specific Audi Parts",
        "Fast and Efficient Service",
        "Sustainability",
      ],
      benefitsTitle: "Benefits of Choosing Used Audi Parts from S-Twins",
      benefitsList: [
        {
          title: "Cost Savings:",
          description:
            "Enjoy significant reductions in costs. Our competitive pricing means you pay less for high-quality Audi parts.",
        },
        {
          title: "Original Manufacturer Quality:",
          description:
            "Each part is sourced from genuine Audi vehicles, ensuring compatibility and excellence.",
        },
        {
          title: "Hassle-Free Exchanges:",
          description:
            "Mistaken purchases? Our easy exchange policy has you covered.",
        },
        {
          title: "Eco-Friendly Choice:",
          description:
            "By choosing recycled parts, you contribute to environmental conservation.",
        },
      ],
      partsTitle: "WIDE RANGE OF AUDI USED PARTS WE OFFER",
      partsDescription:
        "We supply an extensive array of used Audi parts, including:",
      partsList: [
        "Audi Batteries",
        "Doors, Windows, and Seats",
        "Audi Engines",
        "Lighting Systems",
        "Brakes, Bumpers, and More",
        "Covering Various Audi Models",
      ],
      modelsTitle:
        "Our inventory caters to a broad spectrum of Audi models such as:",
      modelsList: ["Audi A4", "Audi A6", "Audi Q5", "Audi Q7"],
      nationwideTitle: "Nationwide Service - We've Got Australia Covered",
      nationwideDescription:
        "S-Twins ships high-quality Audi auto parts all across Australia. Whether you're in Sydney, Melbourne, Brisbane, or any other location, we ensure timely and safe delivery of the parts you need.",
      contactTitle: "Contact S-Twins for Your Audi Part Needs",
      contactDescription:
        "Ready to find the perfect Audi part? Contact S-Twins today. With our vast inventory and expert team, we are committed to providing you with the best value and service for your Audi vehicle. Call us or reach out online - your one-stop solution for Audi used parts awaits.",
    },
    bmw: {
      title: "BMW Wreckers – Find Quality Used BMW Parts",
      heroTitle: "Your Premier BMW Wreckers in Australia",
      heroDescription:
        "Are you on the lookout for trustworthy BMW wreckers? S-Twins is your ultimate solution in Australia for all BMW used car parts. Our team, boasting over a decade of specialized experience in BMW models, stands ready to assist you with expert guidance and unparalleled service.",
      directAccessTitle: "DIRECT ACCESS TO BMW REPLACEMENT PARTS",
      directAccessDescription:
        "Why go through intermediaries when you can obtain genuine used BMW parts directly from us? S-Twins offers you substantial savings in both cost and time. Our direct-to-customer approach ensures you get the best deals on used BMW parts in Sydney and across Australia.",
      qualityTitle: "Quality Assured Used BMW Parts",
      qualityDescription:
        "At S-Twins, we specialize in offering high-grade used BMW spare parts. Our rigorous quality checks, performed by skilled technicians, ensure each part meets the highest standards of reliability and performance. As leading BMW wreckers, our inventory is constantly replenished, guaranteeing we have the parts you need when you need them.",
      whyChooseTitle: "Why Choose S-Twins as Your BMW Wreckers?",
      whyChooseDescription:
        "Choosing S-Twins for BMW used spare parts means opting for a cost-effective, reliable, and eco-friendly solution. We pride ourselves on our sustainable practices, recycling BMW parts to reduce environmental impact. Our BMW wrecking services are tailored to offer:",
      benefits: [
        "Cost-Effectiveness",
        "Reliable Quality",
        "Ease of Sourcing Specific BMW Parts",
        "Fast and Efficient Service",
        "Sustainability",
      ],
      benefitsTitle: "Benefits of Choosing Used BMW Parts from S-Twins",
      benefitsList: [
        {
          title: "Cost Savings:",
          description:
            "Enjoy significant reductions in costs. Our competitive pricing means you pay less for high-quality BMW parts.",
        },
        {
          title: "Original Manufacturer Quality:",
          description:
            "Each part is sourced from genuine BMW vehicles, ensuring compatibility and excellence.",
        },
        {
          title: "Hassle-Free Exchanges:",
          description:
            "Mistaken purchases? Our easy exchange policy has you covered.",
        },
        {
          title: "Eco-Friendly Choice:",
          description:
            "By choosing recycled parts, you contribute to environmental conservation.",
        },
      ],
      partsTitle: "WIDE RANGE OF BMW USED PARTS WE OFFER",
      partsDescription:
        "We supply an extensive array of used BMW parts, including:",
      partsList: [
        "BMW Batteries",
        "Doors, Windows, and Seats",
        "BMW Engines",
        "Lighting Systems",
        "Brakes, Bumpers, and More",
        "Covering Various BMW Models",
      ],
      modelsTitle:
        "Our inventory caters to a broad spectrum of BMW models such as:",
      modelsList: ["BMW 3 Series", "BMW 5 Series", "BMW X5", "BMW X3"],
      nationwideTitle: "Nationwide Service - We've Got Australia Covered",
      nationwideDescription:
        "S-Twins ships high-quality BMW auto parts all across Australia. Whether you're in Sydney, Melbourne, Brisbane, or any other location, we ensure timely and safe delivery of the parts you need.",
      contactTitle: "Contact S-Twins for Your BMW Part Needs",
      contactDescription:
        "Ready to find the perfect BMW part? Contact S-Twins today. With our vast inventory and expert team, we are committed to providing you with the best value and service for your BMW vehicle. Call us or reach out online - your one-stop solution for BMW used parts awaits.",
    },
    ford: {
      title: "Ford Wreckers – Find Quality Used Ford Parts",
      heroTitle: "Your Premier Ford Wreckers in Australia",
      heroDescription:
        "Are you on the lookout for trustworthy Ford wreckers? S-Twins is your ultimate solution in Australia for all Ford used car parts. Our team, boasting over a decade of specialized experience in Ford models, stands ready to assist you with expert guidance and unparalleled service.",
      directAccessTitle: "DIRECT ACCESS TO FORD REPLACEMENT PARTS",
      directAccessDescription:
        "Why go through intermediaries when you can obtain genuine used Ford parts directly from us? S-Twins offers you substantial savings in both cost and time. Our direct-to-customer approach ensures you get the best deals on used Ford parts in Sydney and across Australia.",
      qualityTitle: "Quality Assured Used Ford Parts",
      qualityDescription:
        "At S-Twins, we specialize in offering high-grade used Ford spare parts. Our rigorous quality checks, performed by skilled technicians, ensure each part meets the highest standards of reliability and performance. As leading Ford wreckers, our inventory is constantly replenished, guaranteeing we have the parts you need when you need them.",
      whyChooseTitle: "Why Choose S-Twins as Your Ford Wreckers?",
      whyChooseDescription:
        "Choosing S-Twins for Ford used spare parts means opting for a cost-effective, reliable, and eco-friendly solution. We pride ourselves on our sustainable practices, recycling Ford parts to reduce environmental impact. Our Ford wrecking services are tailored to offer:",
      benefits: [
        "Cost-Effectiveness",
        "Reliable Quality",
        "Ease of Sourcing Specific Ford Parts",
        "Fast and Efficient Service",
        "Sustainability",
      ],
      benefitsTitle: "Benefits of Choosing Used Ford Parts from S-Twins",
      benefitsList: [
        {
          title: "Cost Savings:",
          description:
            "Enjoy significant reductions in costs. Our competitive pricing means you pay less for high-quality Ford parts.",
        },
        {
          title: "Original Manufacturer Quality:",
          description:
            "Each part is sourced from genuine Ford vehicles, ensuring compatibility and excellence.",
        },
        {
          title: "Hassle-Free Exchanges:",
          description:
            "Mistaken purchases? Our easy exchange policy has you covered.",
        },
        {
          title: "Eco-Friendly Choice:",
          description:
            "By choosing recycled parts, you contribute to environmental conservation.",
        },
      ],
      partsTitle: "WIDE RANGE OF FORD USED PARTS WE OFFER",
      partsDescription:
        "We supply an extensive array of used Ford parts, including:",
      partsList: [
        "Ford Batteries",
        "Doors, Windows, and Seats",
        "Ford Engines",
        "Lighting Systems",
        "Brakes, Bumpers, and More",
        "Covering Various Ford Models",
      ],
      modelsTitle:
        "Our inventory caters to a broad spectrum of Ford models such as:",
      modelsList: [
        "Ford Ranger",
        "Ford Falcon",
        "Ford Territory",
        "Ford Mustang",
      ],
      nationwideTitle: "Nationwide Service - We've Got Australia Covered",
      nationwideDescription:
        "S-Twins ships high-quality Ford auto parts all across Australia. Whether you're in Sydney, Melbourne, Brisbane, or any other location, we ensure timely and safe delivery of the parts you need.",
      contactTitle: "Contact S-Twins for Your Ford Part Needs",
      contactDescription:
        "Ready to find the perfect Ford part? Contact S-Twins today. With our vast inventory and expert team, we are committed to providing you with the best value and service for your Ford vehicle. Call us or reach out online - your one-stop solution for Ford used parts awaits.",
    },
    jeep: {
      title: "Jeep Wreckers – Find Quality Used Jeep Parts",
      heroTitle: "Your Premier Jeep Wreckers in Australia",
      heroDescription:
        "Are you on the lookout for trustworthy Jeep wreckers? S-Twins is your ultimate solution in Australia for all Jeep used car parts. Our team, boasting over a decade of specialized experience in Jeep models, stands ready to assist you with expert guidance and unparalleled service.",
      directAccessTitle: "DIRECT ACCESS TO JEEP REPLACEMENT PARTS",
      directAccessDescription:
        "Why go through intermediaries when you can obtain genuine used Jeep parts directly from us? S-Twins offers you substantial savings in both cost and time. Our direct-to-customer approach ensures you get the best deals on used Jeep parts in Sydney and across Australia.",
      qualityTitle: "Quality Assured Used Jeep Parts",
      qualityDescription:
        "At S-Twins, we specialize in offering high-grade used Jeep spare parts. Our rigorous quality checks, performed by skilled technicians, ensure each part meets the highest standards of reliability and performance. As leading Jeep wreckers, our inventory is constantly replenished, guaranteeing we have the parts you need when you need them.",
      whyChooseTitle: "Why Choose S-Twins as Your Jeep Wreckers?",
      whyChooseDescription:
        "Choosing S-Twins for Jeep used spare parts means opting for a cost-effective, reliable, and eco-friendly solution. We pride ourselves on our sustainable practices, recycling Jeep parts to reduce environmental impact. Our Jeep wrecking services are tailored to offer:",
      benefits: [
        "Cost-Effectiveness",
        "Reliable Quality",
        "Ease of Sourcing Specific Jeep Parts",
        "Fast and Efficient Service",
        "Sustainability",
      ],
      benefitsTitle: "Benefits of Choosing Used Jeep Parts from S-Twins",
      benefitsList: [
        {
          title: "Cost Savings:",
          description:
            "Enjoy significant reductions in costs. Our competitive pricing means you pay less for high-quality Jeep parts.",
        },
        {
          title: "Original Manufacturer Quality:",
          description:
            "Each part is sourced from genuine Jeep vehicles, ensuring compatibility and excellence.",
        },
        {
          title: "Hassle-Free Exchanges:",
          description:
            "Mistaken purchases? Our easy exchange policy has you covered.",
        },
        {
          title: "Eco-Friendly Choice:",
          description:
            "By choosing recycled parts, you contribute to environmental conservation.",
        },
      ],
      partsTitle: "WIDE RANGE OF JEEP USED PARTS WE OFFER",
      partsDescription:
        "We supply an extensive array of used Jeep parts, including:",
      partsList: [
        "Jeep Batteries",
        "Doors, Windows, and Seats",
        "Jeep Engines",
        "Lighting Systems",
        "Brakes, Bumpers, and More",
        "Covering Various Jeep Models",
      ],
      modelsTitle:
        "Our inventory caters to a broad spectrum of Jeep models such as:",
      modelsList: [
        "Jeep Wrangler",
        "Jeep Grand Cherokee",
        "Jeep Cherokee",
        "Jeep Compass",
      ],
      nationwideTitle: "Nationwide Service - We've Got Australia Covered",
      nationwideDescription:
        "S-Twins ships high-quality Jeep auto parts all across Australia. Whether you're in Sydney, Melbourne, Brisbane, or any other location, we ensure timely and safe delivery of the parts you need.",
      contactTitle: "Contact S-Twins for Your Jeep Part Needs",
      contactDescription:
        "Ready to find the perfect Jeep part? Contact S-Twins today. With our vast inventory and expert team, we are committed to providing you with the best value and service for your Jeep vehicle. Call us or reach out online - your one-stop solution for Jeep used parts awaits.",
    },
    holden: {
      title: "Holden Wreckers – Find Quality Used Holden Parts",
      heroTitle: "Your Premier Holden Wreckers in Australia",
      heroDescription:
        "Are you on the lookout for trustworthy Holden wreckers? S-Twins is your ultimate solution in Australia for all Holden used car parts. Our team, boasting over a decade of specialized experience in Holden models, stands ready to assist you with expert guidance and unparalleled service.",
      directAccessTitle: "DIRECT ACCESS TO HOLDEN REPLACEMENT PARTS",
      directAccessDescription:
        "Why go through intermediaries when you can obtain genuine used Holden parts directly from us? S-Twins offers you substantial savings in both cost and time. Our direct-to-customer approach ensures you get the best deals on used Holden parts in Sydney and across Australia.",
      qualityTitle: "Quality Assured Used Holden Parts",
      qualityDescription:
        "At S-Twins, we specialize in offering high-grade used Holden spare parts. Our rigorous quality checks, performed by skilled technicians, ensure each part meets the highest standards of reliability and performance. As leading Holden wreckers, our inventory is constantly replenished, guaranteeing we have the parts you need when you need them.",
      whyChooseTitle: "Why Choose S-Twins as Your Holden Wreckers?",
      whyChooseDescription:
        "Choosing S-Twins for Holden used spare parts means opting for a cost-effective, reliable, and eco-friendly solution. We pride ourselves on our sustainable practices, recycling Holden parts to reduce environmental impact. Our Holden wrecking services are tailored to offer:",
      benefits: [
        "Cost-Effectiveness",
        "Reliable Quality",
        "Ease of Sourcing Specific Holden Parts",
        "Fast and Efficient Service",
        "Sustainability",
      ],
      benefitsTitle: "Benefits of Choosing Used Holden Parts from S-Twins",
      benefitsList: [
        {
          title: "Cost Savings:",
          description:
            "Enjoy significant reductions in costs. Our competitive pricing means you pay less for high-quality Holden parts.",
        },
        {
          title: "Original Manufacturer Quality:",
          description:
            "Each part is sourced from genuine Holden vehicles, ensuring compatibility and excellence.",
        },
        {
          title: "Hassle-Free Exchanges:",
          description:
            "Mistaken purchases? Our easy exchange policy has you covered.",
        },
        {
          title: "Eco-Friendly Choice:",
          description:
            "By choosing recycled parts, you contribute to environmental conservation.",
        },
      ],
      partsTitle: "WIDE RANGE OF HOLDEN USED PARTS WE OFFER",
      partsDescription:
        "We supply an extensive array of used Holden parts, including:",
      partsList: [
        "Holden Batteries",
        "Doors, Windows, and Seats",
        "Holden Engines",
        "Lighting Systems",
        "Brakes, Bumpers, and More",
        "Covering Various Holden Models",
      ],
      modelsTitle:
        "Our inventory caters to a broad spectrum of Holden models such as:",
      modelsList: [
        "Holden Commodore",
        "Holden Captiva",
        "Holden Colorado",
        "Holden Astra",
      ],
      nationwideTitle: "Nationwide Service - We've Got Australia Covered",
      nationwideDescription:
        "S-Twins ships high-quality Holden auto parts all across Australia. Whether you're in Sydney, Melbourne, Brisbane, or any other location, we ensure timely and safe delivery of the parts you need.",
      contactTitle: "Contact S-Twins for Your Holden Part Needs",
      contactDescription:
        "Ready to find the perfect Holden part? Contact S-Twins today. With our vast inventory and expert team, we are committed to providing you with the best value and service for your Holden vehicle. Call us or reach out online - your one-stop solution for Holden used parts awaits.",
    },
    dodge: {
      title: "Dodge Wreckers – Find Quality Used Dodge Parts",
      heroTitle: "Your Premier Dodge Wreckers in Australia",
      heroDescription:
        "Are you on the lookout for trustworthy Dodge wreckers? S-Twins is your ultimate solution in Australia for all Dodge used car parts. Our team, boasting over a decade of specialized experience in Dodge models, stands ready to assist you with expert guidance and unparalleled service.",
      directAccessTitle: "DIRECT ACCESS TO DODGE REPLACEMENT PARTS",
      directAccessDescription:
        "Why go through intermediaries when you can obtain genuine used Dodge parts directly from us? S-Twins offers you substantial savings in both cost and time. Our direct-to-customer approach ensures you get the best deals on used Dodge parts in Sydney and across Australia.",
      qualityTitle: "Quality Assured Used Dodge Parts",
      qualityDescription:
        "At S-Twins, we specialize in offering high-grade used Dodge spare parts. Our rigorous quality checks, performed by skilled technicians, ensure each part meets the highest standards of reliability and performance. As leading Dodge wreckers, our inventory is constantly replenished, guaranteeing we have the parts you need when you need them.",
      whyChooseTitle: "Why Choose S-Twins as Your Dodge Wreckers?",
      whyChooseDescription:
        "Choosing S-Twins for Dodge used spare parts means opting for a cost-effective, reliable, and eco-friendly solution. We pride ourselves on our sustainable practices, recycling Dodge parts to reduce environmental impact. Our Dodge wrecking services are tailored to offer:",
      benefits: [
        "Cost-Effectiveness",
        "Reliable Quality",
        "Ease of Sourcing Specific Dodge Parts",
        "Fast and Efficient Service",
        "Sustainability",
      ],
      benefitsTitle: "Benefits of Choosing Used Dodge Parts from S-Twins",
      benefitsList: [
        {
          title: "Cost Savings:",
          description:
            "Enjoy significant reductions in costs. Our competitive pricing means you pay less for high-quality Dodge parts.",
        },
        {
          title: "Original Manufacturer Quality:",
          description:
            "Each part is sourced from genuine Dodge vehicles, ensuring compatibility and excellence.",
        },
        {
          title: "Hassle-Free Exchanges:",
          description:
            "Mistaken purchases? Our easy exchange policy has you covered.",
        },
        {
          title: "Eco-Friendly Choice:",
          description:
            "By choosing recycled parts, you contribute to environmental conservation.",
        },
      ],
      partsTitle: "WIDE RANGE OF DODGE USED PARTS WE OFFER",
      partsDescription:
        "We supply an extensive array of used Dodge parts, including:",
      partsList: [
        "Dodge Batteries",
        "Doors, Windows, and Seats",
        "Dodge Engines",
        "Lighting Systems",
        "Brakes, Bumpers, and More",
        "Covering Various Dodge Models",
      ],
      modelsTitle:
        "Our inventory caters to a broad spectrum of Dodge models such as:",
      modelsList: [
        "Dodge Charger",
        "Dodge Challenger",
        "Dodge Journey",
        "Dodge Nitro",
      ],
      nationwideTitle: "Nationwide Service - We've Got Australia Covered",
      nationwideDescription:
        "S-Twins ships high-quality Dodge auto parts all across Australia. Whether you're in Sydney, Melbourne, Brisbane, or any other location, we ensure timely and safe delivery of the parts you need.",
      contactTitle: "Contact S-Twins for Your Dodge Part Needs",
      contactDescription:
        "Ready to find the perfect Dodge part? Contact S-Twins today. With our vast inventory and expert team, we are committed to providing you with the best value and service for your Dodge vehicle. Call us or reach out online - your one-stop solution for Dodge used parts awaits.",
    },
  };

  const content =
    brandContent[brandName.toLowerCase() as keyof typeof brandContent] ||
    brandContent.dodge;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="#191818"
        minH="60vh"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box position="absolute" inset="0" bg="black" opacity="0.6" />
        <VStack
          position="relative"
          zIndex={2}
          textAlign="center"
          color="white"
          maxW="800px"
          px={6}
          gap={6}
        >
          <Text
            fontSize={{ base: "lg", md: "30px" }}
            color="#d80c19"
            fontWeight="bold"
            textTransform="uppercase"
          >
            {content.title}
          </Text>
          <Text
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            lineHeight="1.2"
          >
            {content.heroTitle}
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.300"
            lineHeight="1.6"
            maxW="600px"
          >
            {content.heroDescription}
          </Text>
        </VStack>
      </Box>

      {/* Direct Access Section */}
      <Box py={20} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 12 }}
          maxW="1400px"
          mx="auto"
        >
          <Box flex="0.6">
            <Image
              src="/yard.png"
              alt="Car Wrecking Yard"
              w="full"
              h="400px"
              objectFit="cover"
              borderRadius="lg"
            />
          </Box>
          <Box flex="0.4" display="flex" alignItems="center">
            <VStack align="flex-start" gap={6} w="full">
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color="gray.800"
                lineHeight="1.2"
              >
                {content.directAccessTitle}
              </Text>
              <Box w="full" h="2px" bg="#d80c19" />
              <Text fontSize="md" color="gray.600" lineHeight="1.6">
                {content.directAccessDescription}
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Box>

      {/* Quality Section */}
      <Box bg="#151617" py={20} px={{ base: 6, md: 8, lg: 12 }}>
        <Box maxW="800px" mx="auto" textAlign="center">
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="#d80c19"
            mb={6}
          >
            {content.qualityTitle}
          </Text>
          <Text fontSize="md" color="white" lineHeight="1.6">
            {content.qualityDescription}
          </Text>
        </Box>
      </Box>

      {/* Why Choose Section */}
      <Box>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 0 }}
          minH="800px"
        >
          <Box flex="0.5" bg="#d80c19" p={8}>
            <VStack align="flex-start" gap={6} color="white">
              <Text
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="1.2"
              >
                {content.whyChooseTitle}
              </Text>
              <Box w="full" h="1px" bg="black" />
              <Text fontSize={{ base: "lg", md: "xl" }} lineHeight="1.6">
                {content.whyChooseDescription}
              </Text>
              <VStack align="flex-start" gap={2} mt={4}>
                {content.benefits.map((benefit, index) => (
                  <Text key={index} fontSize={{ base: "lg", md: "xl" }}>
                    • {benefit}
                  </Text>
                ))}
              </VStack>
            </VStack>
          </Box>
          <Box flex="0.5">
            <Image
              src="/about1.jpg"
              alt="S-Twins Team"
              w="full"
              h="800px"
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>

      {/* Benefits Section */}
      <Box bg="white">
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 0 }}
          minH="800px"
        >
          <Box flex="0.5">
            <Image
              src="/aboutus2.jpg"
              alt="Benefits"
              w="full"
              h="800px"
              objectFit="cover"
            />
          </Box>
          <Box flex="0.5" display="flex" alignItems="center" p={8}>
            <VStack align="flex-start" gap={6} w="full">
              <Text
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="bold"
                color="#d80c19"
                lineHeight="1.2"
              >
                {content.benefitsTitle}
              </Text>
              <VStack align="flex-start" gap={4} w="full">
                {content.benefitsList.map((benefit, index) => (
                  <Box key={index}>
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="bold"
                      color="gray.800"
                      mb={2}
                    >
                      {benefit.title}
                    </Text>
                    <Text
                      fontSize={{ base: "md", lg: "lg" }}
                      color="gray.600"
                      lineHeight="1.5"
                    >
                      {benefit.description}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </VStack>
          </Box>
        </Flex>
      </Box>

      {/* Parts Range Section */}
      <Box bg="#f5f5f5" py={20} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 12 }}
          maxW="1400px"
          mx="auto"
        >
          <Box flex="0.6">
            <Image
              src="/yard.png"
              alt="Parts Range"
              w="full"
              h="400px"
              objectFit="cover"
              borderRadius="lg"
            />
          </Box>
          <Box flex="0.4" display="flex" alignItems="center">
            <VStack align="flex-start" gap={6} w="full">
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color="gray.800"
                lineHeight="1.2"
                textTransform="uppercase"
              >
                {content.partsTitle}
              </Text>
              <Box w="full" h="2px" bg="#d80c19" />
              <Text fontSize="md" color="gray.600" lineHeight="1.6" mb={4}>
                {content.partsDescription}
              </Text>
              <VStack align="flex-start" gap={2}>
                {content.partsList.map((part, index) => (
                  <Text key={index} fontSize="md" color="gray.700">
                    • {part}
                  </Text>
                ))}
              </VStack>
            </VStack>
          </Box>
        </Flex>
      </Box>

      {/* Models Section */}
      <Box>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 0 }}
          minH="800px"
        >
          <Box flex="0.5" bg="#d80c19" p={8} display="flex" alignItems="center">
            <VStack align="flex-start" gap={6} color="white" w="full">
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                lineHeight="1.2"
              >
                Our inventory caters to a broad spectrum of {content.title}{" "}
                models such as:
              </Text>
              <VStack align="flex-start" gap={3} w="full">
                {content.modelsList.map((model, index) => (
                  <Text key={index} fontSize={{ base: "md", md: "lg" }}>
                    • {model}
                  </Text>
                ))}
              </VStack>
            </VStack>
          </Box>
          <Box flex="0.5">
            <Image
              src="/workshopsecond.jpg"
              alt="Mechanic Working"
              w="full"
              h="800px"
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>

      {/* Contact Section */}
      <Box bg="white" py={20} px={{ base: 6, md: 8, lg: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 12 }}
          maxW="1400px"
          mx="auto"
        >
          <Box flex="0.4">
            <Image
              src="/workshopthird.jpg"
              alt="Contact"
              w="full"
              h="400px"
              objectFit="cover"
              borderRadius="lg"
            />
          </Box>
          <Box flex="0.6" display="flex" alignItems="center">
            <VStack align="flex-start" gap={6} w="full">
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color="gray.800"
                lineHeight="1.2"
              >
                {content.nationwideTitle}
              </Text>
              <Text fontSize="md" color="gray.600" lineHeight="1.6" mb={4}>
                {content.nationwideDescription}
              </Text>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color="gray.800"
                lineHeight="1.2"
              >
                {content.contactTitle}
              </Text>
              <Text fontSize="md" color="gray.600" lineHeight="1.6" mb={6}>
                {content.contactDescription}
              </Text>
              <HStack gap={4} flexWrap="wrap">
                <Link href="tel:0296047366" _hover={{ textDecoration: "none" }}>
                  <Button
                    bg="#191818"
                    color="white"
                    size="lg"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="md"
                    shadow="lg"
                  >
                    <HStack gap={2}>
                      <FaPhone
                        color="#d90c19"
                        style={{ transform: "rotate(90deg)" }}
                      />
                      <Text>02 9604 7366</Text>
                    </HStack>
                  </Button>
                </Link>
                <NextLink href="/contact">
                  <Button
                    bg="#d90c19"
                    color="white"
                    size="lg"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="md"
                    shadow="lg"
                  >
                    Enquire Now
                  </Button>
                </NextLink>
              </HStack>
            </VStack>
          </Box>
        </Flex>
      </Box>

      {/* Quote Request Form */}
      <QuoteRequest />      
    </Box>
  );
};

export default CarBrandPage;
