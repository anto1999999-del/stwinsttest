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
  HStack,
  Textarea,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaEye,
  FaSearch,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useOffers,
  useReplyToOffer,
  useDeleteOffer,
} from "../../../shared/hooks/useOffers";
import { OfferItem, OfferStatus } from "../../../shared/api/admin";

const offerStatusFilters: { value: string; label: string; color: string }[] = [
  { value: "all", label: "All Offers", color: "gray" },
  { value: "new", label: "New", color: "blue" },
  { value: "approved", label: "Approved", color: "green" },
  { value: "rejected", label: "Rejected", color: "red" },
  { value: "read", label: "Read", color: "purple" },
];

function normalizeStatus(status?: string | null): OfferStatus | "unknown" {
  const v = (status || "").toLowerCase();
  if (v === "approved" || v === "accepted") return "approved";
  if (v === "rejected" || v === "declined") return "rejected";
  if (v === "read") return "read";
  if (!v || v === "new" || v === "pending") return "new";
  return "unknown";
}

function getStatusColor(status?: string | null): string {
  const s = normalizeStatus(status);
  switch (s) {
    case "new":
      return "blue";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    case "read":
      return "purple";
    default:
      return "gray";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number | string | null | undefined) {
  const num =
    typeof amount === "string" ? parseFloat(amount) : amount ?? 0;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(Number.isFinite(num) ? num : 0);
}

export default function OffersManagement() {
  const router = useRouter();

  // Auth gate (same pattern as orders page)
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("adminToken")
        : null;
    if (!token) {
      router.replace("/admin/login?next=/admin/offers");
      return;
    }
    setAuthReady(true);
  }, [router]);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyMode, setReplyMode] = useState<"accept" | "reject" | null>(null);

  const pageSize = 20;

  const offersQuery = useOffers({
    page: currentPage,
    pageSize,
  });

  const replyMutation = useReplyToOffer();
  const deleteMutation = useDeleteOffer();

  const { data, isLoading, error } = offersQuery;
  const offers = useMemo(() => data?.items ?? [], [data?.items]);
  const pagination = data?.pagination;

  // local filtering by search + status
  const filteredOffers = useMemo(() => {
    let list = offers;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter((offer) => {
        return (
          offer.name.toLowerCase().includes(term) ||
          (offer.email ?? "").toLowerCase().includes(term) ||
          (offer.inventoryId ?? "").toLowerCase().includes(term) ||
          offer.partId.toLowerCase().includes(term)
        );
      });
    }

    if (statusFilter && statusFilter !== "all") {
      list = list.filter(
        (offer) => normalizeStatus(offer.status) === statusFilter
      );
    }

    return list;
  }, [offers, searchTerm, statusFilter]);

  // Stats
  const totalOffers = offers.length;
  const newCount = offers.filter(
    (o) => normalizeStatus(o.status) === "new"
  ).length;
  const approvedCount = offers.filter(
    (o) => normalizeStatus(o.status) === "approved"
  ).length;
  const rejectedCount = offers.filter(
    (o) => normalizeStatus(o.status) === "rejected"
  ).length;
  const totalOfferValue = offers.reduce(
    (sum, o) => sum + (o.offerPrice || 0),
    0
  );

  const onOpen = (offer: OfferItem) => {
    setSelectedOffer(offer);

    const partLink = offer.partId
      ? `https://stwins.com.au/parts/${offer.partId}`
      : "";

    const defaultMessage = partLink
      ? `Hi ${offer.name},\n\nHere is the link to the part you enquired about:\n${partLink}\n`
      : "";

    setReplyMessage(defaultMessage);
    setReplyMode(null);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedOffer(null);
    setReplyMessage("");
    setReplyMode(null);
  };

  const handleReply = async (accept: boolean) => {
    if (!selectedOffer) return;
    setReplyMode(accept ? "accept" : "reject");
    try {
      await replyMutation.mutateAsync({
        id: selectedOffer.id,
        accept,
        message: replyMessage || undefined,
      });
      toast.success(
        accept ? "Offer accepted" : "Offer rejected",
        {
          description: `Offer #${selectedOffer.id} has been ${
            accept ? "accepted" : "rejected"
          }.`,
        }
      );
      onClose();
    } catch (err) {
      toast.error("Error", {
        description: "Failed to reply to offer",
      });
    } finally {
      setReplyMode(null);
    }
  };

  const handleDelete = async (offer: OfferItem) => {
    if (!window.confirm(`Delete offer #${offer.id}? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(offer.id);
      toast.success("Offer deleted");
    } catch {
      toast.error("Error", { description: "Failed to delete offer" });
    }
  };

  if (!authReady) {
    return <Box />; // keep hooks order, no visible UI during redirect
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
              Offers Management
            </Text>
          </Flex>
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
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {totalOffers}
            </Text>
            <Text color="blue.600">Total Offers</Text>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              {approvedCount}
            </Text>
            <Text color="green.600">Approved</Text>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="red.600">
              {rejectedCount}
            </Text>
            <Text color="red.600">Rejected</Text>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            shadow="sm"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
              {formatCurrency(totalOfferValue)}
            </Text>
            <Text color="purple.600">Total Offered Value</Text>
          </Box>
        </Box>

        {/* Filters */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm" mb={6}>
          <Flex gap={4} align="end" wrap="wrap">
            <Box flex="1" minW="200px">
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Search Offers
              </Text>
              <Input
                placeholder="Search by name, email, inv#, part ID..."
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
                  {offerStatusFilters.map((status) => (
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

        {/* Offers Table */}
        <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
          <Box p={6} borderBottom="1px solid" borderColor="gray.200">
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Offers ({filteredOffers.length})
            </Text>
          </Box>

          {isLoading ? (
            <Box textAlign="center" py={12}>
              <Text color="gray.500">Loading offers...</Text>
            </Box>
          ) : error ? (
            <Box textAlign="center" py={12}>
              <Text color="red.500">
                Error loading offers. Please try again.
              </Text>
            </Box>
          ) : filteredOffers.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text color="gray.500">No offers found.</Text>
            </Box>
          ) : (
            <TableScrollArea>
              <TableRoot>
                <TableHeader bg="gray.50">
                  <TableRow>
                    <TableColumnHeader>Offer ID</TableColumnHeader>
                    <TableColumnHeader>Part / Inv</TableColumnHeader>
                    <TableColumnHeader>Customer</TableColumnHeader>
                    <TableColumnHeader>Offer</TableColumnHeader>
                    <TableColumnHeader>Status</TableColumnHeader>
                    <TableColumnHeader>Date</TableColumnHeader>
                    <TableColumnHeader>Actions</TableColumnHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id} _hover={{ bg: "gray.50" }}>
                      <TableCell>
                        <Text fontSize="sm" fontWeight="semibold">
                          #{offer.id}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Box fontSize="sm">
                          <Text fontWeight="semibold">
                            Part ID: {offer.partId}
                          </Text>
                          {offer.inventoryId && (
                            <Text fontSize="xs" color="gray.600">
                              Inv: {offer.inventoryId}
                            </Text>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold">
                            {offer.name}
                          </Text>
                          {offer.email && (
                            <Text fontSize="xs" color="gray.600">
                              {offer.email}
                            </Text>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box fontSize="sm">
                          <Text fontWeight="semibold">
                            {formatCurrency(offer.offerPrice)}
                          </Text>
                          {offer.askingPrice != null && (
                            <Text fontSize="xs" color="gray.600">
                              Asking: {formatCurrency(offer.askingPrice)}
                            </Text>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Badge
                          colorScheme={getStatusColor(offer.status)}
                          textTransform="capitalize"
                        >
                          {normalizeStatus(offer.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Text fontSize="sm">
                          {formatDate(offer.createdAt)}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <HStack gap={2}>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => onOpen(offer)}
                          >
                            <FaEye style={{ marginRight: "4px" }} />
                            View
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDelete(offer)}
                            loading={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableRoot>
            </TableScrollArea>
          )}

          {/* Pagination (backend pagination if provided) */}
          {pagination && pagination.totalPages > 1 && (
            <Box p={6} borderTop="1px solid" borderColor="gray.200">
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Page {pagination.page} of {pagination.totalPages} (
                  {pagination.total} total offers)
                </Text>
                <HStack>
                  <Button
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
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

      {/* Offer Details Modal */}
      {isOpen && selectedOffer && (
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
            maxW="4xl"
            maxH="90vh"
            overflowY="auto"
            bg="white"
            borderRadius="lg"
            shadow="xl"
            mx={4}
            my={4}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              p={6}
              borderBottom="1px solid"
              borderColor="gray.200"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="xl" fontWeight="bold">
                Offer #{selectedOffer.id}
              </Text>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </Box>

            <Box p={6}>
              <VStack align="stretch" gap={6}>
                {/* Customer Info */}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Customer
                  </Text>
                  <Box bg="gray.50" p={4} borderRadius="md">
                    <Text>
                      <strong>Name:</strong> {selectedOffer.name}
                    </Text>
                    {selectedOffer.email && (
                      <Text>
                        <strong>Email:</strong> {selectedOffer.email}
                      </Text>
                    )}
                    {selectedOffer.phone && (
                      <Text>
                        <strong>Phone:</strong> {selectedOffer.phone}
                      </Text>
                    )}
                  </Box>
                </Box>

                {/* Part Info */}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Part / Inventory
                  </Text>
                  <Box bg="gray.50" p={4} borderRadius="md">
                    {selectedOffer.productTitle && (
                      <Text>
                        <strong>Product:</strong> {selectedOffer.productTitle}
                      </Text>
                    )}
                    <Text>
                      <strong>Part ID:</strong> {selectedOffer.partId}
                    </Text>
                    {selectedOffer.inventoryId && (
                      <Text>
                        <strong>Inventory ID:</strong>{" "}
                        {selectedOffer.inventoryId}
                      </Text>
                    )}
                    <Text>
                      <strong>View Part:</strong>{" "}
                      <a
                        href={`https://stwins.com.au/parts/${selectedOffer.partId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#d80c19", textDecoration: "underline" }}
                      >
                        Open part page
                      </a>
                    </Text>
                  </Box>
                </Box>

                {/* Offer Info */}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Offer Details
                  </Text>
                  <Box bg="gray.50" p={4} borderRadius="md">
                    <Text>
                      <strong>Offer:</strong>{" "}
                      {formatCurrency(selectedOffer.offerPrice)}
                    </Text>
                    {selectedOffer.askingPrice != null && (
                      <Text>
                        <strong>Asking:</strong>{" "}
                        {formatCurrency(selectedOffer.askingPrice)}
                      </Text>
                    )}
                    {selectedOffer.message && (
                      <Box mt={3}>
                        <Text fontWeight="semibold">Customer Message:</Text>
                        <Text whiteSpace="pre-wrap">
                          {selectedOffer.message}
                        </Text>
                      </Box>
                    )}
                    <Box mt={3}>
                      <Badge
                        colorScheme={getStatusColor(selectedOffer.status)}
                        textTransform="capitalize"
                      >
                        {normalizeStatus(selectedOffer.status)}
                      </Badge>
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        Submitted: {formatDate(selectedOffer.createdAt)}
                      </Text>
                    </Box>
                  </Box>
                </Box>

                {/* Reply */}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Reply to Offer
                  </Text>
                  <VStack align="stretch" gap={3}>
                    <Textarea
                      placeholder="Optional message to the customer..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <HStack>
                      <Button
                        colorScheme="green"
                        onClick={() => handleReply(true)}
                        loading={
                          replyMutation.isPending &&
                          replyMode === "accept"
                        }
                      >
                        <FaCheck style={{ marginRight: 6 }} />
                        Accept
                      </Button>

                      <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleReply(false)}
                        loading={
                          replyMutation.isPending &&
                          replyMode === "reject"
                        }
                      >
                        <FaTimes style={{ marginRight: 6 }} />
                        Reject
                      </Button>

                      <Button onClick={onClose}>Close</Button>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
