"use client";

import { Box, Flex, Text, Button, VStack, Image, Grid } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCars } from "@/shared/api/cars";

type Car = {
  cid: number;
  ID: number;
  name: string;
  make: string;
  prod_cat: string;
  year: number;
  model?: string;
  stockNo?: string;
  thumbnailId?: string | null;
  galleryIds?: string[];
};

type CarsResponse = {
  cars: Car[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
};

function toProxied(src?: string | null): string | null {
  if (!src) return null;
  try {
    const u = new URL(src);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    if (origin && u.origin !== origin) {
      return `${origin}/api/image-proxy?url=${encodeURIComponent(src)}`;
    }
    return src;
  } catch {
    return src;
  }
}

const CarsHero = () => {
  const [page, setPage] = useState(1);
  const pageSize = 16;

  const { data: carsResp, isLoading } = useQuery<CarsResponse>({
    queryKey: ["cars-hero", page, pageSize],
    queryFn: () => fetchCars({ page, pageSize }),
  });

  const cars: Car[] = carsResp?.cars ?? [];

  const toNum = (v: string | number | undefined): number => {
    if (v === undefined) return -Infinity;
    if (typeof v === "number") return v;
    const n = parseInt(v.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? n : -Infinity;
  };
  const stockAsNum = (c: Car) => toNum(c.stockNo ?? c.cid);
  const sorted = useMemo(() => [...cars].sort((a, b) => stockAsNum(b) - stockAsNum(a)), [cars]);

  const displayCars = useMemo(
    () =>
      sorted.map((c) => ({
        title: `${c.year} ${c.make} ${c.model ?? ""}`.trim(),
        engine: c.prod_cat ?? "",
        image: toProxied(
          (c.thumbnailId && c.thumbnailId.trim()) ||
            (c.galleryIds && c.galleryIds[0]) ||
            null
        ),
        cid: c.cid,
        stockNo: c.stockNo ?? String(c.cid ?? c.ID),
      })),
    [sorted]
  );

  const pagination = carsResp?.pagination;

  return (
    <>
      {/* Heading */}
      <Box as="section" bg="gray.900" py={8}>
        <Box maxW="1400px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
          <VStack align="start" bg="gray.900" p={6} borderRadius="md" gap={2}>
            <Text as="h1" fontSize="2xl" fontWeight="bold" color="red.400">
              Browse Vehicles
            </Text>
            <Text color="gray.300">
              Showing page {pagination?.page ?? page}
              {pagination?.total ? ` of ${pagination.total} vehicles` : ""}
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Grid */}
      <Box as="section" bg="gray.50" py={16}>
        <Box maxW="1400px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={8}
            maxW="1600px"
            mx="auto"
          >
            {isLoading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <Box key={i} bg="white" borderRadius="xl" boxShadow="lg" overflow="hidden" minW="320px" w="full" h="full" display="flex" flexDirection="column">
                    <Box bg="gray.100" h="280px" />
                    <Box p={8} flex="1" display="flex" flexDirection="column">
                      <Box h="28px" bg="gray.200" mb={3} borderRadius="md" />
                      <Box h="20px" bg="gray.200" mb={6} borderRadius="md" w="60%" />
                      <Flex justify="space-between" align="center" gap={4} mt="auto">
                        <Box h="40px" bg="gray.200" flex="1" borderRadius="md" />
                        <Box h="40px" bg="gray.200" flex="1" borderRadius="md" />
                      </Flex>
                    </Box>
                  </Box>
                ))
              : displayCars.map((car) => (
                  <Box
                    key={car.cid}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="lg"
                    overflow="hidden"
                    _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
                    transition="all 0.3s ease"
                    minW="320px"
                    w="full"
                    h="full"
                    display="flex"
                    flexDirection="column"
                  >
                    <Box bg="gray.100" h="280px">
                      {car.image ? (
                        <Image src={car.image} alt={car.title} w="full" h="full" objectFit="cover" />
                      ) : (
                        <Box w="full" h="100%" display="flex" alignItems="center" justifyContent="center" bg="gray.100" color="gray.500" fontSize="sm">
                          No image
                        </Box>
                      )}
                    </Box>

                    <Box p={8} flex="1" display="flex" flexDirection="column">
                      <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={3} lineHeight="1.3">
                        {car.title}
                      </Text>
                      <Text fontSize="md" color="gray.500" mb={6}>
                        STOCK {car.stockNo}
                      </Text>

                      <Flex justify="space-between" align="center" gap={4} mt="auto">
                        <Link href={`/cars/${car.cid}`} passHref legacyBehavior>
                          <Button as="a" bg="white" color="gray.700" border="1px solid" borderColor="gray.300" _hover={{ bg: "gray.50", borderColor: "#d80c19" }} size="md" px={6} fontSize="md" flex="1">
                            Vehicle Details
                          </Button>
                        </Link>
                        <Link href={`/contact?stock=${encodeURIComponent(car.stockNo || "")}`} passHref legacyBehavior>
                          <Button as="a" bg="#d80c19" color="white" _hover={{ bg: "#b30915" }} size="md" px={6} fontSize="md" flex="1">
                            Send Enquiry
                          </Button>
                        </Link>
                      </Flex>
                    </Box>
                  </Box>
                ))}
          </Grid>

          {/* small pager */}
          {pagination && (
            <Flex justify="space-between" align="center" mt={10}>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage || isLoading}
              >
                ← Previous
              </Button>
              <Text color="gray.600" fontSize="sm">
                Page {pagination.page} of {pagination.totalPages}
              </Text>
              <Button
                bg="#d80c19"
                color="white"
                _hover={{ bg: "#b30915" }}
                onClick={() => setPage((p) => (pagination.hasNextPage ? p + 1 : p))}
                disabled={!pagination.hasNextPage || isLoading}
              >
                Next →
              </Button>
            </Flex>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CarsHero;
