"use client";

import { useState, useEffect } from "react";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/shared/api/instance";

const Testimonials = () => {
  const [currentReview, setCurrentReview] = useState(0);

  // Fetch reviews from local API. Large cache and stale times to reduce requests.
  type Review = {
    author_name?: string;
    rating: number;
    text: string;
    relative_time_description?: string;
    author?: string;
    name?: string;
  };
  type ReviewsResponse = {
    rating: number;
    total: number;
    reviews: Review[];
  };

  const { data } = useQuery<ReviewsResponse>({
    queryKey: ["googleReviews"],
    queryFn: async () => {
      const res = await axiosInstance.get<ReviewsResponse>("/reviews");
      return res.data as ReviewsResponse;
    },
    // NOTE: intentionally not specifying cacheTime/staleTime here to match
    // the project's react-query types and avoid lint errors. If you'd like
    // a global longer cache, we can configure the QueryClient in a
    // provider setup (recommended).
    retry: 1,
  });

  const reviews = data?.reviews ?? [];

  // Auto-scroll every 6 seconds when we have reviews
  useEffect(() => {
    if (!reviews.length) return;
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [reviews.length]);


  const review: Review = reviews[currentReview] ?? {
    text: "",
    author_name: "",
    rating: 0,
  };

  return (
    <Box
      as="section"
      minH={{ base: "500px", lg: "400px" }}
      position="relative"
      overflow="hidden"
    >
      {/* Red section - full width on mobile, angled on desktop */}
      <Box
        position="absolute"
        top={{ base: "50%", lg: "0" }}
        right="0"
        w={{ base: "100%", lg: "50%" }}
        h={{ base: "50%", lg: "100%" }}
        bg="red.600"
        clipPath={{
          base: "none",
          lg: "polygon(7% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        zIndex={0}
      />

      {/* White section - full width on mobile, angled on desktop */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w={{ base: "100%", lg: "50%" }}
        h={{ base: "50%", lg: "100%" }}
        bg="white"
        clipPath={{
          base: "none",
          lg: "polygon(0% 0%, 93% 0%, 93% 100%, 0% 100%)",
        }}
        zIndex={10}
        px={{ base: 6, md: 8, lg: 20 }}
        py={{ base: 12, lg: 16 }}
        display="flex"
        alignItems="center"
      >
        <Box maxW={{ base: "full", lg: "md" }} color="black">
          <Text
            as="h2"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            mb={2}
            color="black"
            textAlign={{ base: "center", lg: "left" }}
          >
            WHAT OUR CLIENTS HAVE TO SAY
          </Text>
          <Box
            w={{ base: "24", lg: "32" }}
            h="1"
            bg="red.600"
            mb={4}
            mx={{ base: "auto", lg: "0" }}
          />
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.800"
            mb={4}
            textAlign={{ base: "center", lg: "left" }}
            lineHeight="1.6"
          >
            S-Twins has been serving satisfied customers for over 30 years. For
            all the best in spare car parts, shop with us and join thousands of
            our existing customers.
          </Text>
          <VStack align={{ base: "center", lg: "flex-start" }} gap={2} mt={4}>
            <HStack gap={2}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color="#F59E0B" size={16} />
              ))}
            </HStack>
            <Text
              fontWeight="semibold"
              mt={1}
              color="black"
              fontSize={{ base: "sm", lg: "md" }}
            >
              4.9 Google Rating
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Testimonial text - positioned in red section */}
      <Box
        position="absolute"
        zIndex={20}
        px={{ base: 6, md: 8, lg: 20 }}
        py={{ base: 12, lg: 16 }}
        display="flex"
        justifyContent={{ base: "center", lg: "flex-end" }}
        alignItems="center"
        h={{ base: "50%", lg: "100%" }}
        w={{ base: "100%", lg: "50%" }}
        top={{ base: "50%", lg: "0" }}
        left={{ base: "0", lg: "auto" }}
        right={{ base: "0", lg: "auto" }}
        ml={{ base: "0", lg: "50%" }}
      >
        <Box
          maxW={{ base: "full", lg: "md" }}
          color="white"
          textAlign={{ base: "center", lg: "right" }}
          transition="opacity 0.5s"
        >
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            mb={6}
            lineHeight="1.6"
            px={{ base: 4, lg: 0 }}
          >
            &ldquo;{review.text}&rdquo;
          </Text>
          <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }} mb={2}>
            {review.author_name ?? review.name ?? review.author}
          </Text>
          <HStack
            justify={{ base: "center", lg: "flex-end" }}
            align="center"
            gap={1}
            mt={1}
          >
            {[...Array(review.rating)].map((_, i) => (
              <FaStar key={i} color="#F59E0B" size={16} />
            ))}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Testimonials;
