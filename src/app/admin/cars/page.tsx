"use client";

import {
  Box,
  Text,
  Button,
  VStack,
  Flex,
  Input,
  Badge,
  SimpleGrid,
  Spinner,
  AlertRoot,
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaEye } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminCarsAPI,
  CreateCarRequest,
  UpdateCarRequest,
} from "../../../lib/api/admin-cars";
import { fetchFilters } from "../../../shared/api/filters";
import { fetchMakes } from "../../../shared/api/collections";
import { useUploadImage } from "../../../shared/hooks/useUploads";
import { toast } from "sonner";
import Image from "next/image";

interface Car {
  cid: number;
  ID: number;
  name: string;
  make: string;
  prod_cat: string;
  year: number;
  model_id: number;
  model: string;
  tag?: string;
  stockNo?: string;
  date_added: Date | string;
  thumbnailId?: string;
  galleryIds?: string[];
}

// Placeholder images for cars (since API doesn't provide images)
const placeholderImages = [
  "tiguan.jpg",
  "amarok.jpg",
  "jaguar.jpg",
  "mustang.jpg",
  "chrysler.jpg",
  "wrangler.jpg",
];

// Convert category codes to human readable format
const formatCategoryName = (category: string) => {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Convert make names to proper case
const formatMakeName = (make: string) => {
  return make
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function CarsManagement() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const queryClient = useQueryClient();
  const uploadImageMutation = useUploadImage();

  // Custom hook for creating cars
  const createCarMutation = useMutation({
    mutationFn: (carData: CreateCarRequest) => adminCarsAPI.createCar(carData),
    onSuccess: () => {
      // Invalidate the specific query used by the cars list
      queryClient.invalidateQueries({
        queryKey: ["admin-cars", page, pageSize, searchQuery],
      });
      // Also invalidate broader admin-cars queries to be safe
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      toast.success("Car created successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to create car:", error);
      toast.error("Failed to create car");
    },
  });

  // Custom hook for updating cars
  const updateCarMutation = useMutation({
    mutationFn: ({ id, carData }: { id: number; carData: UpdateCarRequest }) =>
      adminCarsAPI.updateCar(id, carData),
    onSuccess: () => {
      // Invalidate the specific query used by the cars list
      queryClient.invalidateQueries({
        queryKey: ["admin-cars", page, pageSize, searchQuery],
      });
      // Also invalidate broader admin-cars queries to be safe
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      toast.success("Car updated successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to update car:", error);
      toast.error("Failed to update car");
    },
  });

  // Custom hook for deleting cars
  const deleteCarMutation = useMutation({
    mutationFn: (id: number) => adminCarsAPI.deleteCar(id),
    onSuccess: () => {
      // Invalidate the specific query used by the cars list
      queryClient.invalidateQueries({
        queryKey: ["admin-cars", page, pageSize, searchQuery],
      });
      // Also invalidate broader admin-cars queries to be safe
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      toast.success("Car deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to delete car:", error);
      toast.error("Failed to delete car");
    },
  });

  // Fetch cars from API using Next.js API routes
  const {
    data: carsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-cars", page, pageSize, searchQuery],
    queryFn: () =>
      adminCarsAPI.getCars({
        page,
        pageSize,
        q: searchQuery || undefined,
      }),
    staleTime: 0, // Always consider data stale
  });

  // Fetch filter data for dropdowns
  const { data: filtersData } = useQuery({
    queryKey: ["filters"],
    queryFn: fetchFilters,
  });

  const { data: makesData } = useQuery({
    queryKey: ["makes"],
    queryFn: fetchMakes,
  });

  // Extract data with fallbacks
  const categories =
    filtersData?.categories?.filter((cat: string) => cat.trim() !== "") || [];
  const makes =
    makesData
      ?.map((make: { make: string }) => make.make)
      ?.filter((make: string) => make.trim() !== "") || [];
  const years =
    filtersData?.years?.filter(
      (year: string) => year.trim() !== "" && year !== "1900"
    ) || [];

  const cars: Car[] = carsData?.cars || [];
  const totalCars = carsData?.pagination?.total || 0;
  const totalPages = carsData?.pagination?.totalPages || 0;
  const hasNextPage = carsData?.pagination?.hasNextPage || false;
  const hasPrevPage = carsData?.pagination?.hasPrevPage || false;

  const [formData, setFormData] = useState({
    name: "",
    make: "",
    prod_cat: "",
    year: "",
    model_id: "",
    model: "",
    tag: "",
    stockNo: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Gallery state
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Check authentication
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview("");
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Add new files to existing ones
      const newFiles = [...selectedGalleryFiles, ...files];
      setSelectedGalleryFiles(newFiles);

      // Create preview URLs for new files
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleryPreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    const previewToRemove = galleryPreviews[index];

    // If it's a new upload (blob URL), also remove from selectedGalleryFiles
    if (previewToRemove && previewToRemove.startsWith("blob:")) {
      setSelectedGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    }

    // Always remove from previews
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let thumbnailId = "";
    let galleryIds: string[] = [];

    // Upload main image if a new file is selected
    if (selectedFile) {
      try {
        const uploadResult = await uploadImageMutation.mutateAsync(
          selectedFile
        );
        // Use the uploaded image URL directly
        thumbnailId = uploadResult.data.url;
      } catch (error) {
        console.error("Failed to upload main image:", error);
        toast.error("Failed to upload main image. Please try again.");
        return;
      }
    }

    // Upload gallery images if any are selected
    if (selectedGalleryFiles.length > 0) {
      try {
        const galleryUploadPromises = selectedGalleryFiles.map((file) =>
          uploadImageMutation.mutateAsync(file)
        );

        const galleryResults = await Promise.all(galleryUploadPromises);
        galleryIds = galleryResults.map((result) => result.data.url);
      } catch (error) {
        console.error("Failed to upload gallery images:", error);
        toast.error("Failed to upload gallery images. Please try again.");
        return;
      }
    }

    if (editingCar) {
      // Update existing car
      const updateData: UpdateCarRequest = {};

      // Only include fields that have changed or are being set
      if (formData.name) updateData.name = formData.name;
      if (formData.make) updateData.make = formData.make;
      if (formData.prod_cat) updateData.prod_cat = formData.prod_cat;
      if (formData.year)
        updateData.year = parseInt(formData.year) || new Date().getFullYear();
      if (formData.model_id)
        updateData.model_id = parseInt(formData.model_id) || 0;
      if (formData.model) updateData.model = formData.model;
      if (formData.tag !== undefined)
        updateData.tag = formData.tag || undefined;
      if (formData.stockNo !== undefined)
        updateData.stockNo = formData.stockNo || undefined;

      // Handle image updates
      if (selectedFile) {
        // New image was uploaded
        updateData.thumbnailId = thumbnailId;
      } else if (imagePreview && imagePreview.startsWith("http")) {
        // Keep existing image
        updateData.thumbnailId = imagePreview;
      } else if (imagePreview === "") {
        // Image was removed
        updateData.thumbnailId = undefined;
      }

      // Handle gallery updates
      if (selectedGalleryFiles.length > 0) {
        // New gallery images were uploaded
        const existingGalleryImages = galleryPreviews.filter(
          (preview) =>
            preview.startsWith("http") && !galleryIds.includes(preview)
        );
        updateData.galleryIds = [...existingGalleryImages, ...galleryIds];
      } else if (galleryPreviews.length > 0) {
        // Keep existing gallery images
        const existingGalleryImages = galleryPreviews.filter((preview) =>
          preview.startsWith("http")
        );
        updateData.galleryIds = existingGalleryImages;
      } else {
        // All gallery images were removed
        updateData.galleryIds = [];
      }

      updateCarMutation.mutate(
        {
          id: editingCar.cid,
          carData: updateData,
        },
        {
          onSuccess: () => {
            handleFormReset();
          },
        }
      );
    } else {
      // Create new car
      createCarMutation.mutate(
        {
          name: formData.name,
          make: formData.make,
          prod_cat: formData.prod_cat,
          year: parseInt(formData.year) || new Date().getFullYear(),
          model_id: parseInt(formData.model_id) || 0,
          model: formData.model,
          tag: formData.tag || undefined,
          stockNo: formData.stockNo || undefined,
          thumbnailId: thumbnailId || undefined,
          galleryIds: galleryIds.length > 0 ? galleryIds : undefined,
        },
        {
          onSuccess: () => {
            handleFormReset();
          },
        }
      );
    }
  };

  const handleFormReset = () => {
    setFormData({
      name: "",
      make: "",
      prod_cat: "",
      year: "",
      model_id: "",
      model: "",
      tag: "",
      stockNo: "",
    });
    setSelectedFile(null);
    setImagePreview("");
    setSelectedGalleryFiles([]);
    setGalleryPreviews([]);
    setShowForm(false);
    setEditingCar(null);
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      make: car.make,
      prod_cat: car.prod_cat,
      year: car.year.toString(),
      model_id: car.model_id?.toString() || "",
      model: car.model || "",
      tag: car.tag || "",
      stockNo: car.stockNo || "",
    });

    // Set image data for editing
    setSelectedFile(null);
    setImagePreview(car.thumbnailId || "");
    setSelectedGalleryFiles([]);

    // Set gallery previews from existing URLs
    if (car.galleryIds && car.galleryIds.length > 0) {
      setGalleryPreviews(car.galleryIds);
    } else {
      setGalleryPreviews([]);
    }

    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      deleteCarMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingCar(null);
    handleFormReset();
    setShowForm(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="sm" px={8} py={4}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={4}>
            <Button onClick={() => router.push("/admin")} variant="ghost">
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Back
            </Button>
            <Text fontSize="2xl" fontWeight="bold" color="#d80c19">
              Cars Management
            </Text>
          </Flex>
          <Button colorScheme="red" onClick={handleAddNew}>
            <FaPlus style={{ marginRight: "8px" }} />
            Add New Car
          </Button>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={8}>
        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mb={8}>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {totalCars}
            </Text>
            <Text color="blue.600">Total Cars</Text>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              {cars.length}
            </Text>
            <Text color="green.600">This Page</Text>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
              {totalPages}
            </Text>
            <Text color="purple.600">Total Pages</Text>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="orange.600">
              {page}
            </Text>
            <Text color="orange.600">Current Page</Text>
          </Box>
        </SimpleGrid>

        {/* Search and Filters */}
        <Box bg="white" borderRadius="lg" shadow="sm" p={6} mb={6}>
          <form onSubmit={handleSearch}>
            <Flex gap={4} align="end">
              <Box flex="1">
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Search Cars
                </Text>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by make, model, or any other field..."
                />
              </Box>
              <Button type="submit" colorScheme="red">
                Search
              </Button>
            </Flex>
          </form>
        </Box>

        {/* Cars List */}
        <Box bg="white" borderRadius="lg" shadow="sm" p={6}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Cars Inventory
            </Text>
            <Flex align="center" gap={4}>
              <Text fontSize="sm" color="gray.600">
                Showing {cars.length} of {totalCars} cars
              </Text>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => refetch()}
                loading={isLoading}
              >
                Refresh
              </Button>
            </Flex>
          </Flex>

          {error && (
            <AlertRoot status="error" mb={4}>
              Failed to load cars. Please try again.
            </AlertRoot>
          )}

          {isLoading ? (
            <Flex justify="center" py={8}>
              <Spinner size="lg" color="red.500" />
            </Flex>
          ) : cars.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No cars found.{" "}
              {searchQuery
                ? "Try adjusting your search criteria."
                : "No cars available in the system."}
            </Text>
          ) : (
            <>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {cars.map((car, index) => (
                  <Box
                    key={car.cid || car.ID}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    overflow="hidden"
                    bg="white"
                    shadow="sm"
                    _hover={{ shadow: "md" }}
                    transition="shadow 0.2s"
                  >
                    {/* Car Image */}
                    <Box position="relative" h="200px" bg="gray.100">
                      <Image
                        src={`/images/${
                          placeholderImages[index % placeholderImages.length]
                        }`}
                        alt={`${car.year} ${car.make} ${car.model || ""}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>

                    {/* Car Info */}
                    <Box p={4}>
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color="gray.800"
                        mb={2}
                      >
                        {car.year} {car.make} {car.model || ""}
                      </Text>

                      <Text fontSize="sm" color="gray.600" mb={3}>
                        {car.name}
                      </Text>

                      <VStack align="start" gap={2} mb={4}>
                        <Flex gap={2} fontSize="sm">
                          <Text fontWeight="medium">Category:</Text>
                          <Badge colorScheme="blue" variant="subtle">
                            {car.prod_cat || "N/A"}
                          </Badge>
                        </Flex>

                        {car.stockNo && (
                          <Flex gap={2} fontSize="sm">
                            <Text fontWeight="medium">Stock #:</Text>
                            <Text color="gray.600">{car.stockNo}</Text>
                          </Flex>
                        )}

                        {car.tag && (
                          <Flex gap={2} fontSize="sm">
                            <Text fontWeight="medium">Tag:</Text>
                            <Badge colorScheme="green" variant="subtle">
                              {car.tag}
                            </Badge>
                          </Flex>
                        )}

                        <Flex gap={2} fontSize="sm">
                          <Text fontWeight="medium">Added:</Text>
                          <Text color="gray.600">
                            {formatDate(
                              typeof car.date_added === "string"
                                ? car.date_added
                                : undefined
                            )}
                          </Text>
                        </Flex>
                      </VStack>

                      <Flex gap={2} justify="flex-end">
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() =>
                            router.push(`/cars/${car.cid || car.ID}`)
                          }
                        >
                          <FaEye style={{ marginRight: "4px" }} />
                          View
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleEdit(car)}
                        >
                          <FaEdit style={{ marginRight: "4px" }} />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(car.cid || car.ID)}
                        >
                          <FaTrash style={{ marginRight: "4px" }} />
                          Delete
                        </Button>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box mt={6}>
                  <Flex justify="center" align="center" gap={4} mb={4}>
                    <Text fontSize="sm" color="gray.600">
                      Page {page} of {totalPages}
                    </Text>
                  </Flex>
                  <Flex justify="center" gap={2}>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={!hasPrevPage}
                      variant="outline"
                    >
                      Previous
                    </Button>

                    <Flex gap={1}>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                          return (
                            <Button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              colorScheme={page === pageNum ? "red" : "gray"}
                              variant={page === pageNum ? "solid" : "outline"}
                              size="sm"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </Flex>

                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!hasNextPage}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </Flex>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
        >
          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            shadow="xl"
            w="full"
            maxW="700px"
            maxH="90vh"
            overflowY="auto"
          >
            <Text fontSize="xl" fontWeight="bold" mb={6} color="gray.800">
              {editingCar ? "Edit Car" : "Add New Car"}
            </Text>

            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Car Name *
                  </Text>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter car name"
                    required
                  />
                </Box>

                <Flex gap={4}>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Make *
                    </Text>
                    <select
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        backgroundColor: "white",
                      }}
                      required
                    >
                      <option value="">Select make</option>
                      {makes.map((make: string) => (
                        <option key={make} value={make}>
                          {formatMakeName(make)}
                        </option>
                      ))}
                    </select>
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Category *
                    </Text>
                    <select
                      name="prod_cat"
                      value={formData.prod_cat}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        backgroundColor: "white",
                      }}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat: string) => (
                        <option key={cat} value={cat}>
                          {formatCategoryName(cat)}
                        </option>
                      ))}
                    </select>
                  </Box>
                </Flex>

                <Flex gap={4}>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Year *
                    </Text>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        backgroundColor: "white",
                      }}
                      required
                    >
                      <option value="">Select year</option>
                      {years.map((year: string) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Model ID *
                    </Text>
                    <Input
                      name="model_id"
                      type="number"
                      value={formData.model_id}
                      onChange={handleInputChange}
                      placeholder="Enter model ID"
                      min={0}
                      required
                    />
                  </Box>
                </Flex>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Model *
                  </Text>
                  <Input
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Enter model name"
                    required
                  />
                </Box>

                <Flex gap={4}>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Tag
                    </Text>
                    <Input
                      name="tag"
                      value={formData.tag}
                      onChange={handleInputChange}
                      placeholder="Enter tag"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Stock Number
                    </Text>
                    <Input
                      name="stockNo"
                      value={formData.stockNo}
                      onChange={handleInputChange}
                      placeholder="Enter stock number"
                    />
                  </Box>
                </Flex>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Car Image
                  </Text>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    placeholder="Select image file"
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                    }}
                  />
                  {imagePreview && (
                    <Box mt={3}>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Image Preview:
                      </Text>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={200}
                        height={150}
                        style={{
                          maxWidth: "200px",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Gallery Images
                  </Text>
                  <Text fontSize="xs" color="gray.600" mb={2}>
                    Add multiple images to showcase different angles and details
                  </Text>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFileChange}
                    placeholder="Select gallery images"
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                    }}
                  />
                  {galleryPreviews.length > 0 && (
                    <Box mt={3}>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Gallery Preview ({galleryPreviews.length} images):
                      </Text>
                      <Flex gap={3} wrap="wrap">
                        {galleryPreviews.map((preview, index) => (
                          <Box
                            key={index}
                            position="relative"
                            border="1px solid #e2e8f0"
                            borderRadius="6px"
                            overflow="hidden"
                          >
                            <Image
                              src={preview}
                              alt={`Gallery preview ${index + 1}`}
                              width={120}
                              height={90}
                              style={{
                                width: "120px",
                                height: "90px",
                                objectFit: "cover",
                              }}
                            />
                            <Button
                              position="absolute"
                              top="2"
                              right="2"
                              size="xs"
                              colorScheme="red"
                              borderRadius="full"
                              onClick={() => removeGalleryImage(index)}
                              style={{
                                minWidth: "24px",
                                height: "24px",
                                fontSize: "12px",
                              }}
                            >
                              ×
                            </Button>
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  )}
                </Box>

                <Flex gap={4} justify="flex-end" mt={6}>
                  <Button variant="ghost" onClick={handleFormReset}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="red"
                    loading={
                      createCarMutation.isPending ||
                      updateCarMutation.isPending ||
                      uploadImageMutation.isPending
                    }
                    loadingText={
                      uploadImageMutation.isPending
                        ? "Uploading images..."
                        : editingCar
                        ? "Updating..."
                        : "Saving..."
                    }
                  >
                    {editingCar ? "Update Car" : "Add Car"}
                  </Button>
                </Flex>
              </VStack>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
}
