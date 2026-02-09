// /root/s-twins/s-twins-web/src/components/Parts/PartsGrid.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, Box, Text, Button } from "@chakra-ui/react";
import ProductCard from "@/components/ProductCard";
import { keyframes } from "@emotion/react";
import useParts from "@/shared/stores/useParts";
import { VStack, Heading } from "@chakra-ui/react";

type PartsGridProps = {
  partsData: any;
  partsLoading: boolean;
  partsError: any;
  pageSize: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}) => {
  const generatePageNumbers = () => {
    const pages: Array<number | "ellipsis"> = [];
    const maxVisible = 10; // how many page numbers to show in a block

    // If total pages is small, show them all
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const showStartOnly = currentPage < maxVisible; // strict: if equal, shift window
    const showShiftedStart = currentPage === maxVisible; // clicked the last of the start block
    const showEndOnly = currentPage > totalPages - maxVisible;

    if (showStartOnly) {
      // Show beginning pages only, then ellipsis to indicate more pages
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
      pages.push("ellipsis");
      return pages;
    }

    if (showShiftedStart) {
      // When user clicks the last page of the initial block, shift the window forward
      const left = Math.max(1, currentPage - 1);
      for (let i = left; i < left + maxVisible; i++) {
        if (i <= totalPages) pages.push(i);
      }
      pages.push("ellipsis");
      return pages;
    }

    if (showEndOnly) {
      // Show ending pages only, preceded by ellipsis
      pages.push("ellipsis");
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++)
        pages.push(i);
      return pages;
    }

    // Middle: show ellipsis, a centered window around currentPage, then ellipsis
    pages.push("ellipsis");
    const half = Math.floor(maxVisible / 2);
    let left = Math.max(1, currentPage - half);
    let right = Math.min(totalPages, currentPage + (maxVisible - half - 1));

    // Adjust if window is smaller than maxVisible
    if (right - left + 1 < maxVisible) {
      if (left > 1) left = Math.max(1, right - maxVisible + 1);
      if (right < totalPages)
        right = Math.min(totalPages, left + maxVisible - 1);
    }

    for (let i = left; i <= right; i++) pages.push(i);
    pages.push("ellipsis");

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <Box
      display="flex"
      justifyContent="center"
      mt={8}
      flexDirection="column"
      gap={3}
    >
      {/* Mobile / small screens: compact controls */}
      <Box
        display={{ base: "flex", md: "none" }}
        justifyContent="center"
        gap={2}
      >
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          bg="red.500"
          color="white"
          size="sm"
          _hover={{ bg: "red.600" }}
          _disabled={{ bg: "gray.300", color: "gray.500" }}
        >
          Prev
        </Button>
        <Box alignSelf="center" color="gray.200">
          Page {currentPage} / {totalPages}
        </Box>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          bg="red.500"
          color="white"
          size="sm"
          _hover={{ bg: "red.600" }}
          _disabled={{ bg: "gray.300", color: "gray.500" }}
        >
          Next
        </Button>
      </Box>

      {/* Desktop / tablet: full pagination */}
      <Box display={{ base: "none", md: "flex" }} justifyContent="center">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          mr={4}
          bg="red.500"
          color="white"
          _hover={{ bg: "red.600" }}
          _disabled={{ bg: "gray.300", color: "gray.500" }}
        >
          Previous
        </Button>
        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <Box
              key={`ellipsis-${idx}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx={1}
              color="gray.400"
            >
              ...
            </Box>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page as number)}
              variant={page === currentPage ? "solid" : "outline"}
              bg={page === currentPage ? "red.500" : "white"}
              color={page === currentPage ? "white" : "red.500"}
              borderColor="red.500"
              mx={1}
              _hover={{ bg: page === currentPage ? "red.600" : "red.50" }}
            >
              {page}
            </Button>
          )
        )}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          ml={4}
          bg="red.500"
          color="white"
          _hover={{ bg: "red.600" }}
          _disabled={{ bg: "gray.300", color: "gray.500" }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

const PartsGrid = ({
  partsData,
  partsLoading,
  partsError,
  pageSize,
  currentPage,
  onPageChange,
}: PartsGridProps & { totalPages: number }) => {
  if (partsLoading) {
    const pulse = keyframes`
      0% { opacity: 1; }
      50% { opacity: 0.55; }
      100% { opacity: 1; }
    `;
    return (
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
      >
        {[...Array(pageSize)].map((_, idx) => (
          <Box
            key={idx}
            bg="gray.800"
            borderRadius="xl"
            boxShadow="dark-lg"
            borderColor="gray.700"
            overflow="hidden"
            p={6}
          >
            <Box bg="gray.700" h="220px" mb={4} borderRadius="md">
              <Box
                w="full"
                h="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  w="80%"
                  h="80%"
                  bg="gray.600"
                  borderRadius="md"
                  animation={`${pulse} 1.2s ease-in-out infinite`}
                />
              </Box>
            </Box>
            <Box mb={2}>
              <Box
                h="20px"
                bg="gray.600"
                borderRadius="md"
                mb={2}
                animation={`${pulse} 1.2s ease-in-out infinite`}
              />
              <Box
                h="16px"
                bg="gray.600"
                borderRadius="md"
                mb={1}
                animation={`${pulse} 1.2s ease-in-out infinite`}
              />
              <Box
                h="16px"
                bg="gray.600"
                borderRadius="md"
                mb={4}
                animation={`${pulse} 1.2s ease-in-out infinite`}
              />
            </Box>
            <Box mb={4}>
              <Box
                h="24px"
                w="40%"
                bg="gray.600"
                borderRadius="md"
                display="inline-block"
                animation={`${pulse} 1.2s ease-in-out infinite`}
              />
              <Box
                h="24px"
                w="40%"
                bg="gray.600"
                borderRadius="md"
                display="inline-block"
                ml={2}
                animation={`${pulse} 1.2s ease-in-out infinite`}
              />
            </Box>
            <Box borderTop="1px solid" borderColor="gray.200" pt={4}>
              <Box
                h="16px"
                bg="gray.600"
                borderRadius="md"
                animation={`${pulse} 1.2s ease-in-out infinite`}
              />
            </Box>
          </Box>
        ))}
      </Grid>
    );
  }

  if (partsError) {
    return <Text color="red.300">Error loading parts</Text>;
  }
  // Empty state handling
  const {
    selectedYear,
    selectedMake,
    selectedModel,
    selectedCategory,
    selectedQuery,
  } = useParts.getState();

  const filtersApplied = !!(
    selectedYear ||
    selectedMake ||
    selectedModel ||
    selectedCategory ||
    selectedQuery
  );

  const partsList = partsData?.cars ?? [];

  if (!partsList || partsList.length === 0) {
    const clearFilters = () => {
      window.location.assign("/parts");
    };

    return (
      <VStack gap={6} align="center">
        <Heading size="md" color="gray.200">
          {filtersApplied
            ? "No parts found for your selected filters"
            : "No parts available"}
        </Heading>
        {filtersApplied && (
          <Text color="gray.400" maxW="720px" textAlign="center">
            It looks like there are no parts that match the filters you
            selected. Try adjusting or clearing filters to see more results.
          </Text>
        )}
        {!filtersApplied && (
          <Text color="gray.400" maxW="720px" textAlign="center">
            We could not find any parts. Try a different search or check back
            later.
          </Text>
        )}
        <Button bg="red.400" color="white" onClick={clearFilters}>
          Clear filters
        </Button>
      </VStack>
    );
  }

  return (
    <>
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={{ base: 4, md: 6 }}
      >
        {partsList.map((part: any) => (
          <ProductCard key={part.id} part={part} />
        ))}
      </Grid>
      <Pagination
        currentPage={currentPage}
        totalPages={partsData?.pagination.totalPages || 1}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default PartsGrid;
