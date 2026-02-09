import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { UpdateUserDto, User } from "@/shared/types/user";

export const updateUser = async (id: string, dto: UpdateUserDto) => {
  const { data } = await axios.patch<User>(`/api/users/${id}`, dto, {
    withCredentials: true,
  });
  return data;
};

export const useUpdateUserMutation = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => updateUser(id, dto),
    onSuccess: (data) => {
      // update cache for me
      qc.setQueryData(["me"], data);
    },
  });
};
