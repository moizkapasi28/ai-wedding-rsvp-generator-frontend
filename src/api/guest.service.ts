import type { GuestFormValues } from "@/validations/guest.validation";
import { apiService } from "./api.service";
import type {
  CreateOrUpdateGuestResponse,
  DeleteGuestResponse,
  GetGuestDetailsResponse,
  GuestImportResult,
  GuestListResponse,
  JobStatusResponse,
  MarkInviteSentResponse,
  UploadGuestListResponse,
  WhatsAppInvitesResponse,
} from "@/models/guest.model";

class GuestService {
  private api: typeof apiService;
  controller: string = "guest";

  constructor() {
    this.api = apiService;
  }

  async getGuests(
    weddingId: string | null,
    page: number,
    limit: number = 10,
    search: string,
    events: string[] = [],
    sides: string[] = [],
    groups: string[] = [],
  ): Promise<GuestListResponse> {
    const params = new URLSearchParams({
      weddingId: weddingId as string,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (events && events.length > 0) params.append("events", events.join(","));
    if (sides && sides.length > 0) params.append("sides", sides.join(","));
    if (groups && groups.length > 0) params.append("groups", groups.join(","));

    return this.api.get<GuestListResponse>(
      `${this.controller}?${params.toString()}`,
    );
  }

  async getGuest(id: string): Promise<GetGuestDetailsResponse> {
    return this.api.get<GetGuestDetailsResponse>(`${this.controller}/${id}`);
  }

  async addGuest(body: GuestFormValues): Promise<CreateOrUpdateGuestResponse> {
    return this.api.post<CreateOrUpdateGuestResponse>(
      `${this.controller}`,
      body,
    );
  }

  async updateGuest(
    body: GuestFormValues,
    id: string,
  ): Promise<CreateOrUpdateGuestResponse> {
    return this.api.patch<CreateOrUpdateGuestResponse>(
      `${this.controller}/${id}`,
      body,
    );
  }

  async deleteGuest(id: string): Promise<DeleteGuestResponse> {
    return this.api.delete<DeleteGuestResponse>(`${this.controller}/${id}`);
  }

  async downloadGuestListtemplate(id: string): Promise<void> {
    await this.api.download(
      `${this.controller}/template/download/${id}`,
      "guest-template.xlsx",
    );
  }

  async exportGuestList(
    weddingId: string,
    search?: string,
    events: string[] = [],
    sides: string[] = [],
    groups: string[] = [],
  ): Promise<void> {
    const params = new URLSearchParams({
      weddingId: weddingId as string,
    });
    if (search) params.append("search", search);
    if (events && events.length > 0) params.append("events", events.join(","));
    if (sides && sides.length > 0) params.append("sides", sides.join(","));
    if (groups && groups.length > 0) params.append("groups", groups.join(","));

    let url = `${this.controller}/export?${params.toString()}`;

    await this.api.download(url, "guest-list.xlsx");
  }

  async uploadGuestList(
    id: string,
    file: File,
  ): Promise<UploadGuestListResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return this.api.post<UploadGuestListResponse>(
      `${this.controller}/template/upload/${id}`,
      formData,
    );
  }

  // Status of any guest-queue job (imports and bulk invite sends)
  async getImportStatus<T = GuestImportResult>(
    jobId: string,
  ): Promise<JobStatusResponse<T>> {
    return this.api.get<JobStatusResponse<T>>(
      `${this.controller}/import-status/${jobId}`,
    );
  }

  async getWhatsAppInvites(
    by: "eventId" | "guestId",
    id: string,
  ): Promise<WhatsAppInvitesResponse> {
    return this.api.get<WhatsAppInvitesResponse>(
      `${this.controller}/invites/whatsapp?${by}=${id}`,
    );
  }

  async markInviteSent(inviteId: string): Promise<MarkInviteSentResponse> {
    return this.api.post<MarkInviteSentResponse>(
      `${this.controller}/invites/${inviteId}/mark-sent`,
      {},
    );
  }
}

export const guestService = new GuestService();
