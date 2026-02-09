"use client";

import React from "react";
import { Box, Text, Button, VStack, chakra, Stack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import useParts from "@/shared/stores/useParts";
import { fetchFilters } from "@/shared/api/filters";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchMakes, fetchModels } from "@/shared/api/collections";
import { toHumanReadable } from "@/shared/lib/textUtils";

interface Filters {
  years: string[];
  makes: string[];
  models?: string[];
  categories: string[];
}

const FilterSection = ({
  applyFilters,
}: {
  applyFilters: (q?: string) => void;
}) => {
  const {
    selectedYear,
    selectedMake,
    selectedModel,
    selectedCategory,
    selectedQuery,
    setSelectedYear,
    setSelectedMake,
    setSelectedModel,
    setSelectedCategory,
  } = useParts();

  const { data: filters, isLoading } = useQuery<Filters>({
    queryKey: ["filters"],
    queryFn: fetchFilters,
  });

  const { data: makes } = useQuery({
    queryKey: ["makes"],
    queryFn: fetchMakes,
  });

  const { data: models } = useQuery({
    queryKey: ["models", selectedMake],
    queryFn: () => fetchModels(selectedMake!),
    enabled: !!selectedMake,
  });

  // clear model when make changes
  useEffect(() => {
    setSelectedModel(null);
  }, [selectedMake, setSelectedModel]);

  const resetFilters = () => {
    setSelectedYear(null);
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedCategory(null);
  };

  const pulse = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.55; }
    100% { opacity: 1; }
  `;

  // Prevent server-side rendering of Chakra components (avoids ChakraProvider context errors during prerender)
  if (typeof window === "undefined") return null;

  return (
    <Box maxW="1400px" mx="auto" px={{ base: 4, md: 0 }} overflowX="hidden">
      <VStack
        gap={6}
        align="start"
        bg="gray.900"
        p={{ base: 4, md: 6 }}
        borderRadius="md"
      >
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color="red.400"
        >
          Search parts based on car
        </Text>

        {isLoading ? (
          <>
            <Stack direction={{ base: "column", md: "row" }} gap={4} w="full">
              {[0, 1, 2, 3].map((i) => (
                <Box
                  key={i}
                  width={{ base: "100%", md: "250px" }}
                  h="56px"
                  bg="gray.700"
                  borderRadius="md"
                  animation={`${pulse} 1.2s ease-in-out infinite`}
                />
              ))}
            </Stack>
          </>
        ) : (
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={4}
            w="full"
            flexWrap="wrap"
            align="stretch"
          >
            <Box w={{ base: "100%", md: "250px" }} minW={0}>
              <chakra.select
                display="block"
                boxSizing="border-box"
                px={3}
                w="100%"
                h="56px"
                borderRadius="md"
                fontSize="md"
                bg="gray.800"
                color="gray.100"
                value={selectedYear ?? ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedYear(
                    e.target.value ? parseInt(e.target.value, 10) : null
                  )
                }
                aria-label="Select Year"
              >
                <option value="">Select Year</option>
                {filters?.years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </chakra.select>
            </Box>

            <Box w={{ base: "100%", md: "250px" }} minW={0}>
              <chakra.select
                display="block"
                boxSizing="border-box"
                px={3}
                w="100%"
                h="56px"
                borderRadius="md"
                fontSize="md"
                bg="gray.800"
                color="gray.100"
                value={selectedMake ?? ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedMake(e.target.value || null)
                }
                aria-label="Select Make"
              >
                <option value="">Select Make</option>
                {(Array.isArray(makes) ? makes : []).map(
                  (m: { make: string }) => (
                    <option key={m.make} value={m.make}>
                      {toHumanReadable(m.make)}
                    </option>
                  )
                )}
              </chakra.select>
            </Box>

            <Box w={{ base: "100%", md: "250px" }} minW={0}>
              <chakra.select
                display="block"
                boxSizing="border-box"
                px={3}
                w="100%"
                h="56px"
                borderRadius="md"
                fontSize="md"
                bg="gray.800"
                color="gray.100"
                value={selectedModel ?? ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedModel(e.target.value || null)
                }
                aria-label="Select Model"
                disabled={!selectedMake}
              >
                <option value="">Select Model</option>
                {(Array.isArray(models) ? models : []).map(
                  (mo: { model: string }) => (
                    <option key={mo.model} value={mo.model}>
                      {toHumanReadable(mo.model)}
                    </option>
                  )
                )}
              </chakra.select>
            </Box>

            <Box w={{ base: "100%", md: "250px" }} minW={0}>
              <chakra.select
                display="block"
                boxSizing="border-box"
                px={3}
                w="100%"
                h="56px"
                borderRadius="md"
                fontSize="md"
                bg="gray.800"
                color="gray.100"
                value={selectedCategory ?? ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedCategory(e.target.value || null)
                }
                aria-label="Select Category"
              >
                <option value="">Part</option>
                {filters?.categories.map((c) => (
                  <option key={c} value={c}>
                    {toHumanReadable(c)}
                  </option>
                ))}
              </chakra.select>
            </Box>
          </Stack>
        )}

        <Stack
          direction={{ base: "column", md: "row" }}
          gap={4}
          w="full"
          justify="flex-start"
          flexWrap="wrap"
        >
          {isLoading ? (
            <>
              <Box
                w={{ base: "100%", md: "120px" }}
                h="40px"
                bg="gray.700"
                borderRadius="md"
                animation={`${pulse} 1.2s ease-in-out infinite`}
              />
              <Box
                w={{ base: "100%", md: "120px" }}
                h="40px"
                bg="gray.700"
                borderRadius="md"
                animation={`${pulse} 1.2s ease-in-out infinite`}
              />
            </>
          ) : (
            <>
              <Button
                bg="red.400"
                color="white"
                _hover={{ bg: "red.500" }}
                onClick={() => applyFilters(selectedQuery ?? undefined)}
                size={{ base: "sm", md: "md" }}
                w={{ base: "100%", md: "auto" }}
              >
                Filter
              </Button>
              <Button
                bg="gray.700"
                color="white"
                _hover={{ bg: "gray.600" }}
                onClick={resetFilters}
                size={{ base: "sm", md: "md" }}
                w={{ base: "100%", md: "auto" }}
              >
                Reset
              </Button>
            </>
          )}
        </Stack>
      </VStack>
    </Box>
  );
};

export default FilterSection;
