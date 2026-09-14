import type {
  RsvpReply,
  RsvpResponse,
  SubmitRsvpResponse,
} from "@/models/rsvp.model";
import { apiService } from "./api.service";

class RsvpService {
  private api: typeof apiService;
  controller: string = "rsvp";

  constructor() {
    this.api = apiService;
  }

  async getRsvp(token: string): Promise<RsvpResponse> {
    return this.api.get<RsvpResponse>(`${this.controller}/${token}`);
  }

  async submitRsvp(
    token: string,
    reply: RsvpReply,
  ): Promise<SubmitRsvpResponse> {
    return this.api.put<SubmitRsvpResponse>(
      `${this.controller}/${token}`,
      reply,
    );
  }

  // Host portal: same reply payload, addressed by invite id instead of the guest's token
  async submitGuestRsvp(
    inviteId: string,
    reply: RsvpReply,
  ): Promise<SubmitRsvpResponse> {
    return this.api.put<SubmitRsvpResponse>(
      `${this.controller}/invite/${inviteId}`,
      reply,
    );
  }
}

export const rsvpService = new RsvpService();
