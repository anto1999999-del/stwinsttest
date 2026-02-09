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
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaCog } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description: string;
  type: "parts" | "cars";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "parts" as "parts" | "cars",
    isActive: true,
  });

  useEffect(() => {
    // Check authentication
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }

    // Load categories from localStorage
    const savedCategories = localStorage.getItem("adminCategories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Initialize with default categories
      const defaultCategories: Category[] = [
        {
          id: "1",
          name: "Engine Parts",
          description: "Engine components and accessories",
          type: "parts",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Brake System",
          description: "Brake pads, rotors, and brake system components",
          type: "parts",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Suspension",
          description: "Suspension components and parts",
          type: "parts",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Sedans",
          description: "Sedan cars for sale",
          type: "cars",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "SUVs",
          description: "SUV vehicles for sale",
          type: "cars",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setCategories(defaultCategories);
      localStorage.setItem(
        "adminCategories",
        JSON.stringify(defaultCategories)
      );
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newCategory: Category = {
      id: editingCategory ? editingCategory.id : Date.now().toString(),
      ...formData,
      createdAt: editingCategory
        ? editingCategory.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedCategories;
    if (editingCategory) {
      updatedCategories = categories.map((cat) =>
        cat.id === editingCategory.id ? newCategory : cat
      );
    } else {
      updatedCategories = [...categories, newCategory];
    }

    setCategories(updatedCategories);
    localStorage.setItem("adminCategories", JSON.stringify(updatedCategories));

    setFormData({
      name: "",
      description: "",
      type: "parts",
      isActive: true,
    });

    setIsLoading(false);
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      type: category.type,
      isActive: category.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter((cat) => cat.id !== id);
      setCategories(updatedCategories);
      localStorage.setItem(
        "adminCategories",
        JSON.stringify(updatedCategories)
      );
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      type: "parts",
      isActive: true,
    });
    setShowForm(true);
  };

  const partsCategories = categories.filter((cat) => cat.type === "parts");
  const carsCategories = categories.filter((cat) => cat.type === "cars");

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
              Categories Management
            </Text>
          </Flex>
          <Button colorScheme="red" onClick={handleAddNew}>
            <FaPlus style={{ marginRight: "8px" }} />
            Add New Category
          </Button>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={8}>
        {/* Stats Cards */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={4}
          mb={8}
        >
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {categories.length}
            </Text>
            <Text color="blue.600">Total Categories</Text>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              {partsCategories.length}
            </Text>
            <Text color="green.600">Parts Categories</Text>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
              {carsCategories.length}
            </Text>
            <Text color="purple.600">Cars Categories</Text>
          </Box>
        </Box>

        {/* Parts Categories */}
        <Box mb={8}>
          <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.800">
            Parts Categories
          </Text>
          <Box bg="white" borderRadius="lg" shadow="sm" p={6}>
            {partsCategories.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={8}>
                No parts categories found.
              </Text>
            ) : (
              <VStack gap={4} align="stretch">
                {partsCategories.map((category) => (
                  <Box
                    key={category.id}
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    bg="gray.50"
                  >
                    <Flex justify="space-between" align="start">
                      <Box flex="1">
                        <Flex align="center" gap={2} mb={2}>
                          <FaCog color="blue" />
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="gray.800"
                          >
                            {category.name}
                          </Text>
                          <Box
                            px={2}
                            py={1}
                            bg={category.isActive ? "green.100" : "red.100"}
                            borderRadius="md"
                            fontSize="xs"
                            color={category.isActive ? "green.600" : "red.600"}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </Box>
                        </Flex>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          {category.description}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Created:{" "}
                          {new Date(category.createdAt).toLocaleDateString()}
                        </Text>
                      </Box>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEdit(category)}
                        >
                          <FaEdit style={{ marginRight: "4px" }} />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(category.id)}
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
          </Box>
        </Box>

        {/* Cars Categories */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.800">
            Cars Categories
          </Text>
          <Box bg="white" borderRadius="lg" shadow="sm" p={6}>
            {carsCategories.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={8}>
                No cars categories found.
              </Text>
            ) : (
              <VStack gap={4} align="stretch">
                {carsCategories.map((category) => (
                  <Box
                    key={category.id}
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    bg="gray.50"
                  >
                    <Flex justify="space-between" align="start">
                      <Box flex="1">
                        <Flex align="center" gap={2} mb={2}>
                          <FaCog color="green" />
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="gray.800"
                          >
                            {category.name}
                          </Text>
                          <Box
                            px={2}
                            py={1}
                            bg={category.isActive ? "green.100" : "red.100"}
                            borderRadius="md"
                            fontSize="xs"
                            color={category.isActive ? "green.600" : "red.600"}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </Box>
                        </Flex>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          {category.description}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Created:{" "}
                          {new Date(category.createdAt).toLocaleDateString()}
                        </Text>
                      </Box>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEdit(category)}
                        >
                          <FaEdit style={{ marginRight: "4px" }} />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(category.id)}
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
          </Box>
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
            maxW="500px"
          >
            <Text fontSize="xl" fontWeight="bold" mb={6} color="gray.800">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </Text>

            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Category Name *
                  </Text>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Description *
                  </Text>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter category description"
                    rows={3}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Type *
                  </Text>
                  <select
                    name="type"
                    value={formData.type}
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
                    <option value="parts">Parts</option>
                    <option value="cars">Cars</option>
                  </select>
                </Box>

                <Box>
                  <Flex align="center" gap={2}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      style={{ accentColor: "#d80c19" }}
                    />
                    <Text fontSize="sm">Active Category</Text>
                  </Flex>
                </Box>

                <Flex gap={4} justify="flex-end" mt={6}>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="red"
                    loading={isLoading}
                    loadingText="Saving..."
                  >
                    {editingCategory ? "Update Category" : "Add Category"}
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
