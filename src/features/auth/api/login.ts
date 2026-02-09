// axiosInstance not used here because we call Next.js route handlers
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginUser = {
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

export type LoginResponse = {
  user: LoginUser;
};

type ApiErrorBody = { message?: string } | undefined;

const login = async (payload: LoginPayload) => {
  // Call the Next.js route handler; it will set secure httpOnly cookies
  const { data } = await axios.post<LoginResponse>("/api/auth/login", payload);
  return data;
};

export const useLoginMutation = () =>
  useMutation<LoginResponse, AxiosError<ApiErrorBody>, LoginPayload>({
    mutationFn: login,
    meta: {
      successMessage: "Logged in successfully",
      errorMessage: (error: AxiosError<ApiErrorBody>) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) return "Invalid credentials";
        return error.response?.data?.message || "Login failed";
      },
    },
  });
