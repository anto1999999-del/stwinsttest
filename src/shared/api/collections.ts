import { axiosInstance } from "./instance";

export const fetchMakes = async () => {
  const response = await axiosInstance.get("/collections/makes");
  return response.data;
};

export const fetchModels = async (make: string) => {
  const response = await axiosInstance.get(`/collections/models`, {
    params: { make },
  });
  return response.data;
};
