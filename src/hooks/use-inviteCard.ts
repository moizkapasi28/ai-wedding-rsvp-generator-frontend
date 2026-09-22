import {
  type QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { inviteCardService } from "@/api/inviteCard.service";
import { IN_FLIGHT_GENERATION_STATUSES } from "@/models/inviteCard.model";
import toast from "react-hot-toast";
import { PAGE_SETTING_QUERY_KEY } from "./use-pageSetting";

export const INVITE_CARD_QUERY_KEY = ["invite-card"] as const;

// Guest Preview reads each event's card through the page-settings query, not
// this one, so anything that changes a card has to refresh both or the preview
// keeps showing the old card.
export const invalidateInviteCards = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: [...INVITE_CARD_QUERY_KEY] }),
    queryClient.invalidateQueries({ queryKey: [...PAGE_SETTING_QUERY_KEY] }),
  ]);

export const useGetInviteCardsByWeddingInfinite = (
  weddingId: string | null,
) => {
  return useInfiniteQuery({
    queryKey: [...INVITE_CARD_QUERY_KEY, "cards", "infinite", weddingId],
    queryFn: ({ pageParam = 1 }) =>
      inviteCardService.getInviteCardsByWedding(
        weddingId as string,
        pageParam as number,
      ),
    initialPageParam: 1,
    enabled: !!weddingId,
    getNextPageParam: (lastPage) => {
      const data = lastPage.data;
      if (!data) return undefined;
      return data.currentPage < data.totalPages
        ? data.currentPage + 1
        : undefined;
    },
  });
};

// Polls while the worker is generating, so a long design survives a page reload
// instead of living only in this tab's in-flight request.
export const useInviteCardGenerationStatus = (
  inviteCardId: string | null,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: [
      ...INVITE_CARD_QUERY_KEY,
      "generation-status",
      inviteCardId,
    ],
    queryFn: () =>
      inviteCardService.getGenerationStatus(inviteCardId as string),
    enabled: !!inviteCardId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status && IN_FLIGHT_GENERATION_STATUSES.includes(status)
        ? 3000
        : false;
    },
  });
};

export const useUpdateInviteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => inviteCardService.updateInviteCard(id, data),
    onSuccess: (response) => {
      invalidateInviteCards(queryClient);
      toast.success(
        response?.message || "Invite Card configuration saved successfully",
      );
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "Failed to save configuration. Please try again later.",
      );
    },
  });
};
