"use client";

import {
  Box,
  Text,
  Button,
  VStack,
  Flex,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

import {
  useWpPostsWithImages,
  useUpdateWpPost,
  useDeleteWpPost,
} from "../../../shared/hooks/useWpPosts";
import { usePartsQuery } from "../../../shared/stores/usePartsQuery";
import { partsAPI, CreatePartRequest } from "../../../lib/api/parts";
import { useUploadImage } from "../../../shared/hooks/useUploads";
import { fetchFilters } from "../../../shared/api/filters";
import { fetchMakes, fetchModels } from "../../../shared/api/collections";

interface Part {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  partNumber: string;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  inventoryId?: string;
}

/** API response shape for parts list */
type PartsListResponse = {
  cars: Array<{
    id: string;
    title: string;
    price: string;
    year: string;
    model: string | null;
    stock: string;
    description: string;
    image: string;
    inventoryId?: string;
  }>;
  pagination?: {
    count: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

// Convert category codes to human readable format
const formatCategoryName = (category: string) =>
  category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

// Convert make names to proper case
const formatMakeName = (make: string) =>
  make
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export default function PartsManagement() {
  const router = useRouter();
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Create part
  const createPartMutation = useMutation({
    mutationFn: (partData: CreatePartRequest) => partsAPI.createPart(partData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "wp-posts",
          "list",
          {
            post_type: "product",
            includeMeta: true,
            page,
            pageSize,
            q: searchQuery || undefined,
          },
          "with-images",
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["wp-posts"] });
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part created successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to create part:", error);
      toast.error("Failed to create part");
    },
  });

  // Parts list (same endpoint as public page)
  const {
    data: partsHookData,
    isLoading,
    error,
    refetch,
  } = usePartsQuery({
    page,
    pageSize,
    q: searchQuery || undefined,
  }) as {
    data?: PartsListResponse;
    isLoading: boolean;
    error: unknown;
    refetch: () => void;
  };

  // WP posts hook for editing extras
  const { data: postsData } = useWpPostsWithImages({
    post_type: "product",
    post_status: "publish",
    includeMeta: true,
    page,
    pageSize,
    q: searchQuery || undefined,
  });

  const updatePostMutation = useUpdateWpPost();
  const deletePostMutation = useDeleteWpPost();
  const uploadImageMutation = useUploadImage();

  // Filters
  const { data: filtersData } = useQuery({
    queryKey: ["filters"],
    queryFn: fetchFilters,
  });
  const { data: makesData } = useQuery({
    queryKey: ["makes"],
    queryFn: fetchMakes,
  });

  // Extract data with fallbacks
  const categories = useMemo(
    () =>
      filtersData?.categories?.filter((cat: string) => cat.trim() !== "") || [],
    [filtersData?.categories]
  );
  const makes =
    makesData
      ?.map((make: { make: string }) => make.make)
      ?.filter((make: string) => make.trim() !== "") || [];
  const years =
    filtersData?.years?.filter(
      (year: string) => year.trim() !== "" && year !== "1900"
    ) || [];

  // SAFELY read the parts list (prevents TS error + build failure)
  const carsList = Array.isArray(partsHookData?.cars) ? partsHookData!.cars : [];

  const parts =
    carsList.map((part) => ({
      id: part.id,
      name: part.title,
      title: part.title,
      price: parseFloat(part.price) || 0,
      year: part.year,
      model: part.model || "Unknown",
      stock: parseInt(part.stock) || 0,
      description: part.description || "",
      image: part.image || "",
      inventoryId: part.inventoryId || "",
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      brand: "Unknown",
      category: part.model || "Unknown",
      partNumber: part.inventoryId || "",
      status: "active" as const,
      createdAt: new Date().toISOString(),
    })) || [];

  const totalParts = partsHookData?.pagination?.count || 0;
  const totalPages = partsHookData?.pagination?.totalPages || 0;
  const hasNextPage = partsHookData?.pagination?.hasNextPage || false;
  const hasPrevPage = partsHookData?.pagination?.hasPrevPage || false;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    make: "",
    model: "",
    category: "",
    manufacturer: "",
    price: "",
    stock: "",
    year: "",
    startYear: "",
    endYear: "",
    sku: "",
    tag: "",
    odo: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    icdesc: "",
    inventoryId: "",
    post_status: "publish" as "publish" | "draft" | "private",
  });

  const { data: modelsData } = useQuery({
    queryKey: ["models", formData.make],
    queryFn: () => fetchModels(formData.make),
    enabled: !!formData.make,
  });

  const models =
    modelsData
      ?.map((model: { model: string }) => model.model)
      ?.filter((model: string) => model.trim() !== "") || [];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Gallery state
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Keep category/model in sync when editing
  useEffect(() => {
    if (editingPart && categories.length > 0 && postsData?.posts) {
      const originalPost = postsData.posts.find(
        (post) => post.ID === editingPart.id
      );
      const meta = originalPost?.meta || {};
      const categoryValue = meta.itemTypeCode || meta.model || "";

      if (categoryValue && categoryValue !== formData.model) {
        setFormData((prev) => ({
          ...prev,
          model: categoryValue,
        }));
      }
    }
  }, [editingPart, categories, postsData?.posts, formData.model]);

  // Pagination and search handlers
  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  // Auth check
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  // Clear model when make changes (if not editing)
  useEffect(() => {
    if (formData.make && !editingPart) {
      setFormData((prev) => ({ ...prev, model: "" }));
    }
  }, [formData.make, editingPart]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview("");
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...selectedGalleryFiles, ...files];
      setSelectedGalleryFiles(newFiles);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) =>
          setGalleryPreviews((prev) => [...prev, ev.target?.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    const previewToRemove = galleryPreviews[index];
    if (previewToRemove && previewToRemove.startsWith("blob:")) {
      setSelectedGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    }
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let thumbnailId = "";
    let galleryIds: string[] = [];

    // Upload main image if a new file is selected
    if (selectedFile) {
      try {
        const uploadResult = await uploadImageMutation.mutateAsync(selectedFile);
        thumbnailId = uploadResult.data.url;
      } catch (error) {
        console.error("Failed to upload main image:", error);
        toast.error("Failed to upload main image. Please try again.");
        return;
      }
    } else if (editingPart && imagePreview && !selectedFile) {
      if (!imagePreview.startsWith("http")) {
        thumbnailId = imagePreview;
      }
    }

    // Upload gallery images if any
    if (selectedGalleryFiles.length > 0) {
      try {
        const galleryUploadPromises = selectedGalleryFiles.map((file) =>
          uploadImageMutation.mutateAsync(file)
        );
        const galleryResults = await Promise.all(galleryUploadPromises);
        const newGalleryUrls = galleryResults.map((r) => r.data.url);
        const existingGalleryUrls = galleryPreviews.filter((p) =>
          p.startsWith("http")
        );
        galleryIds = [...existingGalleryUrls, ...newGalleryUrls];
      } catch (error) {
        console.error("Failed to upload gallery images:", error);
        toast.error("Failed to upload gallery images. Please try again.");
        return;
      }
    } else if (editingPart && galleryPreviews.length > 0) {
      galleryIds = galleryPreviews.filter((p) => p.startsWith("http"));
    }

    if (editingPart) {
      const updatePayload: Record<string, unknown> = {
        post_title: formData.title,
        post_content: formData.description,
        post_status: formData.post_status,
        post_type: "product",
      };

      if (formData.price) updatePayload.price = formData.price;
      if (formData.year) updatePayload.year = formData.year;
      if (formData.startYear) updatePayload.startYear = formData.startYear;
      if (formData.endYear) updatePayload.endYear = formData.endYear;
      if (formData.stock) updatePayload.stock = formData.stock;
      if (formData.tag) updatePayload.tag = formData.tag;
      if (formData.odo) updatePayload.odo = formData.odo;
      if (formData.make) updatePayload.make = formData.make;
      if (formData.model) updatePayload.model = formData.model;
      if (formData.category) updatePayload.category = formData.category;
      if (formData.manufacturer)
        updatePayload.manufacturer = formData.manufacturer;
      if (formData.icdesc) updatePayload.icdesc = formData.icdesc;
      if (formData.weight) updatePayload.weight = formData.weight;
      if (formData.length) updatePayload.length = formData.length;
      if (formData.width) updatePayload.width = formData.width;
      if (formData.height) updatePayload.height = formData.height;
      if (formData.sku) updatePayload.sku = formData.sku;
      if (formData.model) updatePayload.model = formData.model;
      if (thumbnailId) updatePayload.thumb = thumbnailId;
      if (galleryIds.length > 0)
        updatePayload.gallery_ids = galleryIds.join(",");

      updatePostMutation.mutate(
        { id: editingPart.id, payload: updatePayload },
        {
          onSuccess: () => {
            queryClient.clear();
            queryClient.invalidateQueries({ queryKey: ["parts"] });
            handleFormReset();
            setTimeout(() => refetch(), 200);
          },
        }
      );
    } else {
      // Create new part
      createPartMutation.mutate(
        {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          year: formData.year,
          startYear: formData.startYear,
          endYear: formData.endYear,
          make: formData.make,
          model: formData.model,
          category: formData.category,
          manufacturer: formData.manufacturer,
          stock: formData.stock,
          tag: formData.tag,
          odo: formData.odo,
          weight: parseFloat(formData.weight) || undefined,
          length: parseFloat(formData.length) || undefined,
          width: parseFloat(formData.width) || undefined,
          height: parseFloat(formData.height) || undefined,
          sku: formData.sku,
          icdesc: formData.icdesc,
          inventoryId: formData.inventoryId,
          thumbnailId: thumbnailId || undefined,
          galleryIds: galleryIds.length > 0 ? galleryIds : undefined,
        },
        { onSuccess: () => handleFormReset() }
      );
    }
  };

  const handleFormReset = () => {
    setFormData({
      title: "",
      description: "",
      make: "",
      model: "",
      category: "",
      manufacturer: "",
      price: "",
      stock: "",
      year: "",
      startYear: "",
      endYear: "",
      sku: "",
      tag: "",
      odo: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      icdesc: "",
      inventoryId: "",
      post_status: "publish",
    });
    setSelectedFile(null);
    setImagePreview("");
    setSelectedGalleryFiles([]);
    setGalleryPreviews([]);
    setShowForm(false);
    setEditingPart(null);
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);

    const originalPost = postsData?.posts?.find((post) => post.ID === part.id);
    const meta = originalPost?.meta || {};

    setFormData({
      title: part.name,
      description: part.description,
      make: meta.make || "",
      model: meta.model || "",
      category: meta.itemTypeCode || "",
      manufacturer: meta.manufacturer || part.brand || "",
      price: String(part.price),
      stock: String(part.stock),
      year: meta.year || "",
      startYear: meta.startYear || "",
      endYear: meta.endYear || "",
      sku: meta._sku || part.partNumber || "",
      tag: meta.tag || "",
      odo: meta.odoReading || "",
      weight: meta._weight || "",
      length: meta._length || "",
      width: meta._width || "",
      height: meta._height || "",
      icdesc: meta.icDesc || part.description || "",
      inventoryId: part.inventoryId || "",
      post_status: part.status === "active" ? "publish" : "draft",
    });

    setSelectedFile(null);
    setImagePreview(part.image || "");

    setSelectedGalleryFiles([]);
    if (originalPost?.resolvedGalleryUrls?.length) {
      setGalleryPreviews(originalPost.resolvedGalleryUrls);
    } else {
      setGalleryPreviews([]);
    }

    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this part?")) {
      deletePostMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingPart(null);
    handleFormReset();
    setShowForm(true);
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
              Parts Management
            </Text>
          </Flex>
          <Button colorScheme="red" onClick={handleAddNew}>
            <FaPlus style={{ marginRight: "8px" }} />
            Add New Part
          </Button>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={8}>
        {/* Stats Cards */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={4}
          mb={8}
        >
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {totalParts}
            </Text>
            <Text color="blue.600">Total Parts</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              {parts.filter((p) => p.status === "active").length}
            </Text>
            <Text color="green.600">Active (This Page)</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="orange.600">
              {parts.filter((p) => p.stock < 10).length}
            </Text>
            <Text color="orange.600">Low Stock (This Page)</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
              {categories.length}
            </Text>
            <Text color="purple.600">Categories</Text>
          </Box>
        </Box>

        {/* Parts List */}
        <Box bg="white" borderRadius="lg" shadow="sm" p={6}>
          <Flex justify="space-between" align="start" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Parts Inventory
            </Text>
            <Text fontSize="sm" color="gray.600">
              Showing {parts.length} of {totalParts} parts
            </Text>
          </Flex>

          {/* Search Bar */}
          <Box mb={6}>
            <form onSubmit={handleSearch}>
              <Flex gap={2}>
                <Input
                  placeholder="Search parts by name, brand, or part number..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  flex="1"
                />
                <Button type="submit" colorScheme="red" px={8}>
                  Search
                </Button>
              </Flex>
            </form>
          </Box>

          {isLoading ? (
            <Text color="gray.500" textAlign="center" py={8}>
              Loading parts...
            </Text>
          ) : error ? (
            <Text color="red.500" textAlign="center" py={8}>
              Error loading parts. Please try again.
            </Text>
          ) : parts.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No parts found. Add your first part to get started.
            </Text>
          ) : (
            <VStack gap={4} align="stretch">
              {parts.map((part) => (
                <Box
                  key={part.id}
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Flex justify="space-between" align="start">
                    <Box flex="1">
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        {part.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        {part.brand} • {part.category} • Part #: {part.partNumber}
                      </Text>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        {part.description}
                      </Text>
                      <Flex gap={4} fontSize="sm">
                        <Text>
                          Price:{" "}
                          <Box as="span" fontWeight="bold">
                            ${part.price}
                          </Box>
                        </Text>
                        <Text>
                          Stock:{" "}
                          <Box
                            as="span"
                            fontWeight="bold"
                            color={part.stock < 10 ? "red.500" : "green.500"}
                          >
                            {part.stock}
                          </Box>
                        </Text>
                        <Text>
                          Status:{" "}
                          <Box
                            as="span"
                            fontWeight="bold"
                            color={
                              part.status === "active" ? "green.500" : "red.500"
                            }
                          >
                            {part.status}
                          </Box>
                        </Text>
                      </Flex>
                    </Box>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEdit(part)}
                      >
                        <FaEdit style={{ marginRight: "4px" }} />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(part.id)}
                      >
                        <FaTrash style={{ marginRight: "4px" }} />
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}

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
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                  })}
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
              {editingPart ? "Edit Part" : "Add New Part"}
            </Text>

            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                {/* Editable Fields */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Part Title *
                  </Text>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter part title"
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Description
                  </Text>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter part description"
                    rows={4}
                  />
                </Box>

                <Flex gap={4}>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Make *
                    </Text>
                    <Input
                      name="make"
                      value={formData.make}
                      disabled
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Model *
                    </Text>
                    <Input
                      name="model"
                      value={formData.model}
                      disabled
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Part *
                    </Text>
                    <Input
                      name="category"
                      value={formData.category}
                      disabled
                    />
                  </Box>
                </Flex>

                {/* Read-only Fields */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    SKU
                  </Text>
                  <Input
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Enter SKU"
                    disabled
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Inventory ID
                  </Text>
                  <Input
                    name="inventoryId"
                    value={formData.inventoryId}
                    onChange={handleInputChange}
                    placeholder="Enter Inventory ID"
                    disabled
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Tag
                  </Text>
                  <Input
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                    placeholder="Enter tag"
                    disabled
                  />
                </Box>

                {/* Editable Fields */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Odometer Reading
                  </Text>
                  <Input
                    name="odo"
                    value={formData.odo}
                    onChange={handleInputChange}
                    placeholder="Enter odometer reading"
                  />
                </Box>

                <Flex gap={4}>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Weight (kg)
                    </Text>
                    <Input
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      min={0}
                      step="0.1"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Dimensions
                    </Text>
                    <Flex gap={4}>
                      <Box flex="1">
                        <Text fontSize="xs" color="gray.600" mb={1}>
                          Length (cm)
                        </Text>
                        <Input
                          name="length"
                          type="number"
                          value={formData.length}
                          onChange={handleInputChange}
                          placeholder="0.0"
                          min={0}
                          step="0.1"
                        />
                      </Box>
                      <Box flex="1">
                        <Text fontSize="xs" color="gray.600" mb={1}>
                          Width (cm)
                        </Text>
                        <Input
                          name="width"
                          type="number"
                          value={formData.width}
                          onChange={handleInputChange}
                          placeholder="0.0"
                          min={0}
                          step="0.1"
                        />
                      </Box>
                      <Box flex="1">
                        <Text fontSize="xs" color="gray.600" mb={1}>
                          Height (cm)
                        </Text>
                        <Input
                          name="height"
                          type="number"
                          value={formData.height}
                          onChange={handleInputChange}
                          placeholder="0.0"
                          min={0}
                          step="0.1"
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Flex>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    IC Description
                  </Text>
                  <Textarea
                    name="icdesc"
                    value={formData.icdesc}
                    onChange={handleInputChange}
                    placeholder="Enter IC description"
                    rows={2}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Product Image
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
                      {imagePreview.startsWith("blob:") ||
                      imagePreview.startsWith("data:") ? (
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
                      ) : (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={200}
                          height={150}
                          unoptimized
                          style={{
                            maxWidth: "200px",
                            maxHeight: "150px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                          }}
                          onError={(e) => {
                            console.error("Failed to load image:", imagePreview);
                            e.currentTarget.style.border = "2px solid red";
                            e.currentTarget.style.background = "#ffe6e6";
                          }}
                        />
                      )}
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
                              unoptimized
                              style={{
                                width: "120px",
                                height: "90px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                console.error("Failed to load gallery image:", preview);
                                e.currentTarget.style.border = "2px solid red";
                                e.currentTarget.style.background = "#ffe6e6";
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

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Status
                  </Text>
                  <select
                    name="post_status"
                    value={formData.post_status}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="publish">Published</option>
                    <option value="draft">Draft</option>
                    <option value="private">Private</option>
                  </select>
                </Box>

                <Flex gap={4} justify="flex-end" mt={6}>
                  <Button variant="ghost" onClick={handleFormReset}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="red"
                    loading={
                      createPartMutation.isPending ||
                      updatePostMutation.isPending ||
                      uploadImageMutation.isPending
                    }
                    loadingText={
                      uploadImageMutation.isPending
                        ? "Uploading image..."
                        : "Saving..."
                    }
                  >
                    {editingPart ? "Update Part" : "Add Part"}
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
