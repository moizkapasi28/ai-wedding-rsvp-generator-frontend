import { pageSettingService } from "@/api/pageSetting.service";
import { generalService } from "@/api/general.service";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

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
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      pageSettingService.updateGuestEventInviteFormat(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...PAGE_SETTING_QUERY_KEY] });
      toast.success(response?.message || "Settings updated successfully");
    },
    onError: (error: any) => {
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
    onError: (error: any) => {
      toast.error(
        error.message || "Failed to generate upload URL. Please try again.",
      );
    },
  });
};

export const useGenerateViewUrl = () => {
  return useMutation({
    mutationFn: async (objectKey: string) =>
      generalService.generateViewUrl(objectKey),
    onError: (error: any) => {
      console.error("Failed to generate view URL:", error);
    },
  });
};

export const useGenerateImage = () => {
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
    onError: (error: any) => {
      toast.error(
        error.message || "Failed to generate image. Please try again.",
      );
    },
  });
};

// Cached signed view URL for an object key. Keyed by the key itself, so switching
// events never shows a stale/out-of-order image the way a mutation in an effect can.
export const useGetViewUrl = (objectKey: string | null | undefined) => {
  return useQuery({
    queryKey: ["view-url", objectKey],
    queryFn: () => generalService.generateViewUrl(objectKey as string),
    enabled: !!objectKey,
    // ponytail: assumes signed URLs live longer than 5 min; tie to real expiry if shorter
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data?.url ?? null,
  });
};
