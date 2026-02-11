"use client";

import {
  Box,
  Text,
  VStack,
  Image,
  HStack,
  Button,
} from "@chakra-ui/react";
import { FaArrowLeft, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { heroFont } from "@/shared/lib/heroFont";
import QuoteRequest from "@/components/QuoteRequest";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
}

interface BlogPageClientProps {
  post: BlogPost | undefined;
  slug: string;
}

export default function BlogPageClient({ post }: BlogPageClientProps) {
  const router = useRouter();

  if (!post) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.600">
            Blog post not found
          </Text>
          <Button
            onClick={() => router.back()}
            bg="#d80c19"
            color="white"
            _hover={{ bg: "#b30915" }}
          >
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Go Back
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      {/* Header Section */}
      <Box as="section" bg="gray.900" py={{ base: 8, md: 12, lg: 16 }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8, lg: 16 }}>
          <VStack gap={{ base: 6, md: 8 }} align="start">
            {/* Back Button */}
            <Button
              onClick={() => router.back()}
              bg="transparent"
              color="white"
              border="1px solid"
              borderColor="gray.600"
              _hover={{ bg: "gray.800", borderColor: "#d80c19" }}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "sm", md: "md" }}
            >
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Back to News
            </Button>

            {/* Article Meta */}
            <VStack align={{ base: "center", md: "start" }} gap={3} w="full">
              <HStack
                gap={{ base: 4, md: 6 }}
                flexWrap="wrap"
                color="gray.300"
                justify={{ base: "center", md: "flex-start" }}
              >
                <HStack gap={2}>
                  <FaCalendarAlt />
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                    {post.date}
                  </Text>
                </HStack>
                <HStack gap={2}>
                  <FaUser />
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                    {post.author}
                  </Text>
                </HStack>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                  {post.readTime}
                </Text>
              </HStack>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                bg="#d80c19"
                px={{ base: 3, md: 4 }}
                py={{ base: 1, md: 2 }}
                borderRadius="full"
                color="white"
                fontWeight="600"
              >
                {post.category}
              </Text>
            </VStack>

            {/* Article Title */}
            <VStack
              align={{ base: "center", md: "start" }}
              gap={{ base: 1, md: 2 }}
              w="full"
            >
              <Text
                as="h1"
                fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="white"
                lineHeight="1.1"
                fontFamily={heroFont}
                textTransform="uppercase"
                letterSpacing="tight"
                textAlign={{ base: "center", md: "left" }}
              >
                3 QUESTIONS YOU NEED TO ASK BEFORE BUYING RECYCLED CAR PARTS ONLINE
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>

      {/* Article Content */}
      <Box as="section" bg="white" py={{ base: 12, md: 16 }}>
        <Box maxW="800px" mx="auto" px={{ base: 4, md: 8, lg: 16 }}>
          <VStack gap={{ base: 6, md: 8 }} align="start">
            {/* Featured Image */}
            <Box w="full" borderRadius="lg" overflow="hidden" boxShadow="xl">
              <Image
                src={post.image}
                alt={post.title}
                w="full"
                h={{ base: "250px", sm: "300px", md: "400px" }}
                objectFit="cover"
              />
            </Box>

            {/* Article Content */}
            <Box
              w="full"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.8"
              color="gray.700"
              css={{
                "& h2": {
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#d80c19",
                  marginTop: "1.5rem",
                  marginBottom: "0.75rem",
                },
                "& h3": {
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "#2d3748",
                  marginTop: "1.25rem",
                  marginBottom: "0.5rem",
                },
                "& p": {
                  marginBottom: "1rem",
                },
                "& ul": {
                  paddingLeft: "1.25rem",
                  marginBottom: "1rem",
                },
                "& li": {
                  marginBottom: "0.5rem",
                },
                "& strong": {
                  fontWeight: "bold",
                  color: "#2d3748",
                },
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <Box w="full" h="1px" bg="gray.200" />

            {/* Author Info */}
            <Box
              w="full"
              bg="gray.50"
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <HStack gap={{ base: 3, md: 4 }} align="start">
                <Box
                  w={{ base: "50px", md: "60px" }}
                  h={{ base: "50px", md: "60px" }}
                  bg="#d80c19"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="bold"
                  flexShrink={0}
                >
                  ST
                </Box>
                <VStack align="start" gap={2} flex="1">
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "md", md: "lg" }}
                    color="gray.800"
                  >
                    {post.author}
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                    S-Twins Auto Parts & Recycling
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                    Your trusted source for quality recycled auto parts
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* Call to Action */}
            <Box
              w="full"
              bg="#d80c19"
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
              textAlign="center"
              color="white"
            >
              <VStack gap={{ base: 3, md: 4 }}>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                  Need Quality Recycled Auto Parts?
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }} opacity="0.9">
                  Contact S-Twins today for all your automotive needs
                </Text>
                <VStack gap={3} w="full" maxW="400px" mx="auto">
                  <Button
                    bg="white"
                    color="#d80c19"
                    _hover={{ bg: "gray.100" }}
                    size={{ base: "md", md: "lg" }}
                    px={{ base: 6, md: 8 }}
                    w="full"
                    onClick={() => router.push("/parts")}
                  >
                    Browse Parts
                  </Button>
                  <Button
                    bg="transparent"
                    color="white"
                    border="2px solid"
                    borderColor="white"
                    _hover={{ bg: "white", color: "#d80c19" }}
                    size={{ base: "md", md: "lg" }}
                    px={{ base: 6, md: 8 }}
                    w="full"
                    onClick={() => router.push("/contact")}
                  >
                    Contact Us
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Box>

      {/* Quote Request Section */}
      <QuoteRequest />

      {/* Footer */}
      <Footer />
    </>
  );
}
