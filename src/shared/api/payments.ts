import { axiosInstance } from "./instance";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  inventoryId?: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  apartment?: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
}

export interface ShippingOption {
  serviceType: string;
  cost: number;
  estimatedDays?: number;
  carrier?: string;
}

export interface CreatePaymentIntentRequest {
  items: CartItem[];
  billingAddress: BillingAddress;
  shippingAddress?: BillingAddress;
  shippingOption?: ShippingOption;
  currency?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export interface PaymentStatus {
  status: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  metadata: Record<string, unknown>;
}

export const createPaymentIntent = async (
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  const resp = await axiosInstance.post<CreatePaymentIntentResponse>("/payments/create-payment-intent", data);
  return resp.data;
};

export const getPaymentStatus = async (paymentIntentId: string): Promise<PaymentStatus> => {
  const resp = await axiosInstance.get<PaymentStatus>(`/payments/payment-intent/${paymentIntentId}`);
  return resp.data;
};
