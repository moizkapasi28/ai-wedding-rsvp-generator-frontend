import { Regex } from "@/utilities/regex";
import { z } from "zod";
const { UPPERCASE, LOWERCASE, NUMBER, SPECIAL_CHAR } = Regex;

const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(UPPERCASE, {
    message: "Password must include at least one uppercase letter",
  })
  .regex(LOWERCASE, {
    message: "Password must include at least one lowercase letter",
  })
  .regex(NUMBER, { message: "Password must include at least one number" })
  .regex(SPECIAL_CHAR, {
    message: "Password must include at least one special character",
  })
  .max(20, { message: "Password must be no longer than 20 characters" });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: passwordValidation,
});

export type LoginRequest = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .min(3, "First name must be of minimum 3 characters")
      .max(50, "First name can not be greater than 50 characters")
      .describe("First name of the user"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .min(3, "Last name must be of minimum 3 characters")
      .max(50, "Last name can not be greater than 50 characters")
      .describe("Last name of the user"),
    email: z
      .email("Enter valid email address")
      .trim()
      .describe("Email address"),
    mobileNumber: z
      .string()
      .min(10, "Please enter a valid mobile number")
      .max(15, "Mobile number too long"),
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type SignupRequest = z.infer<typeof signupSchema>;

export const verifyEmailSchema = z.object({
  token: z
    .string("Verification token is required")
    .trim()
    .describe("Email verification token to verify email"),
});

export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .email("Enter valid email address")
    .trim()
    .describe("Email address to get reset password link"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

export const resendVerificaionEmailSchema = z.object({
  email: z
    .email("Enter valid email address")
    .trim()
    .describe("Email address to get reset password link"),
});

export type ResendVerificationEmailRequest = z.infer<
  typeof resendVerificaionEmailSchema
>;

export const resetPasswordSchema = z
  .object({
    token: z
      .string("Token is required")
      .trim()
      .describe("Token is used to old password with new password"),
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
