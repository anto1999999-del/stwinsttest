import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type MeResponse = {
  ID: string;
  user_login: string;
  user_nicename: string;
  user_email: string;
  user_url: string;
  user_registered: unknown;
  user_activation_key: string;
  user_status: number;
  display_name: string;
  user_address?: string | null;
};

export const fetchMe = async () => {
  const { data } = await axios.get<MeResponse>("/api/auth/me", {
    withCredentials: true,
  });
  return data;
};

export const useMeQuery = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 1000 * 30,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401)
        return false;
      return failureCount < 2;
    },
  });
