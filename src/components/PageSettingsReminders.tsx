import { SettingRow, SettingSwitch } from "@/components/PageSettingsRow";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { RsvpSettingsFormValues } from "@/validations/pageSetting.validation";
import { BellRingIcon, CalendarClockIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function PageSettingsReminders() {
  const form = useFormContext<RsvpSettingsFormValues>();

  return (
    <div className="space-y-3">
      <SettingRow
        Icon={CalendarClockIcon}
        title="RSVP deadline"
        description="Guests can't reply through their link after this date. Leave it empty to keep RSVPs open."
      >
        <FormField
          control={form.control}
          name="rsvp_deadline"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl>
                {/* The picker indicator is stretched over the whole field so
                    the entire box opens the calendar; it needs `relative` on
                    the input itself to stay inside it. */}
                <Input
                  type="date"
                  className="relative w-40 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                  aria-label="RSVP deadline"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </SettingRow>

      <SettingSwitch
        name="first_reminder"
        Icon={BellRingIcon}
        title="First reminder"
        description="Seven days after the invite goes out, to anyone who hasn't replied."
      />

      <SettingSwitch
        name="final_reminder"
        Icon={BellRingIcon}
        title="Final reminder"
        description="Three days before the deadline, to anyone still pending."
      />
    </div>
  );
}
