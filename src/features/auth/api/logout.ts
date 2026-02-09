import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type LogoutResponse = { success: boolean };

const logout = async () => {
  const { data } = await axios.post<LogoutResponse>("/api/auth/logout");
  return data;
};

export const useLogoutMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    meta: { successMessage: "Logged out" },
  });
};
