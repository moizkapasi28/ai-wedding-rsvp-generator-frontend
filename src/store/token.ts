import type { Access } from "@/models/user.model";

class TokenService {
  private static instance: TokenService;
  private accessToken: string | null = null;
  private expiresAt: Date | null = null;

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
  }
}
const tokenStore = TokenService.getInstance();
export { tokenStore };
