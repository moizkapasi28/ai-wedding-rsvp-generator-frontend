import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { weddingService } from "@/api/wedding.service";
import type { WeddingFormValues } from "@/validations/wedding.validation";
import toast from "react-hot-toast";

const WEDDING_QUERY_KEY = ["weddings"] as const;
const WEDDING_STATS_QUERY_KEY = ["weddings-stats"] as const;

export const useGetWeddings = (page: number, limit: number = 10) => {
  return useQuery({
    queryKey: [WEDDING_QUERY_KEY, page, limit],
    queryFn: () => weddingService.getWeddings(page, limit),
  });
};

export const useGetWeddingsWithStats = (
  page: number,
  limit: number = 10,
  stats: boolean = false,
) => {
  return useQuery({
    queryKey: [WEDDING_STATS_QUERY_KEY, page, limit, stats],
    queryFn: () => weddingService.getWeddings(page, limit, stats),
  });
};

export const useCreateWedding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WeddingFormValues) =>
      weddingService.createWedding(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [WEDDING_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WEDDING_STATS_QUERY_KEY] });

      toast.success(response.message || "New Wedding Created Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useUpdatWedding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WeddingFormValues & { id: string }) =>
      weddingService.updateWedding(data, data.id),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [WEDDING_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WEDDING_STATS_QUERY_KEY] });

      toast.success(response.message || "New Wedding Updated Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useDeleteWedding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => weddingService.deleteWedding(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [WEDDING_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WEDDING_STATS_QUERY_KEY] });

      toast.success(response.message || "Wedding Deleted Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};
