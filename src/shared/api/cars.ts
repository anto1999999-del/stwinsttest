export interface FetchCarsParams {
  page?: number;
  pageSize?: number;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  q?: string | null;
}

import { axiosInstance } from "./instance";

export const fetchCars = async (params: FetchCarsParams = {}) => {
  const { page = 1, pageSize = 20, make, model, year, q } = params;
  const axiosParams: Record<string, unknown> = {
    page,
    pageSize,
  };
  if (make) axiosParams.make = make;
  if (model) axiosParams.model = model;
  if (typeof year === "number") axiosParams.year = year;
  if (q) axiosParams.q = q;

  try {
    const res = await axiosInstance.get("/cars", { params: axiosParams });
    return res.data;
  } catch (err: unknown) {
    // preserve error message when possible
    let message = "Failed to fetch cars";
    if (err && typeof err === "object" && "message" in err) {
      const m = (err as { message?: unknown }).message;
      if (typeof m === "string") message = m;
    }
    throw new Error(message);
  }
};

export const fetchSingleCar = async (cid: string) => {
  try {
    const res = await axiosInstance.get(`/cars/${cid}`);
    return res.data;
  } catch (err: unknown) {
    // preserve error message when possible
    let message = "Failed to fetch car details";
    if (err && typeof err === "object" && "message" in err) {
      const m = (err as { message?: unknown }).message;
      if (typeof m === "string") message = m;
    }
    throw new Error(message);
  }
};
