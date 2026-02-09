"use client";

import React, { useEffect, useRef } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  chakra,
  Input,
  Stack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import useParts from "@/shared/stores/useParts";
import { fetchFilters } from "@/shared/api/filters";
import { useQuery } from "@tanstack/react-query";
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
    isInitializingFromURL,
    setSelectedYear,
    setSelectedStartYear,
    setSelectedEndYear,
    setSelectedMake,
    setSelectedModel,
    setSelectedCategory,
    setSelectedQuery,
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

  // years sorted high → low
  const yearsDesc = React.useMemo(
    () =>
      Array.isArray(filters?.years)
        ? [...filters.years]
            .map(Number)
            .filter((y) => !Number.isNaN(y))
            .sort((a, b) => b - a)
            .map(String)
        : [],
    [filters?.years]
  );

  const previousMakeRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !isInitializingFromURL &&
      previousMakeRef.current !== selectedMake &&
      previousMakeRef.current !== null
    ) {
      setSelectedModel(null);
    }
    previousMakeRef.current = selectedMake;
  }, [selectedMake, setSelectedModel, isInitializingFromURL]);

  const resetFilters = () => {
    setSelectedYear(null);
    setSelectedStartYear(null);
    setSelectedEndYear(null);
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedCategory(null);
    setSelectedQuery(null);
  };

  // Handle both button click and Enter key
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    
    // Apply the filters, pass the selected query and ensure year is excluded if not selected
    applyFilters(selectedQuery ?? undefined);
  };

  const pulse = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.55; }
    100% { opacity: 1; }
  `;

  return (
    <Box maxW="1400px" mx="auto">
      <VStack gap={6} align="start" bg="gray.900" p={6} borderRadius="md">
        <Text as="h2" fontSize="2xl" fontWeight="bold" color="red.400">
          Search parts based on car
        </Text>

        <chakra.form w="100%" onSubmit={handleSubmit}>
          {isLoading ? (
            <Stack direction={{ base: "column", md: "row" }} gap={4} w="full">
              {[0, 1, 2, 3].map((i) => (
                <Box
                  key={i}
                  flex="1"
                  h="56px"
                  bg="gray.700"
                  borderRadius="md"
                  animation={`${pulse} 1.2s ease-in-out infinite`}
                />
              ))}
            </Stack>
          ) : (
            <Stack
              direction={{ base: "column", md: "row" }}
              gap={4}
              w="full"
              flexWrap="wrap"
            >
              <Box flex="1" minW={{ base: "100%", md: "200px" }}>
                <Input
                  placeholder="Search parts..."
                  bg="gray.800"
                  color="gray.100"
                  h="56px"
                  value={selectedQuery ?? ""}
                  onChange={(e) => setSelectedQuery(e.target.value || null)}
                />
              </Box>

              <Box flex="1" minW={{ base: "100%", md: "200px" }}>
                <chakra.select
                  w="100%"
                  h="56px"
                  px={4}
                  borderRadius="md"
                  fontSize="md"
                  bg="gray.800"
                  color="gray.100"
                  value={selectedYear ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSelectedYear(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    );
                    setSelectedStartYear(null);
                    setSelectedEndYear(null);
                  }}
                >
                  <option value="">Select Year</option>
                  {yearsDesc.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </chakra.select>
              </Box>

              <Box flex="1" minW={{ base: "100%", md: "200px" }}>
                <chakra.select
                  w="100%"
                  h="56px"
                  px={4}
                  borderRadius="md"
                  fontSize="md"
                  bg="gray.800"
                  color="gray.100"
                  value={selectedMake ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedMake(e.target.value || null)
                  }
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

              <Box flex="1" minW={{ base: "100%", md: "200px" }}>
                <chakra.select
                  w="100%"
                  h="56px"
                  px={4}
                  borderRadius="md"
                  fontSize="md"
                  bg="gray.800"
                  color="gray.100"
                  value={selectedModel ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedModel(e.target.value || null)
                  }
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

              <Box flex="1" minW={{ base: "100%", md: "200px" }}>
                <chakra.select
                  w="100%"
                  h="56px"
                  px={4}
                  borderRadius="md"
                  fontSize="md"
                  bg="gray.800"
                  color="gray.100"
                  value={selectedCategory ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedCategory(e.target.value || null)
                  }
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
            mt={4}
          >
            {isLoading ? (
              <>
                <Box
                  flex="1"
                  h="40px"
                  bg="gray.700"
                  borderRadius="md"
                  animation={`${pulse} 1.2s ease-in-out infinite`}
                />
                <Box
                  flex="1"
                  h="40px"
                  bg="gray.700"
                  borderRadius="md"
                  animation={`${pulse} 1.2s ease-in-out infinite`}
                />
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  bg="red.400"
                  color="white"
                  _hover={{ bg: "red.500" }}
                  w={{ base: "100%", md: "auto" }}
                >
                  Filter
                </Button>
                <Button
                  type="button"
                  bg="gray.700"
                  color="white"
                  _hover={{ bg: "gray.600" }}
                  onClick={resetFilters}
                  w={{ base: "100%", md: "auto" }}
                >
                  Reset
                </Button>
              </>
            )}
          </Stack>
        </chakra.form>
      </VStack>
    </Box>
  );
};

export default FilterSection;
