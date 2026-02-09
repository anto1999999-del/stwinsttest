/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, Box, Text, Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import ProductCard from "../../../components/ProductCard";

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
    const pages = [];
    const maxVisiblePages = 5;

    // Add current page and next few pages
    for (
      let i = currentPage;
      i < Math.min(currentPage + maxVisiblePages, totalPages + 1);
      i++
    ) {
      pages.push(i);
    }

    // Add last few pages
    for (
      let i = Math.max(
        totalPages - maxVisiblePages + 1,
        currentPage + maxVisiblePages
      );
      i <= totalPages;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <Box display="flex" justifyContent="center" mt={8}>
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
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? "solid" : "outline"}
          bg={page === currentPage ? "red.500" : "white"}
          color={page === currentPage ? "white" : "red.500"}
          borderColor="red.500"
          mx={1}
          _hover={{ bg: page === currentPage ? "red.600" : "red.50" }}
        >
          {page}
        </Button>
      ))}
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
  // Avoid rendering Chakra components during server-side prerender to prevent missing ChakraProvider
  if (typeof window === "undefined") return null;
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
                >
                  {/* Image skeleton */}
                </Box>
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

  return (
    <>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
      >
        {partsData?.cars.map((part: any) => (
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
