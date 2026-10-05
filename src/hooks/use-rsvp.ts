import { rsvpService } from "@/api/rsvp.service";
import {
  invalidateGuestData,
  REMINDERS_QUERY_KEY,
  WHATSAPP_INVITES_QUERY_KEY,
} from "@/hooks/use-guest";
import type { RsvpReply } from "@/models/rsvp.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const RSVP_QUERY_KEY = ["rsvp"] as const;

// api.service attaches the HTTP status to the errors it throws; a network failure has none
const statusOf = (error: unknown) =>
  (error as { status?: number } | null)?.status;

// The API answers 404 for an unknown or removed invite and 400 for a malformed token.
// Anything else (rate limit, server error, no connection) says nothing about the link.
export const isInvalidRsvpLink = (error: unknown) => {
  const status = statusOf(error);
  return status === 404 || status === 400;
};

export const useGetRsvp = (token: string) => {
  return useQuery({
    queryKey: [...RSVP_QUERY_KEY, token],
    queryFn: () => rsvpService.getRsvp(token),
    // A bad link (or any 4xx, e.g. a rate limit) won't get better on an instant retry;
    // a dropped connection or a server error might
    retry: (failureCount, error) => {
      const status = statusOf(error);
      return failureCount < 2 && (status === undefined || status >= 500);
    },
  });
};

export const useSubmitRsvp = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reply: RsvpReply) => rsvpService.submitRsvp(token, reply),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [...RSVP_QUERY_KEY, token] });
      toast.success(response.message || "Your RSVP has been saved");
    },
    onError: (error) => {
      // api.service attaches the HTTP status; a 404 means the invite was removed while the page was open
      if ((error as Error & { status?: number }).status === 404) {
        queryClient.invalidateQueries({ queryKey: [...RSVP_QUERY_KEY, token] });
      }
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};

// Host portal: set a reply for a guest who couldn't use their link
export const useSubmitGuestRsvp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inviteId, reply }: { inviteId: string; reply: RsvpReply }) =>
      rsvpService.submitGuestRsvp(inviteId, reply),
    onSuccess: (response) => {
      invalidateGuestData(queryClient);
      queryClient.invalidateQueries({ queryKey: [...WHATSAPP_INVITES_QUERY_KEY] });
      // A guest who has replied no longer needs reminders
      queryClient.invalidateQueries({ queryKey: [...REMINDERS_QUERY_KEY] });
      toast.success(response.message || "RSVP updated");
    },
    onError: (error) => {
      toast.error(
        error.message || "Something went wrong! Please try again later",
      );
    },
  });
};
