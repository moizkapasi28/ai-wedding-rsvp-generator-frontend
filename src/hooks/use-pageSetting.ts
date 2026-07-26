import { pageSettingService } from "@/api/pageSetting.service";
import { generalService } from "@/api/general.service";
import {
  useInfiniteQuery,
  useMutation,
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
    mutationFn: async ({
      rawImageKey,
      eventId,
      theme,
    }: {
      eventId: string;
      rawImageKey: string;
      theme: string;
    }) => pageSettingService.generateImage(rawImageKey, eventId, theme),
    onError: (error: any) => {
      toast.error(
        error.message || "Failed to generate image. Please try again.",
      );
    },
  });
};
