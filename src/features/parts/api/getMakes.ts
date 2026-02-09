import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/shared/api";

export type MakeItem = {
  make: string;
  count: number;
};

const getMakes = async (): Promise<MakeItem[]> => {
  const { data } = await axiosInstance.get<MakeItem[]>("/collections/makes");
  return data;
};

export const useMakesQuery = () =>
  useQuery({
    queryKey: ["collections", "makes"],
    queryFn: getMakes,
    staleTime: 1000 * 60 * 60, // 1h
  });
