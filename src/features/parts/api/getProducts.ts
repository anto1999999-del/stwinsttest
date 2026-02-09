import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/shared/api";

export type ProductItem = {
  a_id: number;
  ID: number;
  name: string;
  make: string;
  prod_cat: string;
  year: number;
  longIcYear?: string;
  model_id: number;
  model: string;
  tag: string;
  stockNo: string;
  images: number;
  added: number;
  purchased: number;
  date: Record<string, unknown>;
};

export type ProductsResponse = {
  items: ProductItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
    hasPrev: boolean;
    hasNext: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
};

type GetProductsParams = {
  model_id?: number;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const getProducts = async (
  params: GetProductsParams
): Promise<ProductsResponse> => {
  const { data } = await axiosInstance.get<ProductsResponse>("/products", {
    params,
  });
  return data;
};

export const useProductsQuery = (
  model_id: number | null,
  page: number,
  pageSize: number,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc"
) =>
  useQuery({
    queryKey: ["products", { model_id, page, pageSize, sortBy, sortOrder }],
    queryFn: () =>
      getProducts(
        model_id != null
          ? { model_id, page, pageSize }
          : { page, pageSize, sortBy, sortOrder }
      ),
    enabled: true,
    placeholderData: keepPreviousData,
  });
