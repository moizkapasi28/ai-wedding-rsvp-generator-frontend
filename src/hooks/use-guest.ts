import { guestService } from "@/api/guest.service";
import type {
  GuestImportResult,
  InviteSentFilter,
  ReminderKind,
} from "@/models/guest.model";
import type { GuestFormValues } from "@/validations/guest.validation";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { createElement } from "react";
import toast from "react-hot-toast";
import UndoToast from "@/components/UndoToast";
import { EVENT_QUERY_KEY } from "./use-event";
import { PAGE_SETTING_QUERY_KEY } from "./use-pageSetting";

export const GUEST_QUERY_KEY = ["guests"] as const;
export const REMINDERS_QUERY_KEY = ["reminders"] as const;

// Guest counts/RSVP stats also show on page settings, event cards and the dashboard
export const invalidateGuestData = (queryClient: QueryClient) =>
  Promise.all(
    [
      GUEST_QUERY_KEY,
      PAGE_SETTING_QUERY_KEY,
      EVENT_QUERY_KEY,
      ["wedding-dashboard"],
    ].map((queryKey) =>
      queryClient.invalidateQueries({ queryKey: [...queryKey] }),
    ),
  );

export const useGetGuests = (
  weddingId: string | null,
  page: number,
  limit: number = 10,
  search: string,
  events: string[] = [],
  sides: string[] = [],
  groups: string[] = [],
  inviteSent?: InviteSentFilter,
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
      inviteSent,
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
        inviteSent,
      ),
  });
};

export const useCreateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GuestFormValues) => guestService.addGuest(data),
    onSuccess: (response) => {
      invalidateGuestData(queryClient);

      toast.success(response.message || "New Guest Created Successfully");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

export const useGetGuest = (id: string | undefined) => {
  return useQuery({
    queryKey: [...GUEST_QUERY_KEY, id],
    queryFn: () => guestService.getGuest(id as string),
    enabled: !!id,
  });
};

export const useUpdateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GuestFormValues & { id: string }) =>
      guestService.updateGuest(data, data.id),
    onSuccess: (response) => {
      invalidateGuestData(queryClient);

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
      invalidateGuestData(queryClient);

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
      inviteSent,
    }: {
      weddingId: string;
      search?: string;
      events?: string[];
      sides?: string[];
      groups?: string[];
      inviteSent?: InviteSentFilter;
    }) =>
      guestService.exportGuestList(
        weddingId,
        search,
        events,
        sides,
        groups,
        inviteSent,
      ),
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

// The backend only queues the work (202 + jobId) and a separate worker runs it,
// so poll the job until it actually finishes.
const pollJob = async <T>(
  jobId: string,
  label: string,
  onProgress?: (percent: number) => void,
) => {
  const startedAt = Date.now();
  let lastProgress = 0;
  let lastMovedAt = startedAt;

  for (;;) {
    await sleep(1500);
    const { data: job } = await guestService.getImportStatus<T>(jobId);
    if (job.state === "completed") return job.result;
    if (job.state === "failed") {
      throw new Error(job.failedReason || `${label} failed`);
    }

    if (job.progress > lastProgress) {
      lastProgress = job.progress;
      lastMovedAt = Date.now();
      onProgress?.(job.progress);
    }

    if (job.state === "waiting" && Date.now() - startedAt > 30_000) {
      throw new Error(
        `${label} is queued but nothing is processing it. Is the backend worker running?`,
      );
    }
    // Counted from the last progress, so a big job that keeps moving is slow, not stuck
    if (Date.now() - lastMovedAt > 5 * 60_000) {
      throw new Error(`${label} is taking too long. Refresh the page in a bit.`);
    }
  }
};

export const WHATSAPP_INVITES_QUERY_KEY = ["whatsapp-invites"] as const;

export const useGetWhatsAppInvites = (
  by: "eventId" | "guestId",
  id: string | undefined,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [...WHATSAPP_INVITES_QUERY_KEY, by, id],
    queryFn: () => guestService.getWhatsAppInvites(by, id as string),
    enabled: enabled && !!id,
  });
};

// Everything that shows whether an invite or a reminder has gone out
const invalidateInviteSends = (queryClient: QueryClient) =>
  Promise.all(
    // Reminders too: the first one is timed from when the invite was sent
    [WHATSAPP_INVITES_QUERY_KEY, GUEST_QUERY_KEY, REMINDERS_QUERY_KEY].map(
      (queryKey) => queryClient.invalidateQueries({ queryKey: [...queryKey] }),
    ),
  );

// Opening the WhatsApp link is what marks an invite or reminder as sent, and WhatsApp can't
// tell us whether the host actually pressed Send, so a mis-tap gets a way back. One toast id
// per kind: sending to the next guest replaces the offer for the previous one.
const offerUndo = (id: string, message: string, onUndo: () => void) =>
  toast(
    (t) =>
      createElement(UndoToast, {
        message,
        onUndo: () => {
          toast.dismiss(t.id);
          onUndo();
        },
      }),
    { id, duration: 8000 },
  );

export const useUnmarkInviteSent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) =>
      guestService.unmarkInviteSent(inviteId),
    onSuccess: () => invalidateInviteSends(queryClient),
    onError: (error) => {
      toast.error(error.message || "Couldn't mark the invite as not sent");
    },
  });
};

export const useMarkInviteSent = () => {
  const queryClient = useQueryClient();
  const unmark = useUnmarkInviteSent();

  return useMutation({
    mutationFn: async (inviteId: string) => guestService.markInviteSent(inviteId),
    onSuccess: (_response, inviteId) => {
      invalidateInviteSends(queryClient);
      offerUndo("undo-invite-sent", "Marked as sent", () =>
        unmark.mutate(inviteId),
      );
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't mark the invite as sent");
    },
  });
};

export const useGetDueReminders = (
  eventId: string | undefined,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [...REMINDERS_QUERY_KEY, eventId],
    queryFn: () => guestService.getDueReminders(eventId as string),
    enabled: enabled && !!eventId,
  });
};

type ReminderTarget = { inviteId: string; reminder: ReminderKind };

export const useUnmarkReminderSent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inviteId, reminder }: ReminderTarget) =>
      guestService.unmarkReminderSent(inviteId, reminder),
    onSuccess: () => invalidateInviteSends(queryClient),
    onError: (error) => {
      toast.error(error.message || "Couldn't mark the reminder as not sent");
    },
  });
};

export const useMarkReminderSent = () => {
  const queryClient = useQueryClient();
  const unmark = useUnmarkReminderSent();

  return useMutation({
    mutationFn: async ({ inviteId, reminder }: ReminderTarget) =>
      guestService.markReminderSent(inviteId, reminder),
    onSuccess: (_response, target) => {
      invalidateInviteSends(queryClient);
      offerUndo("undo-reminder-sent", "Reminder marked as sent", () =>
        unmark.mutate(target),
      );
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't mark the reminder as sent");
    },
  });
};

const IMPORT_TOAST_ID = "guest-import";

export const useUploadGuestList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      // One toast for the whole import: it shows the worker's progress and the
      // result below replaces it (same id)
      toast.loading("Importing guests…", { id: IMPORT_TOAST_ID });
      const { data } = await guestService.uploadGuestList(id, file);
      return pollJob<GuestImportResult>(data.jobId, "Guest import", (percent) =>
        toast.loading(`Importing guests… ${percent}%`, { id: IMPORT_TOAST_ID }),
      );
    },
    onSuccess: (result) => {
      if (!result || result.totalProcessed === 0) {
        toast.error("No guests found in the file", { id: IMPORT_TOAST_ID });
        return;
      }
      if (result.failed === 0) {
        toast.success(
          `Imported ${result.successful} guest${result.successful === 1 ? "" : "s"}`,
          { id: IMPORT_TOAST_ID },
        );
        return;
      }
      const details = result.errors
        .slice(0, 3)
        .map((e) => `Row ${e.row}: ${e.error}`)
        .join("\n");
      toast.error(
        `Imported ${result.successful}, failed ${result.failed}.\n${details}`,
        { id: IMPORT_TOAST_ID, duration: 8000 },
      );
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to upload guest list! Please try again later",
        { id: IMPORT_TOAST_ID },
      );
    },
    // Rows may have been partially imported even on failure/timeout
    onSettled: () => {
      invalidateGuestData(queryClient);
    },
  });
};
