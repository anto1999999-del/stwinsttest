// /root/s-twins/s-twins-web/src/shared/stores/usePartsQuery.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchParts, type PartsQuery, type PartsResponse } from "../api/parts";

export const usePartsQuery = (params: PartsQuery) => {
  const { page = 1, pageSize = 20, year, make, model, category, q } = params;

  return useQuery<PartsResponse, Error>({
    // Use an object segment in the key to avoid positional mistakes and to be explicit
    queryKey: [
      "parts",
      {
        page,
        pageSize,
        year: year ?? null,
        make: make ?? null,
        model: model ?? null,
        category: category ?? null,
        q: q ?? null,
      },
    ] as const,
    queryFn: () => fetchParts(params),
    // v5 replacement for keepPreviousData: keeps prior page data while new data loads
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 30_000,
  });
};
