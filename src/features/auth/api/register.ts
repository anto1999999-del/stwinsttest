import { axiosInstance } from "@/shared/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type RegisterPayload = {
  username: string;
  email: string;
  displayName: string;
  password: string;
};

export type RegisterResponse = {
  ID: string;
  user_login: string;
  user_nicename: string;
  user_email: string;
  user_url: string;
  user_registered: unknown;
  user_activation_key: string;
  user_status: number;
  display_name: string;
};

type ApiErrorBody = { message?: string } | undefined;

const register = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post<RegisterResponse>(
    "/auth/register",
    payload
  );
  return data;
};

export const useRegisterMutation = () =>
  useMutation<RegisterResponse, AxiosError<ApiErrorBody>, RegisterPayload>({
    mutationFn: register,
    meta: {
      successMessage: "Account created. You can now log in.",
      errorMessage: (error: AxiosError<ApiErrorBody>) =>
        error.response?.data?.message || "Registration failed",
    },
  });
