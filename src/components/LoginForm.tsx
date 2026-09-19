import { PasswordInput } from "@/components/custom/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginRequest } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export type LoginFormProps = HTMLAttributes<HTMLDivElement>;

export default function LoginForm({ className, ...props }: LoginFormProps) {
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useLogin();

  async function onSubmit(data: LoginRequest) {
    mutateAsync(data);
  }

  return (
    <div className={cn(className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-4">
                  <FormLabel required>Password</FormLabel>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Forgot it?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="Your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" loading={isPending}>
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
}
