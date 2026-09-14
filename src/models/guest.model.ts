import type { GuestGroup, Side } from "@/validations/guest.validation";
import type { GenericResponse } from "./generic";

export interface Guest {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  side: Side;
  group: GuestGroup;
  accomodation_required: boolean;
  accomodation_address: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  guestEventInvite: GuestEventInvite[];
}

export interface GuestEventInvite {
  id: string;
  guest_id?: string;
  event_id?: string;
  invite_format_id?: string;
  invite_token?: string;
  status: string;
  plus_ones: number | null;
  dietary: string | null;
  song_request: string | null;
  message: string | null;
  invite_deadline: string | null;
  responded_at: string | null;
  invite_sent_at?: string | null;
  first_reminder_sent_at?: string | null;
  final_reminder_sent_at?: string | null;
  event: Event;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  wedding_id?: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  latitude?: string | null;
  longitude?: string | null;
  city?: string;
  event_side: string;
  created_at: string;
  updated_at: string;
}

export type GuestListResponse = GenericResponse<{
  guests: Guest[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>;

export type GetGuestDetailsResponse = GenericResponse<Guest>;

export type CreateOrUpdateGuestResponse = GenericResponse<Guest>;

export type DeleteGuestResponse = GenericResponse<Record<string, never>>;

export type UploadGuestListResponse = GenericResponse<{ jobId: string }>;

export interface GuestImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: { row: number; error: string }[];
}

// Mirrors BullMQ job state from GET guest/import-status/:jobId
export type JobStatusResponse<T> = GenericResponse<{
  id: string;
  state: string;
  progress: number;
  result: T | null;
  failedReason?: string;
}>;

export type GuestImportStatusResponse = JobStatusResponse<GuestImportResult>;

// wa.me link with the invite message pre-filled; null when the guest has no usable mobile number
export interface WhatsAppInvite {
  id: string;
  guest_id: string;
  guest_name: string;
  event_id: string;
  event_title: string;
  status: string;
  invite_sent_at: string | null;
  rsvp_url: string;
  whatsapp_url: string | null;
}

export type WhatsAppInvitesResponse = GenericResponse<WhatsAppInvite[]>;

export type MarkInviteSentResponse = GenericResponse<GuestEventInvite>;

export type ReminderKind = "FIRST" | "FINAL";

// Guest list filter: guests with an invite that was / wasn't sent on WhatsApp
export type InviteSentFilter = "sent" | "not_sent";

// A reminder due now for a guest who hasn't replied, with the WhatsApp message pre-filled
export interface DueReminder {
  id: string;
  guest_id: string;
  guest_name: string;
  event_id: string;
  event_title: string;
  reminder: ReminderKind;
  invite_deadline: string | null;
  rsvp_url: string;
  whatsapp_url: string | null;
}

export type DueRemindersResponse = GenericResponse<DueReminder[]>;
