import type {
  CreateWeddingResponse,
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

  async createWedding(body: WeddingFormValues): Promise<CreateWeddingResponse> {
    return this.api.post<CreateWeddingResponse>(`${this.controller}`, body);
  }
}

export const weddingService = new WeddingService();
