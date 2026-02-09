// /root/s-twins/s-twins-web/src/shared/api/parts.ts
import { axiosInstance } from "./instance";

export type Part = {
  id: string;
  title: string;
  price: string;
  year: string;
  model: string | null;
  stock: string;
  description: string;
  image: string;
  inventoryId?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  category: string;
};

export type PartsResponse = {
  cars: Part[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    count: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type PartsQuery = {
  year?: string | number;
  make?: string;
  model?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  q?: string;
};

export type PartQuotePayload = {
  name: string;
  email: string;
  phone?: string;
  suburb?: string;
  postcode?: string;
  make?: string;
  model?: string;
  year?: string | number;
  part?: string;
  notes?: string;
};

// ---- Make Offer ----
export interface MakeOfferDto {
  inventoryId?: string;
  askingPrice?: number;
  offerPrice: number;
  name: string;
  email: string;
  message?: string;
  recaptchaToken: string;
}

export interface MakeOfferResponse {
  success: boolean;
  id?: string;          // wp_comments.comment_ID as string
  message?: string;
  error?: string;
}

export const submitOffer = async (
  partId: string | number,
  dto: MakeOfferDto
): Promise<MakeOfferResponse> => {
  const { data } = await axiosInstance.post(`/parts/${partId}/offer`, dto);
  return data as MakeOfferResponse;
};


const num = (v: unknown): number | undefined => {
  const n = typeof v === "number" ? v : Number(v as unknown);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const str = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return "";
  return String(v);
};

type RawPart = Record<string, unknown>;

const normalizePart = (raw: unknown): Part => {
  const r = (raw ?? {}) as RawPart;

  const p: Part = {
    id: str(r.id),
    title: str(r.title || r.name),
    price: str(r.price || "0"),
    year: str(r.year),
    model: (typeof r.model === "string" ? r.model : null),
    stock: str(r.stock),
    description: str(r.description),
    image: str(r.image),
    inventoryId: typeof r.inventoryId === "string"
      ? r.inventoryId
      : (typeof r.inventory_id === "string" ? r.inventory_id : undefined),
    weight: num(r.weight),
    length: num(r.length),
    width:  num(r.width),
    height: num(r.height),
    category: str(r.category), // always a string
  };

  if (!p.category) {
    console.log("[parts:normalize] missing category, defaulting to empty string", {
      id: p.id, title: p.title
    });
  }

  return p;
};

export const fetchParts = async (
  params: PartsQuery = {}
): Promise<PartsResponse> => {
  const response = await axiosInstance.get("/parts", { params });
  const data = response.data;

  // Normalize raw items
  const rawCars = Array.isArray(data?.cars)
    ? data.cars.map(normalizePart)
    : [];

  // 🔧 De-duplicate by `id` to avoid React key collisions
  const seen = new Set<string>();
  const cars: Part[] = [];
  for (const car of rawCars) {
    if (!car?.id) continue;
    if (seen.has(car.id)) continue;
    seen.add(car.id);
    cars.push(car);
  }

  return { ...data, cars };
};

export const fetchSinglePart = async (partId: string): Promise<Part> => {
  try {
    const response = await axiosInstance.get(`/parts/${partId}`);
    return normalizePart(response.data);
  } catch (err: unknown) {
    // preserve error message when possible
    let message = "Failed to fetch part details";
    if (err && typeof err === "object" && "message" in err) {
      const m = (err as { message?: unknown }).message;
      if (typeof m === "string") message = m;
    }
    throw new Error(message);
  }
};

export const submitPartQuote = async (payload: PartQuotePayload) => {
  const { data } = await axiosInstance.post("/parts/quote-request", payload);
  return data;
};
