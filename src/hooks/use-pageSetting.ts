import { pageSettingService } from "@/api/pageSetting.service";
import {
  generalService,
  type GenerateViewUrlResponse,
} from "@/api/general.service";
import { viewUrlFreshMs } from "@/lib/viewUrl";
import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { USER_PROFILE_QUERY_KEY } from "@/hooks/use-auth";

export const PAGE_SETTING_QUERY_KEY = ["page-setting"] as const;

export const useGetGuestEventInviteFormatsInfinite = (
  weddingId: string | null,
  limit: number = 5,
) => {
  return useInfiniteQuery({
    queryKey: [
      ...PAGE_SETTING_QUERY_KEY,
      "invite-formats",
      "infinite",
      weddingId,
      limit,
    ],
    queryFn: ({ pageParam = 1 }) =>
      pageSettingService.getGuestEventInviteFormatsByWedding(
        weddingId as string,
        pageParam as number,
        limit,
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

export const useUpdateGuestEventInviteFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      pageSettingService.updateGuestEventInviteFormat(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...PAGE_SETTING_QUERY_KEY] });
      toast.success(response?.message || "Settings updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useGenerateUploadUrl = () => {
  return useMutation({
    mutationFn: async ({
      objectKey,
      mimeType,
    }: {
      objectKey: string;
      mimeType: string;
    }) => generalService.generateUploadUrl(objectKey, mimeType),
    onError: (error) => {
      toast.error(
        error.message || "Failed to generate upload URL. Please try again.",
      );
    },
  });
};

export const useGenerateImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      rawImageKey: string;
      eventId: string;
      illustrationTheme?: string;
      illustrationStyle: string;
      photoType: string;
      brideAttireId?: string;
      groomAttireId?: string;
      attireId?: string;
      customStyleNote?: string;
    }) => pageSettingService.generateImage(
      payload.rawImageKey, 
      payload.eventId, 
      payload.illustrationTheme,
      payload.illustrationStyle,
      payload.photoType,
      payload.brideAttireId,
      payload.groomAttireId,
      payload.attireId,
      payload.customStyleNote
    ),
    // Charged on success, refunded on failure: either way the balance moved
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [...USER_PROFILE_QUERY_KEY] }),
    onError: (error) => {
      toast.error(
        error.message || "Failed to generate image. Please try again.",
      );
    },
  });
};

const viewUrlFreshFor = (query: {
  state: { data?: GenerateViewUrlResponse; dataUpdatedAt: number };
}) => viewUrlFreshMs(query.state.data?.data?.expires_at, query.state.dataUpdatedAt);

// Separate from the hook so the refresh rules can be driven without rendering a component
export const viewUrlQueryOptions = (objectKey: string | null | undefined) =>
  queryOptions({
    queryKey: ["view-url", objectKey],
    queryFn: () => generalService.generateViewUrl(objectKey as string),
    enabled: !!objectKey,
    // Signed URLs expire. The cached one is reused only until shortly before the API says it
    // stops working, and an image that stays on screen gets a new one on the same schedule,
    // so a later re-render never points at a dead link.
    staleTime: viewUrlFreshFor,
    refetchInterval: (query) =>
      query.state.data ? viewUrlFreshFor(query) : false,
    select: (res) => res.data?.url ?? null,
  });

// Cached signed view URL for an object key. Keyed by the key itself, so switching
// events never shows a stale/out-of-order image the way a mutation in an effect can.
export const useGetViewUrl = (objectKey: string | null | undefined) =>
  useQuery(viewUrlQueryOptions(objectKey));
