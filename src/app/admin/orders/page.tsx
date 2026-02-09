"use client";

import {
  Box,
  Text,
  Button,
  VStack,
  Flex,
  Badge,
  Input,
  NativeSelectRoot,
  NativeSelectField,
  NativeSelectIndicator,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableCell,
  TableScrollArea,
  FieldRoot,
  FieldLabel,
  HStack,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaEdit,
  FaEye,
  FaSearch,
  FaShippingFast,
  FaCheck,
} from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useOrders,
  useOrdersByStatus,
  useUpdateOrderStatus,
  useUpdateOrderShipping,
} from "../../../shared/hooks/useOrders";
import { Order, CompleteOrderItem } from "../../../shared/api/orders";

const orderStatuses = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending", color: "gray" },
  { value: "paid", label: "Paid", color: "blue" },
  { value: "confirmed", label: "Confirmed", color: "cyan" },
  { value: "preparing", label: "Preparing", color: "yellow" },
  { value: "ready_to_ship", label: "Ready to Ship", color: "orange" },
  { value: "shipped", label: "Shipped", color: "purple" },
  { value: "delivered", label: "Delivered", color: "green" },
  { value: "failed", label: "Failed", color: "red" },
  { value: "cancelled", label: "Cancelled", color: "red" },
  { value: "refunded", label: "Refunded", color: "pink" },
];

export default function OrdersManagement() {
  const router = useRouter();

  // Auth gate — DO NOT early-return; just set a flag and redirect.
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (!token) {
      router.replace("/admin/login?next=/admin/orders");
      // we don't set authReady true; the UI stays hidden while we redirect
      return;
    }
    setAuthReady(true);
  }, [router]);

  // ---- normal component state/hooks (always called) ----
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    status: "",
    trackingNumber: "",
    shippingAddress: "",
    shippingMethod: "",
    shippingCarrier: "",
    notes: "",
  });

  const limit = 20;

  // Always call hooks. If you want to avoid fetching until auth, wire an `enabled` flag inside those hooks.
  const allOrdersQuery = useOrders(currentPage, limit);
  const filteredOrdersQuery = useOrdersByStatus(statusFilter, currentPage, limit);
  const ordersQuery = statusFilter ? filteredOrdersQuery : allOrdersQuery;

  const updateStatusMutation = useUpdateOrderStatus();
  const updateShippingMutation = useUpdateOrderShipping();

  const { data: ordersData, isLoading, error } = ordersQuery;
  const orders = useMemo(() => ordersData?.orders || [], [ordersData?.orders]);
  const pagination = ordersData?.pagination;

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentIntentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.externalOrderReference &&
          order.externalOrderReference.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [orders, searchTerm]);

  const getStatusColor = (status: string) =>
    orderStatuses.find((s) => s.value === status)?.color || "gray";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(num);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setFormData({
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      shippingAddress: order.shippingAddress || "",
      shippingMethod: order.shippingMethod || "",
      shippingCarrier: order.shippingCarrier || "",
      notes: "",
    });
    onOpen();
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await updateStatusMutation.mutateAsync({
        paymentIntentId: selectedOrder.paymentIntentId,
        status: formData.status,
      });
      toast.success("Status Updated", {
        description: `Order status updated to ${formData.status}`,
      });
      setEditingField(null);
    } catch {
      toast.error("Error", { description: "Failed to update order status" });
    }
  };

  const handleUpdateShipping = async () => {
    if (!selectedOrder) return;
    try {
      await updateShippingMutation.mutateAsync({
        paymentIntentId: selectedOrder.paymentIntentId,
        shippingDetails: {
          trackingNumber: formData.trackingNumber,
          address: formData.shippingAddress,
          method: formData.shippingMethod,
          carrier: formData.shippingCarrier,
        },
      });
      toast.success("Shipping Updated", {
        description: "Shipping details updated successfully",
      });
      setEditingField(null);
    } catch {
      toast.error("Error", { description: "Failed to update shipping details" });
    }
  };

  const renderOrderItems = (items: CompleteOrderItem[]) =>
    !items || items.length === 0
      ? "No items"
      : items.map((item, idx) => (
          <Box key={idx} fontSize="sm" mb={1}>
            <Text fontWeight="semibold">{item.name}</Text>
            <Text color="gray.600">
              Qty: {item.quantity} × {formatCurrency(item.price)}
            </Text>
          </Box>
        ));

  // ---------- Render ----------
  // If not authenticated yet (redirecting), render nothing visible but keep hooks order intact.
  if (!authReady) {
    return <Box />; // empty shell while redirect happens
  }

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
              Orders Management
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={8}>
        {/* Stats Cards */}
        <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} mb={8}>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {pagination?.total || 0}
            </Text>
            <Text color="blue.600">Total Orders</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              {orders.filter((o) => o.status === "delivered").length}
            </Text>
            <Text color="green.600">Delivered</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
              {orders.filter((o) => o.status === "preparing").length}
            </Text>
            <Text color="yellow.600">In Progress</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
              {formatCurrency(orders.reduce((sum, o) => sum + Number(o.total), 0))}
            </Text>
            <Text color="purple.600">Total Value</Text>
          </Box>
        </Box>

        {/* Filters */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm" mb={6}>
          <Flex gap={4} align="end" wrap="wrap">
            <Box flex="1" minW="200px">
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Search Orders
              </Text>
              <Input
                placeholder="Search by customer, email, payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
            <Box minW="200px">
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Filter by Status
              </Text>
              <NativeSelectRoot>
                <NativeSelectField
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {orderStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </NativeSelectField>
                <NativeSelectIndicator>
                  <FaSearch />
                </NativeSelectIndicator>
              </NativeSelectRoot>
            </Box>
          </Flex>
        </Box>

        {/* Orders Table */}
        <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
          <Box p={6} borderBottom="1px solid" borderColor="gray.200">
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Orders ({filteredOrders.length})
            </Text>
          </Box>

          {isLoading ? (
            <Box textAlign="center" py={12}>
              <Text color="gray.500">Loading orders...</Text>
            </Box>
          ) : error ? (
            <Box textAlign="center" py={12}>
              <Text color="red.500">Error loading orders. Please try again.</Text>
            </Box>
          ) : filteredOrders.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text color="gray.500">No orders found.</Text>
            </Box>
          ) : (
            <TableScrollArea>
              <TableRoot>
                <TableHeader bg="gray.50">
                  <TableRow>
                    <TableColumnHeader>Order ID</TableColumnHeader>
                    <TableColumnHeader>Customer</TableColumnHeader>
                    <TableColumnHeader>Items</TableColumnHeader>
                    <TableColumnHeader>Total</TableColumnHeader>
                    <TableColumnHeader>Status</TableColumnHeader>
                    <TableColumnHeader>Date</TableColumnHeader>
                    <TableColumnHeader>Actions</TableColumnHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} _hover={{ bg: "gray.50" }}>
                      <TableCell>
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold">
                            {order.paymentIntentId.slice(-8)}
                          </Text>
                          {order.externalOrderReference && (
                            <Text fontSize="xs" color="gray.600">
                              Ext: {order.externalOrderReference}
                            </Text>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold">
                            {order.customerName}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {order.customerEmail}
                          </Text>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box fontSize="xs">{order.itemsJson?.length || 0} item(s)</Box>
                      </TableCell>
                      <TableCell>
                        <Text fontWeight="semibold">{formatCurrency(order.total)}</Text>
                      </TableCell>
                      <TableCell>
                        <Badge colorScheme={getStatusColor(order.status)} textTransform="capitalize">
                          {order.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Text fontSize="sm">{formatDate(order.createdAt)}</Text>
                      </TableCell>
                      <TableCell>
                        <HStack gap={2}>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => handleViewOrder(order)}
                          >
                            <FaEye style={{ marginRight: "4px" }} />
                            View
                          </Button>
                        </HStack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableRoot>
            </TableScrollArea>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Box p={6} borderTop="1px solid" borderColor="gray.200">
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} total orders)
                </Text>
                <HStack>
                  <Button size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            </Box>
          )}
        </Box>
      </Box>

      {/* Order Details Modal */}
      {isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <Box
            maxW="6xl"
            maxH="90vh"
            overflowY="auto"
            bg="white"
            borderRadius="lg"
            shadow="xl"
            mx={4}
            my={4}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Restored modal content */}
            <Box
              p={6}
              borderBottom="1px solid"
              borderColor="gray.200"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="xl" fontWeight="bold">
                Order Details - {selectedOrder?.paymentIntentId}
              </Text>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </Box>
            <Box p={6}>
              {selectedOrder && (
                <VStack gap={6} align="stretch">
                  {/* Customer Information */}
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Customer Information
                    </Text>
                    <Box bg="gray.50" p={4} borderRadius="md">
                      <Text>
                        <strong>Name:</strong> {selectedOrder.customerName}
                      </Text>
                      <Text>
                        <strong>Email:</strong> {selectedOrder.customerEmail}
                      </Text>
                      <Text>
                        <strong>Phone:</strong> {selectedOrder.customerPhone || "N/A"}
                      </Text>
                      <Text>
                        <strong>Address:</strong> {selectedOrder.customerAddress || "N/A"}
                      </Text>
                    </Box>
                  </Box>

                  {/* Order Items */}
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Order Items
                    </Text>
                    <Box bg="gray.50" p={4} borderRadius="md">
                      {renderOrderItems(selectedOrder.itemsJson)}
                    </Box>
                  </Box>

                  {/* Order Status */}
                  <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text fontSize="lg" fontWeight="bold">Order Status</Text>
                      {editingField !== "status" && (
                        <Button size="sm" onClick={() => setEditingField("status")}>
                          <FaEdit style={{ marginRight: "4px" }} />
                          Edit
                        </Button>
                      )}
                    </Flex>
                    {editingField === "status" ? (
                      <HStack>
                        <NativeSelectRoot>
                          <NativeSelectField
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({ ...formData, status: e.target.value })
                            }
                          >
                            {orderStatuses.slice(1).map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </NativeSelectField>
                        </NativeSelectRoot>
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={handleUpdateStatus}
                          loading={updateStatusMutation.isPending}
                        >
                          <FaCheck />
                        </Button>
                        <Button size="sm" onClick={() => setEditingField(null)}>
                          Cancel
                        </Button>
                      </HStack>
                    ) : (
                      <Badge
                        colorScheme={getStatusColor(selectedOrder.status)}
                        fontSize="md"
                        p={2}
                        textTransform="capitalize"
                      >
                        {selectedOrder.status.replace("_", " ")}
                      </Badge>
                    )}
                  </Box>

                  {/* Shipping Information */}
                  <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text fontSize="lg" fontWeight="bold">Shipping Information</Text>
                      {editingField !== "shipping" && (
                        <Button size="sm" onClick={() => setEditingField("shipping")}>
                          <FaShippingFast style={{ marginRight: "4px" }} />
                          Edit
                        </Button>
                      )}
                    </Flex>
                    {editingField === "shipping" ? (
                      <VStack gap={4}>
                        <FieldRoot>
                          <FieldLabel>Tracking Number</FieldLabel>
                          <Input
                            value={formData.trackingNumber}
                            onChange={(e) =>
                              setFormData({ ...formData, trackingNumber: e.target.value })
                            }
                          />
                        </FieldRoot>
                        <FieldRoot>
                          <FieldLabel>Shipping Method</FieldLabel>
                          <Input
                            value={formData.shippingMethod}
                            onChange={(e) =>
                              setFormData({ ...formData, shippingMethod: e.target.value })
                            }
                          />
                        </FieldRoot>
                        <FieldRoot>
                          <FieldLabel>Carrier</FieldLabel>
                          <Input
                            value={formData.shippingCarrier}
                            onChange={(e) =>
                              setFormData({ ...formData, shippingCarrier: e.target.value })
                            }
                          />
                        </FieldRoot>
                        <HStack>
                          <Button
                            colorScheme="green"
                            onClick={handleUpdateShipping}
                            loading={updateShippingMutation.isPending}
                          >
                            <FaCheck style={{ marginRight: "4px" }} />
                            Update
                          </Button>
                          <Button onClick={() => setEditingField(null)}>
                            Cancel
                          </Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <Box bg="gray.50" p={4} borderRadius="md">
                        <Text>
                          <strong>Method:</strong> {selectedOrder.shippingMethod || "N/A"}
                        </Text>
                        <Text>
                          <strong>Carrier:</strong> {selectedOrder.shippingCarrier || "N/A"}
                        </Text>
                        <Text>
                          <strong>Tracking:</strong> {selectedOrder.trackingNumber || "N/A"}
                        </Text>
                        <Text>
                          <strong>Cost:</strong> {formatCurrency(selectedOrder.shippingCost)}
                        </Text>
                      </Box>
                    )}
                  </Box>

                  {/* Order Summary */}
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Order Summary
                    </Text>
                    <Box bg="gray.50" p={4} borderRadius="md">
                      <Flex justify="space-between">
                        <Text>Subtotal:</Text>
                        <Text>{formatCurrency(selectedOrder.subtotal)}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text>Tax:</Text>
                        <Text>{formatCurrency(selectedOrder.tax)}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text>Shipping:</Text>
                        <Text>{formatCurrency(selectedOrder.shipping)}</Text>
                      </Flex>
                      <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                        <Text>Total:</Text>
                        <Text>{formatCurrency(selectedOrder.total)}</Text>
                      </Flex>
                    </Box>
                  </Box>
                </VStack>
              )}
            </Box>
            <Box p={6} borderTop="1px solid" borderColor="gray.200">
              <Button onClick={onClose}>Close</Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
