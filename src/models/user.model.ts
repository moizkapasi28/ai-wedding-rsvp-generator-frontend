import type { GenericResponse } from "./generic";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
  is_email_verified: boolean;
}

export type LoginResponse = GenericResponse<{
  user: User;
  tokens: Tokens;
}>;

export type VerifyEmailResponse = GenericResponse<{}>;

export type ForgotPasswordResponse = GenericResponse<{}>;

export type ResendVerificationEmailResponse = GenericResponse<{}>;

export interface Tokens {
  access: Access;
  refresh: Access;
}

export interface Access {
  token: string;
  expires_at: Date;
}

export type GenerateNewTokenResponse = GenericResponse<Tokens>;
