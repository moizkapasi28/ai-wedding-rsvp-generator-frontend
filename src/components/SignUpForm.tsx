import { authService } from "@/api/auth.service";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { PhoneInput } from "@/components/custom/PhoneInput";
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
import { cn } from "@/lib/utils";
import {
  signupSchema,
  type SignupRequest,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> { }

export default function SignUpForm({ className, ...props }: SignUpFormProps) {
  const navigate = useNavigate();

  const form = useForm<SignupRequest>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
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

  function onSubmit(values: SignupRequest) {
    mutateAsync(values);
  }
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300" />
                        <Input
                          type="text"
                          placeholder="John"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1 flex flex-col">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300" />
                        <Input
                          type="text"
                          placeholder="Doe"
                          className="pl-11 h-9 bg-white/60 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 shadow-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              name="mobileNumber"
              render={({ field }) => (
                <FormItem className="space-y-1 flex flex-col">
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
                      <PasswordInput
                        showTooltip
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1 flex flex-col">
                  <FormLabel>Confirm Password</FormLabel>
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
              loading={isPending}
              type="submit"
              className="w-full text-base h-9 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-px active:translate-y-px group"
            >
              Sign Up
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
