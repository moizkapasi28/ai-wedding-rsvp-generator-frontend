import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { weddingService } from "@/api/wedding.service";
import type { WeddingFormValues } from "@/validations/wedding.validation";
import toast from "react-hot-toast";

const WEDDING_QUERY_KEY = ["weddings", "weddings-stats"] as const;

export const useGetWeddings = (
  page: number,
  limit: number = 10,
  search: string = "",
  filter: string[] = [],
  sortBy: string = "",
  sortOrder: string = "",
) => {
  return useQuery({
    queryKey: [
      ...WEDDING_QUERY_KEY,
      page,
      limit,
      search,
      ...filter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      weddingService.getWeddings(
        page,
        limit,
        false,
        search,
        filter,
        sortBy,
        sortOrder,
      ),
  });
};

export const useGetWeddingsInfinite = (
  limit: number = 20,
  search: string = "",
  filter: string[] = [],
  sortBy: string = "",
  sortOrder: string = "",
) => {
  return useInfiniteQuery({
    queryKey: [
      ...WEDDING_QUERY_KEY,
      "infinite",
      limit,
      search,
      ...filter,
      sortBy,
      sortOrder,
    ],
    queryFn: ({ pageParam = 1 }) =>
      weddingService.getWeddings(
        pageParam as number,
        limit,
        false,
        search,
        filter,
        sortBy,
        sortOrder,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const data = lastPage.data;
      if (!data) return undefined;
      return data.currentPage < data.totalPages
        ? data.currentPage + 1
        : undefined;
    },
  });
};

export const useGetWeddingsWithStats = (
  page: number,
  limit: number = 10,
  stats: boolean = false,
  search: string = "",
  filter: string[] = [],
  sortBy: string = "",
  sortOrder: string = "",
) => {
  return useQuery({
    queryKey: [
      ...WEDDING_QUERY_KEY,
      page,
      limit,
      stats,
      search,
      ...filter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      weddingService.getWeddings(
        page,
        limit,
        stats,
        search,
        filter,
        sortBy,
        sortOrder,
      ),
  });
};

export const useCreateWedding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WeddingFormValues) =>
      weddingService.createWedding(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...WEDDING_QUERY_KEY] });

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
      queryClient.invalidateQueries({ queryKey: [...WEDDING_QUERY_KEY] });

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
      queryClient.invalidateQueries({ queryKey: [...WEDDING_QUERY_KEY] });

      toast.success(response.message || "Wedding Deleted Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};
