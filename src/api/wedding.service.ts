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
    search: string = "",
    filter: string[] = [],
    sortBy: string = "",
    sortOrder: string = "",
  ): Promise<WeddingListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      stats: stats.toString(),
    });

    if (search) params.append("search", search);
    if (filter && filter.length > 0) params.append("filter", filter.join(","));
    if (sortBy && sortOrder) {
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);
    }

    return this.api.get<WeddingListResponse>(
      `${this.controller}?${params.toString()}`,
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
