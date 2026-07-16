import { authService } from "@/api/auth.service";
import type { User } from "@/models/user.model";
import { isLoggedInAtom, userAtom, refreshTokenAtom } from "@/store/store";
import { tokenStore } from "@/store/token";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResendVerificationEmailRequest,
  ResetPasswordRequest,
  SignupRequest,
} from "@/validations/auth.validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom, useStore } from "jotai";
import type { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);

  const login = (userData: User, refreshToken: string | null = null) => {
    setUser(userData);
    setIsLoggedIn(true);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    tokenStore.clearAccessToken();
  };

  return { user, isLoggedIn, login, logout, refreshToken };
};

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      let refreshToken = null;
      if (!import.meta.env.VITE_COOKIE_BASED_AUTHENTICATION) {
        refreshToken = response.data.tokens.refresh?.token ?? "";
      }
      login(response.data.user, refreshToken);

      toast.success(`${response.message} 🎉` || "Login successfull! 🎉");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });
};

export const useRegister = (form: UseFormReturn<SignupRequest>) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupRequest) => authService.signup(data),
    onSuccess: (_response) => {
      navigate("/verification-pending", {
        state: { email: form.getValues("email") },
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useVerifyEmail = (token: string | null) => {
  return useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided");
      return authService.verifyEmail({ token });
    },
    enabled: !!token,
    retry: false,
  });
};

export const useResendEmailVerification = () => {
  return useMutation({
    mutationFn: async (data: ResendVerificationEmailRequest) =>
      authService.resendVerificationEmail(data),
    onSuccess: (_response) => {
      toast.success("Verification email sent successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useForgotPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
    onSuccess: () => {
      toast.success("Reset password link sent to registered email address");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });
};

type ResetPasswordProps = {
  setIsError: (value: boolean) => void;
};

export const useResetPassword = ({ setIsError }: ResetPasswordProps) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) =>
      authService.resetPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successfully");
      navigate("/signin");
    },
    onError: (error) => {
      const msg = error.message?.toLowerCase() || "";
      if (
        msg.includes("token") ||
        msg.includes("expire") ||
        msg.includes("link")
      ) {
        setIsError(true);
      }
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const store = useStore();

  return useMutation({
    mutationFn: async () => {
      let rToken = null;
      if (!import.meta.env.VITE_COOKIE_BASED_AUTHENTICATION) {
        rToken = store.get(refreshTokenAtom);
      }
      return authService.logout(rToken);
    },
    onSuccess: () => {
      logout();
      toast.success("Logout successful! 🎉");
      navigate("/signin");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });
};
