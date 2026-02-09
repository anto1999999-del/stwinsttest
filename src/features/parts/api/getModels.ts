import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/shared/api";

export type ModelItem = {
  id: number;
  model_id: number;
  make: string;
  model: string;
  count: number;
};

const getModels = async (make: string): Promise<ModelItem[]> => {
  const { data } = await axiosInstance.get<ModelItem[]>("/collections/models", {
    params: { make },
  });
  return data;
};

export const useModelsQuery = (make: string | null) =>
  useQuery({
    queryKey: ["collections", "models", make],
    queryFn: () => getModels(make as string),
    enabled: Boolean(make),
    staleTime: 1000 * 60 * 60, // 1h
  });
