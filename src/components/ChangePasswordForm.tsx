import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useChangePassword } from "@/hooks/use-auth";
import {
  changePasswordSchema,
  type ChangePasswordRequest,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "./custom/PasswordInput";

export default function ChangePasswordForm(
  props: HTMLAttributes<HTMLDivElement>,
) {
  const form = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useChangePassword();

  const onSubmit = (data: ChangePasswordRequest) => {
    mutate(data, {
      onSuccess: () => form.reset(),
      onError: (error) => {
        // The one failure the user can fix in a field; everything else is the toast alone
        if ((error as { status?: number }).status === 400)
          form.setError("currentPassword", { message: error.message });
      },
    });
  };

  return (
    <div {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 @min-[34rem]/profile:grid-cols-2 @min-[52rem]/profile:grid-cols-3">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Current password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder="Your current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>

          <div className="mt-5 flex justify-end">
            <Button type="submit" loading={isPending}>
              Change password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
