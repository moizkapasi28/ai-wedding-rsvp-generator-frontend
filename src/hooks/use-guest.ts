import { guestService } from "@/api/guest.service";
import type { GuestFormValues } from "@/validations/guest.validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const GUEST_QUERY_KEY = ["guests"] as const;

export const useGetGuests = (
  weddingId: string | null,
  page: number,
  limit: number = 10,
  search: string,
  events: string[] = [],
  sides: string[] = [],
  groups: string[] = [],
) => {
  return useQuery({
    queryKey: [
      ...GUEST_QUERY_KEY,
      page,
      limit,
      weddingId,
      search,
      events,
      sides,
      groups,
    ],
    queryFn: () =>
      guestService.getGuests(
        weddingId,
        page,
        limit,
        search,
        events,
        sides,
        groups,
      ),
  });
};

export const useCreateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GuestFormValues) => guestService.addGuest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...GUEST_QUERY_KEY] });

      toast.success(response.message || "New Guest Created Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useGetGuest = (id: string) => {
  return useQuery({
    queryKey: [...GUEST_QUERY_KEY, id],
    queryFn: () => guestService.getGuest(id),
  });
};

export const useUpdateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GuestFormValues & { id: string }) =>
      guestService.updateGuest(data, data.id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...GUEST_QUERY_KEY] });

      toast.success(response.message || "Guest Updated Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useDeleteGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => guestService.deleteGuest(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...GUEST_QUERY_KEY] });

      toast.success(response.message || "Guest Deleted Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: async (weddingId: string) =>
      guestService.downloadGuestListtemplate(weddingId),
    onSuccess: () => {
      toast.success("Template downloaded successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error.message || "Failed to download template! Please try again later",
      );
    },
  });
};

export const useExportGuestList = () => {
  return useMutation({
    mutationFn: async ({
      weddingId,
      search,
      events,
      sides,
      groups,
    }: {
      weddingId: string;
      search?: string;
      events?: string[];
      sides?: string[];
      groups?: string[];
    }) =>
      guestService.exportGuestList(weddingId, search, events, sides, groups),
    onSuccess: () => {
      toast.success("Guest list exported successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to export guest list! Please try again later",
      );
    },
  });
};

export const useUploadGuestList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) =>
      guestService.uploadGuestList(id, file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...GUEST_QUERY_KEY] });
      toast.success(response?.message || "Guest list uploaded successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to upload guest list! Please try again later",
      );
    },
  });
};
