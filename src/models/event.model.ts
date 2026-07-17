import type { EventSide } from "@/validations/event.validation";
import type { GenericResponse } from "./generic";

export interface Event {
  id: string;
  wedding_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  latitude: any;
  longitude: any;
  city: string;
  event_side: EventSide;
  created_at: string;
  updated_at: string;
  stats: Stats;
}

export interface Stats {
  totalGuests: number;
  attendingGuests: number;
  declinedGuests: number;
  maybeGuests: number;
  pendingGuests: number;
  completion: number;
  progressBar: ProgressBar;
}

export interface ProgressBar {
  confirmed: number;
  maybe: number;
  declined: number;
  pending: number;
}

export type EventListResponse = GenericResponse<{
  events: Event[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>;

export type CreateOrUpdateEventResponse = GenericResponse<Event>;

export type DeleteEventResponse = GenericResponse<{}>;
