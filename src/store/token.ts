import type { Access } from "@/models/user.model";

class TokenService {
  private static instance: TokenService;
  private accessToken: string | null = null;
  private expiresAt: Date | null = null;
  private channel: BroadcastChannel;

  private constructor() {
    this.channel = new BroadcastChannel('token_channel');
    this.channel.onmessage = (event) => {
      if (event.data && event.data.type === 'SET_ACCESS_TOKEN') {
        this.accessToken = event.data.token;
        this.expiresAt = event.data.expiresAt ? new Date(event.data.expiresAt) : null;
      } else if (event.data && event.data.type === 'CLEAR_ACCESS_TOKEN') {
        this.accessToken = null;
        this.expiresAt = null;
      }
    };
  }

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getExpiresAt(): Date | null {
    return this.expiresAt;
  }

  public setAccessToken(resp: Access): void {
    this.accessToken = resp.token;
    this.expiresAt = new Date(resp.expires_at);
    this.channel.postMessage({
      type: 'SET_ACCESS_TOKEN',
      token: resp.token,
      expiresAt: resp.expires_at
    });
  }

  public clearAccessToken(): void {
    this.accessToken = null;
    this.expiresAt = null;
    this.channel.postMessage({ type: 'CLEAR_ACCESS_TOKEN' });
  }
}
const tokenStore = TokenService.getInstance();
export { tokenStore };
