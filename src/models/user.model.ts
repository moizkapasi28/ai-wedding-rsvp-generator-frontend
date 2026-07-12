import type { GenericResponse } from "./generic";

export interface User {
  id: number;
  username: string;
  email: string;
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
