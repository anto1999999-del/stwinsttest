"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Text,
  Image,
  Button,
  Grid,
  VStack,
  chakra,
  Input,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchCars } from "@/shared/api/cars";
import { fetchFilters } from "@/shared/api/filters";
import { useRouter } from "next/navigation";

interface Car {
  cid: number;
  ID: number;
  name: string;
  make: string;
  prod_cat: string;
  year: number;
  model?: string;
  stockNo?: string;
  thumbnailId?: string | null;   // absolute or http uploader URL
  galleryIds?: string[];         // absolute or http uploader URLs
}

interface CarsResponse {
  cars: Car[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface FiltersData {
  years: number[];
  makes: string[] | { make: string }[];
  models?: Array<{ make?: string; model?: string }>;
}

/** route external/http media via the site’s proxy (same approach as parts) */
function toProxied(src?: string | null): string | null {
  if (!src) return null;
  try {
    const u = new URL(src);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    // if it’s not our origin, go through the proxy
    if (origin && u.origin !== origin) {
      return `${origin}/api/image-proxy?url=${encodeURIComponent(src)}`;
    }
    return src;
  } catch {
    return src;
  }
}

const CarGrid = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(16);
  const [make, setMake] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);

  // applied filters (for fetch)
  const [appliedYear, setAppliedYear] = useState<number | null>(null);
  const [appliedQuery, setAppliedQuery] = useState<string | null>(null);

  // UI drafts
  const [draftYear, setDraftYear] = useState<number | null>(null);
  const [draftQuery, setDraftQuery] = useState<string | null>(null);

  const { data: filtersData } = useQuery<FiltersData>({
    queryKey: ["car-filters"],
    queryFn: fetchFilters,
  });

  const { data: carsResp, isLoading } = useQuery<CarsResponse>({
    queryKey: ["cars", page, pageSize, make, model, appliedYear, appliedQuery],
    queryFn: () =>
      fetchCars({
        page,
        pageSize,
        make: make || undefined,
        model: model || undefined,
        year: appliedYear ?? undefined,
        q: appliedQuery || undefined,
      }),
  });

  const cars: Car[] = carsResp?.cars ?? [];

  // numeric sort by stock or cid as fallback
  const toNum = (v: string | number | undefined): number => {
    if (v === undefined) return -Infinity;
    if (typeof v === "number") return v;
    const n = parseInt(v.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? n : -Infinity;
  };
  const stockAsNum = (c: Car) => toNum(c.stockNo ?? c.cid);

  const sorted = useMemo(
    () => [...cars].sort((a, b) => stockAsNum(b) - stockAsNum(a)),
    [cars]
  );

  // choose image and proxy it
  const displayCars = useMemo(
    () =>
      sorted.map((c) => {
        const raw =
          (c.thumbnailId && c.thumbnailId.trim()) ||
          (c.galleryIds && c.galleryIds[0]) ||
          null;
        const image = toProxied(raw);

        return {
          title: `${c.year} ${c.make} ${c.model ?? ""}`.trim(),
          engine: c.prod_cat ?? "",
          image,
          cid: c.cid,
          stockNo: c.stockNo ?? String(c.cid ?? c.ID),
        };
      }),
    [sorted]
  );

  const router = useRouter();

  const pagination = carsResp?.pagination;

  return (
    <Box as="section" bg="#e5e5e5">
      {/* Header / Filters */}
      <Box pt="20px" w="full">
        <Box
          display={{ base: "flex", md: "flex" }}
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "flex-start" }}
          justifyContent={{ base: "center", md: "space-between" }}
          mb={10}
          gap={{ base: 6, md: 4 }}
          px={{ base: 11, md: 11, xl: 11 }}
        >
          <Box flex={{ base: "none", md: "1" }} minW={{ base: "auto", md: "300px" }}>
            <Box position="relative" w="fit-content" mx={{ base: "auto", md: "0" }} mb={{ base: 4, md: 1 }}>
              <Text
                as="h2"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="extrabold"
                color="black"
                mb={{ base: 2, md: 1 }}
                textAlign={{ base: "center", md: "left" }}
              >
                FEATURED WRECKING CARS
              </Text>
              <Box h="2px" bg="red.600" w={{ base: "full", md: "auto" }} mx={{ base: "auto", md: "0" }} />
            </Box>
            <VStack gap={{ base: 3, md: 0 }} align={{ base: "center", md: "flex-start" }}>
              <Text color="rgb(31 41 55 / var(--tw-text-opacity, 1))" textAlign={{ base: "center", md: "left" }}>
                S-Twins stocks the finest in premium wrecking cars including American, Japanese, and Australian performance models.
              </Text>
              <Text color="rgb(31 41 55 / var(--tw-text-opacity, 1))" textAlign={{ base: "center", md: "left" }}>
                See below for our top featured wrecking cars.
              </Text>
            </VStack>
          </Box>

          <Box display={{ base: "flex", md: "flex" }} flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "flex-start" }} gap={4}>
            <chakra.select
              value={draftYear ?? ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDraftYear(e.target.value ? parseInt(e.target.value, 10) : null)
              }
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 6,
                padding: "8px 12px",
                background: "white",
              }}
            >
              <option value="">All Years</option>
              {filtersData &&
                Array.isArray(filtersData.years) &&
                filtersData.years.map((y: number) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
            </chakra.select>

            <Input
              placeholder="Search"
              value={draftQuery ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDraftQuery(e.target.value || null)
              }
              bg="white"
            />

            <Button
              bg="red.600"
              _hover={{ bg: "red.700" }}
              color="white"
              onClick={() => {
                setAppliedYear(draftYear);
                setAppliedQuery(draftQuery);
                setPage(1);
              }}
            >
              Apply
            </Button>
            <Button
              onClick={() => {
                setMake(null);
                setModel(null);
                setDraftYear(null);
                setDraftQuery(null);
                setAppliedYear(null);
                setAppliedQuery(null);
                setPage(1);
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Car Grid */}
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap={0}
        w="full"
        mx={0}
        px={0}
      >
        {isLoading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <Box key={i} h="330px" bg="white" borderRadius="lg" shadow="sm" />
            ))
          : displayCars.map((car, idx) => (
              <Box
                key={`${car.cid}-${idx}`}
                position="relative"
                overflow="hidden"
                borderRadius="lg"
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                transition="all 0.3s ease"
                _hover={{ transform: "scale(1.02)" }}
                cursor="pointer"
                onClick={() => {
                  if (car.cid) router.push(`/cars/${car.cid}`);
                }}
              >
                {car.image ? (
                  <Image
                    src={car.image}
                    alt={car.title}
                    w="full"
                    h="330px"
                    verticalAlign="middle"
                    objectFit="cover"
                    objectPosition="center top"
                    transition="all 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                ) : (
                  <Box
                    w="full"
                    h="330px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="gray.100"
                    color="gray.500"
                    fontSize="sm"
                  >
                    No image
                  </Box>
                )}

                {/* Red overlay on hover */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="rgba(216, 12, 25, 0.8)"
                  opacity="0"
                  transform="translateY(20px)"
                  transition="all 0.3s ease-in-out"
                  _hover={{ opacity: "1", transform: "translateY(0)" }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  p={6}
                >
                  <Box textAlign="left">
                    <Text fontSize="xl" fontWeight="bold" mb={2} color="white">
                      {car.title}
                    </Text>
                    <Button
                      border="2px solid white"
                      bg="transparent"
                      color="white"
                      _hover={{ bg: "white", color: "#d80c19" }}
                      size="md"
                      borderRadius="md"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (car.cid) router.push(`/cars/${car.cid}`);
                      }}
                    >
                      View More
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
      </Grid>

      {/* Pagination */}
      {pagination && (
        <Box px={{ base: 6, md: 11, xl: 11 }} py={8}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            w="full"
            gap={4}
          >
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage || isLoading}
            >
              ← Previous
            </Button>

            <Text color="gray.700" fontSize="sm">
              Page {pagination.page} of {pagination.totalPages} — {pagination.total} vehicles
            </Text>

            <Button
              bg="red.600"
              _hover={{ bg: "red.700" }}
              color="white"
              onClick={() => setPage((p) => (pagination.hasNextPage ? p + 1 : p))}
              disabled={!pagination.hasNextPage || isLoading}
            >
              Next →
            </Button>
          </Box>
        </Box>
      )}
      
    </Box>
  );
};

export default CarGrid;
