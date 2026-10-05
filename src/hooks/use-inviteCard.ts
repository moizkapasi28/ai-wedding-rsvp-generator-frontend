import {
  type QueryClient,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiRequestError } from "@/api/api.service";
import { inviteCardService } from "@/api/inviteCard.service";
import { generationPollDelay } from "@/lib/generationPolling";
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

// When the API's rate limiter turned the last status poll away, how long it asked us to wait
const RATE_LIMIT_FALLBACK_SECONDS = 60;
const rateLimitedFor = (error: ApiRequestError | null) =>
  error?.status === 429
    ? (error.retryAfter ?? RATE_LIMIT_FALLBACK_SECONDS)
    : undefined;

// Separate from the hook so the polling rules can be driven without rendering a component
export const inviteCardGenerationStatusOptions = (
  inviteCardId: string | null,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: [...INVITE_CARD_QUERY_KEY, "generation-status", inviteCardId],
    queryFn: () =>
      inviteCardService.getGenerationStatus(inviteCardId as string),
    enabled: !!inviteCardId && enabled,
    // A 429 is answered by waiting (below), not by asking again a second later
    retry: (failureCount, error: ApiRequestError) =>
      error.status !== 429 && failureCount < 1,
    refetchInterval: (query) => {
      const retryAfter = rateLimitedFor(query.state.error);
      const card = query.state.data?.data;
      const inFlight =
        !!card && IN_FLIGHT_GENERATION_STATUSES.includes(card.status);

      // The last known status stays in the cache through a failed poll, so a rate-limited
      // run keeps being watched; one that was limited before any status arrived does too
      if (!inFlight && !(retryAfter !== undefined && !card)) return false;

      return generationPollDelay(card?.started_at, Date.now(), retryAfter);
    },
  });

// Polls while the worker is generating, so a long design survives a page reload
// instead of living only in this tab's in-flight request.
export const useInviteCardGenerationStatus = (
  inviteCardId: string | null,
  enabled: boolean,
) => useQuery(inviteCardGenerationStatusOptions(inviteCardId, enabled));

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
