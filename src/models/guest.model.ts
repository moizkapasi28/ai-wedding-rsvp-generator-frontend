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

export type DeleteGuestResponse = GenericResponse<{}>;
