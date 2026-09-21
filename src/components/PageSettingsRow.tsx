import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { RsvpSettingsFormValues } from "@/validations/pageSetting.validation";
import type { LucideIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

/**
 * One row of a settings list: what it is on the left, the control on the right.
 * Replaces the old toggle row, which pasted the same six-element wrapper around
 * every switch — and which built its class list with string concatenation, so a
 * row without a className shipped a literal "undefined" class.
 */
export function SettingRow({
  Icon,
  title,
  description,
  children,
  className,
  ...props
}: {
  Icon?: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/** A SettingRow whose control is a switch bound to the RSVP settings form. */
export function SettingSwitch({
  name,
  ...row
}: {
  name: keyof RsvpSettingsFormValues;
  Icon?: LucideIcon;
  title: string;
  description?: string;
}) {
  const form = useFormContext<RsvpSettingsFormValues>();

  return (
    <SettingRow {...row}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
                aria-label={row.title}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </SettingRow>
  );
}
