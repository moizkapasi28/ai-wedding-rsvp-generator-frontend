import type { GenericResponse } from "./generic";

export type RsvpStatus = "ATTENDING" | "MAYBE" | "DECLINED";

export interface RsvpFormat {
  dietary_preference: boolean;
  plus_ones: boolean;
  song_request: boolean;
  message: boolean;
}

// A type alias (not an interface) so it satisfies api.service's Record<string, unknown> body
export type RsvpReply = {
  status: RsvpStatus;
  plus_ones?: number;
  dietary?: string;
  song_request?: string;
  message?: string;
};

export interface RsvpInvite {
  id: string;
  status: RsvpStatus | "PENDING";
  plus_ones: number | null;
  dietary: string | null;
  song_request: string | null;
  message: string | null;
  invite_deadline: string | null;
  responded_at: string | null;
}

export interface RsvpEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  latitude: string | null;
  longitude: string | null;
  event_side: string;
  format: RsvpFormat;
  invite: RsvpInvite;
}

// One link = one event invite
export type RsvpResponse = GenericResponse<{
  guest: { name: string };
  wedding: { bride_name: string; groom_name: string; slug: string };
  event: RsvpEvent;
}>;

export type SubmitRsvpResponse = GenericResponse<RsvpInvite>;
