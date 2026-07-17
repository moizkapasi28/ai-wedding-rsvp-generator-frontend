import type { GuestFormValues } from "@/validations/guest.validation";
import { apiService } from "./api.service";

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
  ): Promise<any> {
    return this.api.get<any>(
      `${this.controller}?weddingId=${weddingId}&page=${page}&limit=${limit}`,
    );
  }

  async addGuest(body: GuestFormValues): Promise<any> {
    return this.api.post<any>(`${this.controller}`, body);
  }

  async updateGuest(body: GuestFormValues, id: string): Promise<any> {
    return this.api.patch<any>(`${this.controller}/${id}`, body);
  }
}

export const guestService = new GuestService();
