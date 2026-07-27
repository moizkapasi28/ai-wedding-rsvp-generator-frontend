import RsvpPageSettingToggleRow from "@/components/RsvpPageSettingToggleRow";
import { Switch } from "@/components/ui/switch";
import { BellRingIcon } from "lucide-react";

import { useFormContext } from "react-hook-form";
import type { RsvpSettingsFormValues } from "@/validations/pageSetting.validation";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

export default function PageSettingsReminders() {
  const form = useFormContext<RsvpSettingsFormValues>();
  return (
    <div className="mt-5">
      <h3 className="text-xl font-semibold">WhatsApp reminders</h3>
      <p className="text-sm text-muted-foreground">
        Automatic nudges sent to guests who haven't responded yet.
      </p>
      <div className="mt-5 space-y-4">
        <RsvpPageSettingToggleRow className="cursor-pointer">
          <div className="flex items-center space-x-2">
            <BellRingIcon />
            <div className="mx-auto">
              <h4 className="text-sm font-semibold">First Reminder</h4>
              <p className="text-xs text-muted-foreground">
                7 days after the invite is sent, if no response
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="first_reminder"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="first-reminder"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </RsvpPageSettingToggleRow>
        <RsvpPageSettingToggleRow className="cursor-pointer">
          <div className="flex items-center space-x-2">
            <BellRingIcon />
            <div className="mx-auto">
              <h4 className="text-sm font-semibold">Final reminder</h4>
              <p className="text-xs text-muted-foreground">
                3 days before the RSVP deadline
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="final_reminder"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="final-reminder"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </RsvpPageSettingToggleRow>
      </div>
    </div>
  );
}
