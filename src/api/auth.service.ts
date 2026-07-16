import type {
  ForgotPasswordResponse,
  GenerateNewTokenResponse,
  LoginResponse,
  ResendVerificationEmailResponse,
  User,
  VerifyEmailResponse,
} from "@/models/user.model";
import { apiService } from "./api.service";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResendVerificationEmailRequest,
  ResetPasswordRequest,
  SignupRequest,
  VerifyEmailRequest,
} from "@/validations/auth.validation";

class AuthService {
  private api: typeof apiService;
  controller: string = "auth";

  constructor() {
    this.api = apiService;
  }

  async login(body: LoginRequest) {
    return this.api.post<LoginResponse>(`${this.controller}/signin`, body);
  }

  async signup(body: SignupRequest) {
    return this.api.post<LoginResponse>(`${this.controller}/signup`, body);
  }

  async verifyEmail(body: VerifyEmailRequest) {
    return this.api.post<VerifyEmailResponse>(
      `${this.controller}/verify-email`,
      body,
    );
  }

  async resendVerificationEmail(body: ResendVerificationEmailRequest) {
    return this.api.post<ResendVerificationEmailResponse>(
      `${this.controller}/resend-verify-email`,
      body,
    );
  }

  async forgotPassword(body: ForgotPasswordRequest) {
    return this.api.post<ForgotPasswordResponse>(
      `${this.controller}/forgot-password`,
      body,
    );
  }

  async resetPassword(body: ResetPasswordRequest) {
    return this.api.patch<ForgotPasswordResponse>(
      `${this.controller}/reset-password`,
      body,
    );
  }

  async getAccessToken(refreshToken: string | null = null) {
    return this.api.post<GenerateNewTokenResponse>(
      `${this.controller}/access-token`,
      refreshToken ? { refreshToken } : undefined,
    );
  }

  async getUserInfo(): Promise<User> {
    return this.api.get<User>(`${this.controller}/me`);
  }

  async logout(refreshToken: string | null = null): Promise<void> {
    return this.api.post(
      `${this.controller}/logout`,
      refreshToken ? { refreshToken } : undefined,
    );
  }
}

export const authService = new AuthService();
