import { axiosInstance } from "./instance";

export const fetchFilters = async () => {
  const response = await axiosInstance.get("/filters");
  return response.data;
};
