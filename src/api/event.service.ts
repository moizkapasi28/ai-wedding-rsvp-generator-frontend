import type {
  CreateOrUpdateEventResponse,
  EventSort,
  DeleteEventResponse,
  EventListResponse,
} from "@/models/event.model";
import { apiService } from "./api.service";
import type { EventFormValues } from "@/validations/event.validation";

class EventService {
  private api: typeof apiService;
  controller: string = "event";

  constructor() {
    this.api = apiService;
  }

  async getEvents(
    weddingId: string,
    page: number,
    limit: number = 10,
    stats: boolean = false,
    search: string = "",
    side: string = "",
    sort: EventSort = "newest",
  ): Promise<EventListResponse> {
    const params = new URLSearchParams({
      weddingId,
      page: page.toString(),
      limit: limit.toString(),
      stats: String(stats),
    });

    if (search) params.append("search", search);
    if (side) params.append("sides", side);
    if (sort !== "newest") params.append("sort", sort);

    return this.api.get<EventListResponse>(
      `${this.controller}?${params.toString()}`,
    );
  }

  async createEvent(
    data: EventFormValues,
  ): Promise<CreateOrUpdateEventResponse> {
    return this.api.post<CreateOrUpdateEventResponse>(
      `${this.controller}`,
      data,
    );
  }

  async updateEvent(
    data: EventFormValues,
    id: string,
  ): Promise<CreateOrUpdateEventResponse> {
    return this.api.patch<CreateOrUpdateEventResponse>(
      `${this.controller}/${id}`,
      data,
    );
  }

  async deleteEvent(id: string): Promise<DeleteEventResponse> {
    return this.api.delete<DeleteEventResponse>(`${this.controller}/${id}`);
  }
}

export const eventService = new EventService();
