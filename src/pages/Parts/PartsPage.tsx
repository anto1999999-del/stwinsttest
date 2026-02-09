"use client";

import { Box } from "@chakra-ui/react";
import QuoteRequest from "../../components/QuoteRequest";
import Footer from "../../components/Footer";

import { usePartsQuery } from "@/shared/stores/usePartsQuery";
import { useState, useEffect } from "react";
import PartGrid from "@/components/Parts/PartsGrid";
import FilterSection from "@/components/Parts/FilterSection";
import useParts from "@/shared/stores/useParts";
import { useRouter } from "next/navigation";

type PartsDataShape = {
  pagination?: { totalPages?: number };
  cars?: unknown[];
};

const PartsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const pageSize = 20;

  const {
    data: partsData,
    isLoading: partsLoading,
    error: partsError,
  } = usePartsQuery({
    ...filters,
    page,
    pageSize,
  });

  const applyFilters = (q?: string) => {
    setPage(1);
    const {
      selectedYear,
      selectedStartYear,
      selectedEndYear,
      selectedMake,
      selectedModel,
      selectedCategory,
    } = useParts.getState();

    setFilters({
      year: selectedYear ? selectedYear.toString() : undefined,
      startYear: selectedStartYear ? selectedStartYear.toString() : undefined,
      endYear: selectedEndYear ? selectedEndYear.toString() : undefined,
      make: selectedMake || undefined,
      model: selectedModel || undefined,
      category: selectedCategory || undefined,
      q: q ?? (useParts.getState().selectedQuery || undefined),
    });

    const params = new URLSearchParams();
    if (selectedYear) params.set("year", String(selectedYear));
    if (selectedStartYear) params.set("startYear", String(selectedStartYear));
    if (selectedEndYear) params.set("endYear", String(selectedEndYear));
    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);
    if (selectedCategory) params.set("category", selectedCategory);
    if (q) params.set("q", q);
    params.set("page", "1");

    if (typeof window !== "undefined" && router && typeof router.push === "function") {
      router.push(`/parts?${params.toString()}`);
    } else if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/parts?${params.toString()}`);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = new URLSearchParams(window.location.search);
    const year = search.get("year");
    const startYear = search.get("startYear");
    const endYear = search.get("endYear");
    const make = search.get("make");
    const model = search.get("model");
    const category = search.get("category");
    const pageParam = search.get("page");

    const state = useParts.getState();

    state.setIsInitializingFromURL(true);

    state.setSelectedYear(null);
    state.setSelectedStartYear(null);
    state.setSelectedEndYear(null);
    state.setSelectedMake(null);
    state.setSelectedModel(null);
    state.setSelectedCategory(null);
    state.setSelectedQuery(null);

    if (year) state.setSelectedYear(parseInt(year, 10));
    if (startYear) state.setSelectedStartYear(parseInt(startYear, 10));
    if (endYear) state.setSelectedEndYear(parseInt(endYear, 10));
    if (category) state.setSelectedCategory(category);
    const q = search.get("q");
    if (q) state.setSelectedQuery(q);
    if (pageParam) setPage(parseInt(pageParam, 10));

    if (make) state.setSelectedMake(make.toUpperCase());
    if (model) state.setSelectedModel(model.toUpperCase());

    setTimeout(() => {
      state.setIsInitializingFromURL(false);
    }, 500);

    setFilters({
      year: year ?? undefined,
      make: make ? make.toUpperCase() : undefined,
      model: model ? model.toUpperCase() : undefined,
      category: category ?? undefined,
      q: q ?? undefined,
    });
  }, []);

  // ---- Safe access for TS ----
  const safe = (partsData as PartsDataShape | undefined);
  const totalPages = safe?.pagination?.totalPages ?? 1;

  return (
    <>
      <Box as="section" bg="gray.900" py={8} px={{ base: 6, md: 12, lg: 16 }}>
        <Box maxW="1400px" mx="auto" mb={6}>
          <Text as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color="white" mb={4}>
            Car Parts
          </Text>
        </Box>
        <FilterSection applyFilters={applyFilters} />
      </Box>
      <Box as="section" bg="gray.900" py={16}>
        <Box maxW="1400px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
          <PartGrid
            partsData={partsData || null}
            partsLoading={partsLoading}
            partsError={!!partsError}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            totalPages={totalPages}
          />
        </Box>
      </Box>

      {/* Quote Request Section */}
      <Box bg="red.50">
        <QuoteRequest />
      </Box>

      {/* Footer */}
      <Box bg="white">
        <Footer />
      </Box>
    </>
  );
};

export default PartsPage;
