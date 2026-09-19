import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForgotPassword } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  forgotPasswordSchema,
  type ForgotPasswordRequest,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";

export type ForgotPasswordFormProps = HTMLAttributes<HTMLDivElement>;

export default function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync, isPending } = useForgotPassword();

  function onSubmit(values: ForgotPasswordRequest) {
    mutateAsync(values);
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

          <Button type="submit" className="w-full" loading={isPending}>
            Send the reset link
          </Button>
        </form>
      </Form>
    </div>
  );
}
