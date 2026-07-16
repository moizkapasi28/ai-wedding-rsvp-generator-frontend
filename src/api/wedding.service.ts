import type {
  CreateOrUpdateWeddingResponse,
  DeletWeddingResponse,
  WeddingListResponse,
} from "@/models/wedding.model";
import type { WeddingFormValues } from "@/validations/wedding.validation";
import { apiService } from "./api.service";

class WeddingService {
  private api: typeof apiService;
  controller: string = "wedding";

  constructor() {
    this.api = apiService;
  }

  async getWeddings(
    page: number,
    limit: number = 10,
    stats: boolean = false,
  ): Promise<WeddingListResponse> {
    return this.api.get<WeddingListResponse>(
      `${this.controller}?page=${page}&limit=${limit}&stats=${stats}`,
    );
  }

  async createWedding(
    body: WeddingFormValues,
  ): Promise<CreateOrUpdateWeddingResponse> {
    return this.api.post<CreateOrUpdateWeddingResponse>(
      `${this.controller}`,
      body,
    );
  }

  async updateWedding(
    body: WeddingFormValues,
    id: string,
  ): Promise<CreateOrUpdateWeddingResponse> {
    return this.api.patch<CreateOrUpdateWeddingResponse>(
      `${this.controller}/${id}`,
      body,
    );
  }

  async deleteWedding(id: string): Promise<DeletWeddingResponse> {
    return this.api.delete<DeletWeddingResponse>(`${this.controller}/${id}`);
  }
}

export const weddingService = new WeddingService();
