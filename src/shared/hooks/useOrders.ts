// src/shared/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  // ⬇️ switch to admin-backed functions (they should call /api/admin/orders)
  getAllOrdersAdmin as getAllOrders,
  getOrdersByStatusAdmin as getOrdersByStatus,
  updateOrderStatusAdmin as updateOrderStatus,
  updateOrderShippingAdmin as updateOrderShipping,
  updateOrderAdmin as updateOrder,
  Order,
  OrdersResponse,
} from "../api/orders";

// (rest of the file unchanged)
export const useOrders = (page: number = 1, limit: number = 50) => {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", page, limit],
    queryFn: () => getAllOrders(page, limit),
  });
};

export const useOrdersByStatus = (
  status: string,
  page: number = 1,
  limit: number = 50
) => {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", "status", status, page, limit],
    queryFn: () => getOrdersByStatus(status, page, limit),
    enabled: !!status,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      paymentIntentId,
      status,
    }: {
      paymentIntentId: string;
      status: string;
    }) => updateOrderStatus(paymentIntentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderShipping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      paymentIntentId,
      shippingDetails,
    }: {
      paymentIntentId: string;
      shippingDetails: {
        address?: string;
        method?: string;
        cost?: number;
        service?: string;
        carrier?: string;
        trackingNumber?: string;
      };
    }) => updateOrderShipping(paymentIntentId, shippingDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      paymentIntentId,
      updateData,
    }: {
      paymentIntentId: string;
      updateData: Partial<Order>;
    }) => updateOrder(paymentIntentId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
