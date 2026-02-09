"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  CardRoot,
  CardBody,
  CardHeader,
  Heading,
  AlertRoot,
  Badge,
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogCloseTrigger,
  DialogBody,
  DialogFooter,
  useDisclosure,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableCell,
  IconButton,
} from "@chakra-ui/react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import {
  shippingApi,
  BookShipmentRequest,
  BookingResponse,
  ShippingAddress,
  ServiceType,
} from "@/shared/api/shipping";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number }>;
  shippingAddress: ShippingAddress;
  total: number;
  status: string;
}

interface ShipmentManagementProps {
  orders?: Order[];
}

export const ShipmentManagement: React.FC<ShipmentManagementProps> = ({
  orders = [],
}) => {
  const [bookings, setBookings] = useState<
    Array<BookingResponse & { orderId: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { open, onOpen, onClose } = useDisclosure();

  const { control, handleSubmit, reset } = useForm<BookShipmentRequest>();

  // Default warehouse address - should be configured via environment variables
  const warehouseAddress: ShippingAddress = {
    name: process.env.NEXT_PUBLIC_WAREHOUSE_NAME || "S-Twins Warehouse",
    company: process.env.NEXT_PUBLIC_WAREHOUSE_COMPANY || "S-Twins Auto Parts",
    streetAddress: process.env.NEXT_PUBLIC_WAREHOUSE_STREET || "",
    suburb: process.env.NEXT_PUBLIC_WAREHOUSE_SUBURB || "NSW",
    state: process.env.NEXT_PUBLIC_WAREHOUSE_STATE || "",
    postcode: process.env.NEXT_PUBLIC_WAREHOUSE_POSTCODE || "2164",
    country: process.env.NEXT_PUBLIC_WAREHOUSE_COUNTRY || "Australia",
    phone: process.env.NEXT_PUBLIC_WAREHOUSE_PHONE || "",
    email: process.env.NEXT_PUBLIC_WAREHOUSE_EMAIL || "",
  };

  const openBookingModal = (order: Order) => {
    setSelectedOrder(order);

    // Pre-populate form with order data
    reset({
      sender: warehouseAddress,
      recipient: {
        name: order.customerName,
        streetAddress: order.shippingAddress.streetAddress,
        apartment: order.shippingAddress.apartment,
        suburb: order.shippingAddress.suburb,
        state: order.shippingAddress.state,
        postcode: order.shippingAddress.postcode,
        country: order.shippingAddress.country || "Australia",
        phone: order.shippingAddress.phone,
        email: order.customerEmail,
      },
      items: order.items.map((item) => ({
        weight: 1, // Default weight
        length: 20,
        width: 15,
        height: 10,
        quantity: item.quantity,
        description: item.name,
      })),
      serviceType: ServiceType.STANDARD,
      signatureRequired: false,
      insuranceRequired: false,
    });

    onOpen();
  };

  const onSubmit = async (data: BookShipmentRequest) => {
    setLoading(true);
    try {
      const response = await shippingApi.bookShipment(data);

      if (response.success) {
        setBookings((prev) => [
          ...prev,
          { ...response, orderId: selectedOrder?.id || "" },
        ]);
        onClose();
        reset();
      }
    } catch (error: unknown) {
      console.error("Failed to book shipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelShipment = async (trackingNumber: string) => {
    try {
      const response = await shippingApi.cancelShipment(trackingNumber);

      if (response.success) {
        setBookings((prev) =>
          prev.filter((b) => b.trackingNumber !== trackingNumber)
        );
      }
    } catch (error) {
      console.error("Failed to cancel shipment:", error);
    }
  };

  return (
    <Box>
      {/* Pending Orders */}
      <CardRoot mb={8}>
        <CardHeader>
          <Heading size="lg">Pending Orders</Heading>
          <Text color="gray.600">Orders ready for shipping</Text>
        </CardHeader>
        <CardBody>
          {orders.length === 0 ? (
            <AlertRoot status="info">No pending orders found</AlertRoot>
          ) : (
            <TableRoot>
              <TableHeader>
                <TableRow>
                  <TableColumnHeader>Order ID</TableColumnHeader>
                  <TableColumnHeader>Customer</TableColumnHeader>
                  <TableColumnHeader>Items</TableColumnHeader>
                  <TableColumnHeader>Total</TableColumnHeader>
                  <TableColumnHeader>Status</TableColumnHeader>
                  <TableColumnHeader>Actions</TableColumnHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <VStack align="start" gap={1}>
                        <Text fontWeight="medium">{order.customerName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {order.customerEmail}
                        </Text>
                      </VStack>
                    </TableCell>
                    <TableCell>
                      <Text fontSize="sm">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </Text>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        colorScheme={
                          order.status === "paid" ? "green" : "orange"
                        }
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => openBookingModal(order)}
                        disabled={order.status !== "paid"}
                      >
                        Book Shipping
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableRoot>
          )}
        </CardBody>
      </CardRoot>

      {/* Active Shipments */}
      <CardRoot>
        <CardHeader>
          <Heading size="lg">Active Shipments</Heading>
          <Text color="gray.600">Booked shipments with tracking numbers</Text>
        </CardHeader>
        <CardBody>
          {bookings.length === 0 ? (
            <AlertRoot status="info">No active shipments found</AlertRoot>
          ) : (
            <TableRoot>
              <TableHeader>
                <TableRow>
                  <TableColumnHeader>Order ID</TableColumnHeader>
                  <TableColumnHeader>Tracking Number</TableColumnHeader>
                  <TableColumnHeader>Booking Reference</TableColumnHeader>
                  <TableColumnHeader>Cost</TableColumnHeader>
                  <TableColumnHeader>Estimated Delivery</TableColumnHeader>
                  <TableColumnHeader>Actions</TableColumnHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell>{booking.orderId}</TableCell>
                    <TableCell>
                      <Text fontFamily="mono" fontSize="sm">
                        {booking.trackingNumber}
                      </Text>
                    </TableCell>
                    <TableCell>{booking.bookingReference}</TableCell>
                    <TableCell>${booking.cost?.toFixed(2)}</TableCell>
                    <TableCell>{booking.estimatedDelivery}</TableCell>
                    <TableCell>
                      <HStack>
                        <IconButton
                          aria-label="View tracking"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/tracking?number=${booking.trackingNumber}`,
                              "_blank"
                            )
                          }
                        >
                          <FiEye />
                        </IconButton>
                        <IconButton
                          aria-label="Cancel shipment"
                          size="sm"
                          colorScheme="red"
                          onClick={() =>
                            booking.trackingNumber &&
                            cancelShipment(booking.trackingNumber)
                          }
                        >
                          <FiTrash2 />
                        </IconButton>
                      </HStack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableRoot>
          )}
        </CardBody>
      </CardRoot>

      {/* Booking Modal */}
      <DialogRoot
        open={open}
        onOpenChange={({ open }) => (open ? onOpen() : onClose())}
      >
        <DialogBackdrop />
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>Book Shipment</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <VStack gap={4} align="stretch">
                {selectedOrder && (
                  <AlertRoot status="info">
                    Booking shipment for Order #{selectedOrder.id} -{" "}
                    {selectedOrder.customerName}
                  </AlertRoot>
                )}

                <Box>
                  <Text mb={2} fontWeight="medium">
                    Service Type *
                  </Text>
                  <Controller
                    name="serviceType"
                    control={control}
                    rules={{ required: "Service type is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #E2E8F0",
                          borderRadius: "6px",
                        }}
                      >
                        <option value={ServiceType.STANDARD}>
                          Standard (5-7 days)
                        </option>
                        <option value={ServiceType.EXPRESS}>
                          Express (2-3 days)
                        </option>
                        <option value={ServiceType.OVERNIGHT}>Overnight</option>
                        <option value={ServiceType.SAME_DAY}>Same Day</option>
                      </select>
                    )}
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="medium">
                    Pickup Date (Optional)
                  </Text>
                  <Controller
                    name="pickupDate"
                    control={control}
                    render={({ field }) => <Input {...field} type="date" />}
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="medium">
                    Special Instructions
                  </Text>
                  <Controller
                    name="specialInstructions"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Any special handling instructions"
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="medium">
                    Customer Reference
                  </Text>
                  <Controller
                    name="customerReference"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Internal reference number"
                      />
                    )}
                  />
                </Box>

                <HStack>
                  <Controller
                    name="signatureRequired"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <Text>Signature Required</Text>
                </HStack>

                <HStack>
                  <Controller
                    name="insuranceRequired"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <Text>Insurance Required</Text>
                </HStack>
              </VStack>
            </DialogBody>
            <DialogFooter>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                loading={loading}
                loadingText="Booking..."
              >
                Book Shipment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
};
