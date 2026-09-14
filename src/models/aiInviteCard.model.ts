import type { GenericResponse } from "./generic";
import type { Wedding } from "./pageSetting.model";

export type AiGenerationStatus =
  | "IDLE"
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type AiGenerationStage = "DESIGN" | "TYPESETTING";

export type AiPhotoPlacement = "SWAP_IN_PLACE" | "FRAMED_INSET";

export const IN_FLIGHT_GENERATION_STATUSES: AiGenerationStatus[] = [
  "QUEUED",
  "PROCESSING",
];

export interface AiInviteCardGenerationStatus {
  id: string;
  event_id: string;
  status: AiGenerationStatus;
  stage: AiGenerationStage | null;
  error: string | null;
  job_id: string | null;
  generated_invite_image_url: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface AiEventInviteCard {
  id: string;
  event_id: string;
  generation_mode: "EXAMPLE" | "MANUAL";
  design_preset: string | null;
  texture_emulation: string | null;
  typography_pairing: string | null;
  metallic_accents: string | null;
  negative_space: string | null;
  monogram_style: string | null;
  text_alignment: string | null;
  edge_styling: string | null;
  additional_details: string | null;
  custom_message: string | null;
  reference_image: string | null;
  generated_image: string | null;
  illustration_style: string | null;
  photo_type: "couple" | "bride" | "groom" | null;
  couple_raw_image_key: string | null;
  photo_placement: AiPhotoPlacement | null;
  bride_attire_style: string | null;
  groom_attire_style: string | null;
  generated_invite_image_url: string | null;
  invite_design_image_url: string | null;
  generation_status: AiGenerationStatus;
  generation_stage: AiGenerationStage | null;
  generation_job_id: string | null;
  generation_error: string | null;
  generation_started_at: string | null;
  generation_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventWithAiInviteCard {
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
  // Prisma models this as a list, though the unique event_id allows at most one card
  aiEventInviteCard: AiEventInviteCard[];
  wedding: Wedding;
}

export type AiInviteCardListResponse = GenericResponse<{
  events: EventWithAiInviteCard[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>;
