import type { GenericResponse } from "./generic";

export interface EventWithInvitesAndWedding {
  id: string;
  wedding_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  city: string;
  event_side: string;
  created_at: string;
  updated_at: string;
  guestEventInviteFormat: GuestEventInviteFormat[];
  wedding: Wedding;
}

export interface GuestEventInviteFormat {
  id: string;
  event_id: string;
  raw_image: string | null;
  generated_image: string | null;
  illustration_style: string | null;
  dietary_preference: boolean;
  song_request: boolean;
  message: boolean;
  plus_ones: boolean;
  first_reminder: boolean;
  final_reminder: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wedding {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  bride_name: string;
  groom_name: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export type PageSettingListResponse = GenericResponse<{
  events: EventWithInvitesAndWedding;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>;

export type CreateOrUpdateGuestInviteFormatResponse =
  GenericResponse<GuestEventInviteFormat>;
