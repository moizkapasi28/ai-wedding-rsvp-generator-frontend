import type { GuestFormValues } from "@/validations/guest.validation";
import { apiService } from "./api.service";
import type {
  CreateOrUpdateGuestResponse,
  DeleteGuestResponse,
  GetGuestDetailsResponse,
  GuestListResponse,
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
  ): Promise<GuestListResponse> {
    return this.api.get<GuestListResponse>(
      `${this.controller}?weddingId=${weddingId}&page=${page}&limit=${limit}`,
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
}

export const guestService = new GuestService();
