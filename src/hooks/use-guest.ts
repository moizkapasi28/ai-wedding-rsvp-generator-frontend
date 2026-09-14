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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useUploadGuestList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // The backend only queues the import (202 + jobId) and a separate worker
    // parses the file, so poll the job until it actually finishes.
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const { data } = await guestService.uploadGuestList(id, file);
      const startedAt = Date.now();

      for (;;) {
        await sleep(1500);
        const { data: job } = await guestService.getImportStatus(data.jobId);
        if (job.state === "completed") return job.result;
        if (job.state === "failed") {
          throw new Error(job.failedReason || "Guest import failed");
        }

        // ponytail: fixed timeouts; make them configurable if huge imports legitimately run longer
        const waited = Date.now() - startedAt;
        if (job.state === "waiting" && waited > 30_000) {
          throw new Error(
            "Import is queued but nothing is processing it. Is the backend worker running?",
          );
        }
        if (waited > 5 * 60_000) {
          throw new Error(
            "Guest import is taking too long. Refresh the guest list in a bit.",
          );
        }
      }
    },
    onSuccess: (result) => {
      if (!result || result.totalProcessed === 0) {
        toast.error("No guests found in the file");
        return;
      }
      if (result.failed === 0) {
        toast.success(
          `Imported ${result.successful} guest${result.successful === 1 ? "" : "s"}`,
        );
        return;
      }
      const details = result.errors
        .slice(0, 3)
        .map((e) => `Row ${e.row}: ${e.error}`)
        .join("\n");
      toast.error(
        `Imported ${result.successful}, failed ${result.failed}.\n${details}`,
        { duration: 8000 },
      );
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to upload guest list! Please try again later",
      );
    },
    // Rows may have been partially imported even on failure/timeout
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...GUEST_QUERY_KEY] });
    },
  });
};
