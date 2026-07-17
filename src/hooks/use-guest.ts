import { guestService } from "@/api/guest.service";
import type { GuestFormValues } from "@/validations/guest.validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const GUEST_QUERY_KEY = ["guests"] as const;

export const useGetGuests = (
  weddingId: string | null,
  page: number,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: [...GUEST_QUERY_KEY, page, limit, weddingId],
    queryFn: () => guestService.getGuests(weddingId, page, limit),
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
