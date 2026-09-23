import type { Event } from "./event.model";
import type { GenericResponse } from "./generic";

export interface Wedding {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  message: string;
  created_at: string;
  updated_at: string;
  totalGuests?: number;
  totalEvents?: number;
  confirmationRate?: number;
  tag?: string;
}

export interface LiveRsvp {
  inviteId: string;
  guestName: string;
  eventTitle: string;
  status: "ATTENDING" | "MAYBE" | "DECLINED";
  plusOnes: number | null;
  respondedAt: string;
}

export interface WeddingDashboard {
  stats: {
    totalGuests: number;
    guestsThisWeek: number;
    accommodationRequired: number;
    attending: number;
    pending: number;
    confirmationRate: number;
    responsesThisWeek: number;
  };
  events: Event[];
  dietary: { dietary: string; count: number }[];
  sides: { side: string; count: number }[];
  dailyResponses: { date: string; count: number }[];
  recentRsvps: LiveRsvp[];
}

export type WeddingListResponse = GenericResponse<{
  weddings: Wedding[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>;

export type CreateOrUpdateWeddingResponse = GenericResponse<Wedding>;

export type WeddingResponse = GenericResponse<Wedding>;

export type DeletWeddingResponse = GenericResponse<Record<string, never>>;

export type WeddingDashboardResponse = GenericResponse<WeddingDashboard>;
