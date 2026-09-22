import type {
  AiGenerationErrorCode,
  AiGenerationStatus,
  InviteCardGenerationStatus,
  InviteCardListResponse,
  AiPhotoPlacement,
} from "@/models/inviteCard.model";
import { apiService } from "./api.service";

export type GenerateInviteCardError = { code: AiGenerationErrorCode };

export type GenerateInviteCardPayload = {
  eventId: string;
  // Only the two generated sources; an UPLOAD card is never generated
  card_source: "PRESETS" | "EXAMPLE";
  photo_type?: "couple" | "bride" | "groom";
  design_preset?: string | null;
  texture_emulation?: string | null;
  typography_pairing?: string | null;
  metallic_accents?: string | null;
  negative_space?: string | null;
  monogram_style?: string | null;
  text_alignment?: string | null;
  edge_styling?: string | null;
  additional_details?: string | null;
  custom_message?: string | null;
  reference_image?: string | null;
  couple_raw_image_key?: string | null;
  photo_placement?: AiPhotoPlacement | null;
  illustration_style?: string | null;
  bride_attire_style?: string | null;
  groom_attire_style?: string | null;
};

export interface GenerateInviteCardResponse {
  message?: string;
  data: {
    inviteCardId: string;
    jobId: string | null;
    status: AiGenerationStatus;
  };
}

export interface InviteCardGenerationStatusResponse {
  message?: string;
  data: InviteCardGenerationStatus;
}

class InviteCardService {
  private api: typeof apiService;
  controller: string = "invite-card";

  constructor() {
    this.api = apiService;
  }

  async generateInviteCardImage(
    data: GenerateInviteCardPayload,
  ): Promise<GenerateInviteCardResponse> {
    return this.api.post<GenerateInviteCardResponse>(
      `${this.controller}/generate-invite`,
      data,
    );
  }

  async getInviteCardsByWedding(
    weddingId: string,
    page: number = 1,
  ): Promise<InviteCardListResponse> {
    const params = new URLSearchParams({ page: page.toString() });
    return this.api.get<InviteCardListResponse>(
      `${this.controller}/cards/${weddingId}?${params.toString()}`,
    );
  }

  async getGenerationStatus(
    id: string,
  ): Promise<InviteCardGenerationStatusResponse> {
    return this.api.get<InviteCardGenerationStatusResponse>(
      `${this.controller}/${id}/generation-status`,
    );
  }

  async updateInviteCard(id: string, data: Record<string, unknown>) {
    return this.api.patch<{ message?: string }>(`${this.controller}/${id}`, data);
  }
}

export const inviteCardService = new InviteCardService();
