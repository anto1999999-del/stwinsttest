import { axiosInstance } from "./instance";

export interface ShippingItem {
  weight: number;
  length: number;
  width: number;
  height: number;
  quantity: number;
  description?: string;
}

export interface ShippingAddress {
  name: string;
  company?: string;
  streetAddress: string;
  apartment?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

export enum ServiceType {
  STANDARD = "standard",
  EXPRESS = "express",
  OVERNIGHT = "overnight",
  SAME_DAY = "same_day",
}

export interface ShippingRate {
  serviceType: string;
  serviceName: string;
  cost: number;
  currency: string;
  estimatedDays: number;
  carrier: string;
  breakdown?: {
    totalFreightCharge: number;
    onForwardCharge: number;
    fuelLevyCharge: number;
    gst: number;
  };
}

export interface ShippingQuote {
  rates: ShippingRate[];
  origin: ShippingAddress;
  destination: ShippingAddress;
  totalWeight: number;
  totalVolume: number;
}

export interface CalculateShippingRequest {
  origin: ShippingAddress;
  destination: ShippingAddress;
  items: ShippingItem[];
  serviceType?: ServiceType;
  currency?: string;
}

export interface BookShipmentRequest {
  sender: ShippingAddress;
  recipient: ShippingAddress;
  items: ShippingItem[];
  serviceType: ServiceType;
  pickupDate?: string;
  specialInstructions?: string;
  customerReference?: string;
  signatureRequired?: boolean;
  insuranceRequired?: boolean;
  insuranceValue?: string;
}

export interface BookingResponse {
  success: boolean;
  trackingNumber?: string;
  bookingReference?: string;
  labels?: string[];
  estimatedDelivery?: string;
  cost?: number;
  error?: string;
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface TrackingResponse {
  success: boolean;
  trackingNumber: string;
  status: string;
  events: TrackingEvent[];
  estimatedDelivery?: string;
  error?: string;
}

export interface ServiceTypeOption {
  serviceType: string;
  name: string;
  description: string;
}

/** Typed error (no `any`) your UI can detect via `.code` */
export type ShippingClientErrorCode = "MISSING_DIMENSIONS";

export class ShippingClientError extends Error {
  public readonly code: ShippingClientErrorCode;

  constructor(message: string, code: ShippingClientErrorCode) {
    super(message);
    this.name = "ShippingClientError";
    this.code = code;
  }
}

function hasMissingDims(i: ShippingItem): boolean {
  const n = (v: unknown) => Number(v);
  return (
    !isFinite(n(i.weight)) || n(i.weight) <= 0 ||
    !isFinite(n(i.length)) || n(i.length) <= 0 ||
    !isFinite(n(i.width))  || n(i.width)  <= 0 ||
    !isFinite(n(i.height)) || n(i.height) <= 0
  );
}

export const shippingApi = {
  calculateRates: async (data: CalculateShippingRequest): Promise<ShippingQuote> => {
    const bad = data.items.find(hasMissingDims);
    if (bad) {
      const name = bad.description ?? "one of your items";
      throw new ShippingClientError(
        `${name} is missing weight and/or dimensions. We can't calculate shipping yet.`,
        "MISSING_DIMENSIONS"
      );
    }

    const response = await axiosInstance.post("/shipping/calculate-rates", data);
    return response.data;
  },

  bookShipment: async (data: BookShipmentRequest): Promise<BookingResponse> => {
    const response = await axiosInstance.post("/shipping/book", data);
    return response.data;
  },

  trackShipment: async (trackingNumber: string): Promise<TrackingResponse> => {
    const response = await axiosInstance.get(`/shipping/track/${trackingNumber}`);
    return response.data;
  },

  getServiceTypes: async (): Promise<ServiceTypeOption[]> => {
    const response = await axiosInstance.get("/shipping/services");
    return response.data;
  },

  cancelShipment: async (trackingNumber: string): Promise<{ success: boolean; message?: string }> => {
    const response = await axiosInstance.delete(`/shipping/cancel/${trackingNumber}`);
    return response.data;
  },
};
