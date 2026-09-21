import {
  type QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { aiInviteCardService } from "@/api/aiInviteCard.service";
import { IN_FLIGHT_GENERATION_STATUSES } from "@/models/aiInviteCard.model";
import toast from "react-hot-toast";
import { PAGE_SETTING_QUERY_KEY } from "./use-pageSetting";

export const AI_INVITE_CARD_QUERY_KEY = ["ai-invite-card"] as const;

// Guest Preview reads each event's card through the page-settings query, not
// this one, so anything that changes a card has to refresh both or the preview
// keeps showing the old card.
export const invalidateInviteCards = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: [...AI_INVITE_CARD_QUERY_KEY] }),
    queryClient.invalidateQueries({ queryKey: [...PAGE_SETTING_QUERY_KEY] }),
  ]);

export const useGetAiInviteCardsByWeddingInfinite = (
  weddingId: string | null,
) => {
  return useInfiniteQuery({
    queryKey: [...AI_INVITE_CARD_QUERY_KEY, "cards", "infinite", weddingId],
    queryFn: ({ pageParam = 1 }) =>
      aiInviteCardService.getAiInviteCardsByWedding(
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
export const useAiInviteCardGenerationStatus = (
  aiInviteCardId: string | null,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: [
      ...AI_INVITE_CARD_QUERY_KEY,
      "generation-status",
      aiInviteCardId,
    ],
    queryFn: () =>
      aiInviteCardService.getGenerationStatus(aiInviteCardId as string),
    enabled: !!aiInviteCardId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status && IN_FLIGHT_GENERATION_STATUSES.includes(status)
        ? 3000
        : false;
    },
  });
};

export const useUpdateAiInviteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => aiInviteCardService.updateAiInviteCard(id, data),
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
