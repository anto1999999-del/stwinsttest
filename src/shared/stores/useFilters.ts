import { useQuery } from "@tanstack/react-query";
import { fetchFilters } from "../api/filters";

export const useFilters = () => {
  return useQuery({
    queryKey: ["filters"],
    queryFn: fetchFilters,
  });
};
