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
import { useResetPassword } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  resetPasswordSchema,
  type ResetPasswordRequest,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LockIcon } from "lucide-react";
import { type Dispatch, type HTMLAttributes, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { PasswordInput } from "./custom/PasswordInput";

export interface ResetPasswordFormProps extends HTMLAttributes<HTMLDivElement> {
  token: string;
  setIsError: Dispatch<SetStateAction<boolean>>;
}

export default function ResetPasswordForm({
  className,
  token,
  ...props
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useResetPassword(props);

  async function onSubmit(data: ResetPasswordRequest) {
    mutateAsync(data);
  }
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1 flex flex-col">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
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
                      <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors duration-300 z-10" />
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
              Reset Password
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              Back to login?{" "}
              <Link
                to="/signin"
                className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
