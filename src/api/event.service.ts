import type {
  CreateOrUpdateEventResponse,
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
  ): Promise<EventListResponse> {
    return this.api.get<EventListResponse>(
      `${this.controller}?weddingId=${weddingId}&page=${page}&limit=${limit}&stats=${stats}`,
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
