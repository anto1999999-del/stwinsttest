// /root/s-twins/s-twins-web/src/shared/hooks/useOffers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  OfferItem,
  OffersListParams,
  OffersListResponse,
  ReplyOfferDto,
} from "../api/admin";

export const useOffers = (params: OffersListParams) => {
  return useQuery<OffersListResponse>({
    queryKey: ["offers", params],
    queryFn: () => adminApi.offers.list(params),
  });
};

export const useReplyToOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string } & ReplyOfferDto) =>
      adminApi.offers.reply(payload.id, {
        accept: payload.accept,
        message: payload.message,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.offers.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};
