import { Button } from "@/components/ui/button";
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
import { type Dispatch, type HTMLAttributes, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "./custom/PasswordInput";

export interface ResetPasswordFormProps extends HTMLAttributes<HTMLDivElement> {
  token: string;
  setIsError: Dispatch<SetStateAction<boolean>>;
}

export default function ResetPasswordForm({
  className,
  token,
  setIsError,
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

  // setIsError is pulled out of props so it reaches the hook but never lands on
  // the div as an unknown DOM attribute.
  const { mutateAsync, isPending } = useResetPassword({ setIsError });

  async function onSubmit(data: ResetPasswordRequest) {
    mutateAsync(data);
  }

  return (
    <div className={cn(className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>New password</FormLabel>
                <FormControl>
                  <PasswordInput
                    showTooltip
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Confirm new password</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder="Type it again"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" loading={isPending}>
            Save new password
          </Button>
        </form>
      </Form>
    </div>
  );
}
