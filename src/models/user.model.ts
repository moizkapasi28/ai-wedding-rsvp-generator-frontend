import type { GenericResponse } from "./generic";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  profile_picture: string | null;
  ai_credits: number;
  created_at: string;
  updated_at: string;
  is_email_verified: boolean;
}

export type LoginResponse = GenericResponse<{
  user: User;
  tokens: Tokens;
}>;

export type VerifyEmailResponse = GenericResponse<Record<string, never>>;

export type ForgotPasswordResponse = GenericResponse<Record<string, never>>;

export type ResendVerificationEmailResponse = GenericResponse<Record<string, never>>;

export interface Tokens {
  access: Access;
  refresh: Access;
}

export interface Access {
  token: string;
  expires_at: Date;
}

export type GenerateNewTokenResponse = GenericResponse<Tokens>;
