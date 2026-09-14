import type {
  AiGenerationStatus,
  AiInviteCardGenerationStatus,
  AiInviteCardListResponse,
  AiPhotoPlacement,
} from "@/models/aiInviteCard.model";
import { apiService } from "./api.service";

export interface GenerateAIInviteCardError {
  type: "transient" | "timeout" | "permanent";
  message: string;
}

export type GenerateAIInviteCardPayload = {
  eventId: string;
  generation_mode: "EXAMPLE" | "MANUAL";
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

export interface GenerateAIInviteCardResponse {
  message?: string;
  data: {
    aiInviteCardId: string;
    jobId: string | null;
    status: AiGenerationStatus;
  };
}

export interface AiInviteCardGenerationStatusResponse {
  message?: string;
  data: AiInviteCardGenerationStatus;
}

class AiInviteCardService {
  private api: typeof apiService;
  controller: string = "ai-invite-card";

  constructor() {
    this.api = apiService;
  }

  async generateAIInviteCardImage(
    data: GenerateAIInviteCardPayload,
  ): Promise<GenerateAIInviteCardResponse> {
    return this.api.post<GenerateAIInviteCardResponse>(
      `${this.controller}/generate-invite`,
      data,
    );
  }

  async getAiInviteCardsByWedding(
    weddingId: string,
    page: number = 1,
  ): Promise<AiInviteCardListResponse> {
    const params = new URLSearchParams({ page: page.toString() });
    return this.api.get<AiInviteCardListResponse>(
      `${this.controller}/cards/${weddingId}?${params.toString()}`,
    );
  }

  async getGenerationStatus(
    id: string,
  ): Promise<AiInviteCardGenerationStatusResponse> {
    return this.api.get<AiInviteCardGenerationStatusResponse>(
      `${this.controller}/${id}/generation-status`,
    );
  }

  async updateAiInviteCard(id: string, data: Record<string, unknown>) {
    return this.api.patch<{ message?: string }>(`${this.controller}/${id}`, data);
  }
}

export const aiInviteCardService = new AiInviteCardService();
