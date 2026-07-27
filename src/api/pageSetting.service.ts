import type {
  CreateOrUpdateGuestInviteFormatResponse,
  PageSettingListResponse,
} from "@/models/pageSetting.model";
import { apiService } from "./api.service";

class PageSettingService {
  private api: typeof apiService;
  controller: string = "page-setting";

  constructor() {
    this.api = apiService;
  }

  async getGuestEventInviteFormatsByWedding(
    weddingId: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<PageSettingListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.api.get<PageSettingListResponse>(
      `${this.controller}/pages/${weddingId}?${params.toString()}`,
    );
  }

  async updateGuestEventInviteFormat(
    id: string,
    data: any,
  ): Promise<CreateOrUpdateGuestInviteFormatResponse> {
    return this.api.patch<CreateOrUpdateGuestInviteFormatResponse>(
      `${this.controller}/${id}`,
      data,
    );
  }

  async generateImage(
    rawImageKey: string,
    eventId: string,
    illustrationTheme?: string,
    illustrationStyle?: string,
    photoType?: string,
    brideAttireId?: string,
    groomAttireId?: string,
    attireId?: string,
    customStyleNote?: string
  ): Promise<{ data: { key: string } }> {
    return this.api.post<{ data: { key: string } }>(
      `${this.controller}/generate-image`,
      { 
        rawImageKey, 
        illustrationTheme, 
        eventId,
        illustrationStyle,
        photoType,
        brideAttireId,
        groomAttireId,
        attireId,
        customStyleNote
      },
    );
  }
}

export const pageSettingService = new PageSettingService();
