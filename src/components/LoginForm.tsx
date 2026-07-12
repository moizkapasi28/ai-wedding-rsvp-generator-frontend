import { authService } from "@/api/auth.service";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginRequest } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { type HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export interface LoginFormProps extends HTMLAttributes<HTMLDivElement> {}

export default function LoginForm({ className, ...props }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
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

  async function onSubmit(data: LoginRequest) {
    mutateAsync(data);
  }
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1 flex flex-col">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="pl-11 h-9 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                      <PasswordInput
                        // showTooltip
                        placeholder="••••••••"
                        className="pl-11 pr-10 h-9 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-6 pt-4 bg-transparent border-t-0">
            <Button
              type="submit"
              className="w-full text-base h-9 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-px active:translate-y-px group"
              loading={isPending}
            >
              Sign In
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
              >
                Create one now
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
