import { eventService } from "@/api/event.service";
import type { EventFormValues } from "@/validations/event.validation";
import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EVENT_QUERY_KEY = ["events"] as const;

export const useGetEventsWithStats = (
  weddingId: string | null,
  page: number,
  limit: number = 10,
  stats: boolean = false,
) => {
  return useQuery({
    queryKey: [...EVENT_QUERY_KEY, weddingId, page, limit],
    queryFn: () =>
      eventService.getEvents(weddingId as string, page, limit, stats),
    enabled: !!weddingId,
  });
};

export const useGetEventsWithStatsInfinite = (
  weddingId: string | null,
  limit: number = 20,
  stats: boolean = false,
) => {
  return useInfiniteQuery({
    queryKey: [...EVENT_QUERY_KEY, "infinite", weddingId, limit, stats],
    queryFn: ({ pageParam = 1 }) =>
      eventService.getEvents(weddingId as string, pageParam as number, limit, stats),
    initialPageParam: 1,
    enabled: !!weddingId,
    getNextPageParam: (lastPage) => {
      const data = lastPage.data;
      if (!data) return undefined;
      return data.currentPage < data.totalPages ? data.currentPage + 1 : undefined;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EventFormValues) => eventService.createEvent(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...EVENT_QUERY_KEY] });
      toast.success(response.message || "New Event Created Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useUpdatEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EventFormValues & { id: string }) =>
      eventService.updateEvent(data, data.id),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...EVENT_QUERY_KEY] });

      toast.success(response.message || "New Wedding Updated Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => eventService.deleteEvent(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...EVENT_QUERY_KEY] });

      toast.success(response.message || "Wedding Deleted Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};
