import RsvpPageSettingToggleRow from "@/components/RsvpPageSettingToggleRow";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BellRingIcon, CalendarClockIcon } from "lucide-react";

import { useFormContext } from "react-hook-form";
import type { RsvpSettingsFormValues } from "@/validations/pageSetting.validation";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

export default function PageSettingsReminders() {
  const form = useFormContext<RsvpSettingsFormValues>();
  return (
    <div className="mt-5">
      <h3 className="text-xl font-semibold">Deadline and WhatsApp reminders</h3>
      <p className="text-sm text-muted-foreground">
        Reminders go to guests who haven't replied. When one is due, it shows up
        under Send RSVPs on WhatsApp in Guest Preview.
      </p>
      <div className="mt-5 space-y-4">
        <RsvpPageSettingToggleRow>
          <div className="flex items-center space-x-2">
            <CalendarClockIcon />
            <div className="mx-auto">
              <h4 className="text-sm font-semibold">RSVP deadline</h4>
              <p className="text-xs text-muted-foreground">
                Guests can't reply through their link after this date. Leave it
                empty to keep RSVPs open.
              </p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="rsvp_deadline"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Input
                    type="date"
                    className="w-40"
                    aria-label="RSVP deadline"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </RsvpPageSettingToggleRow>
        <RsvpPageSettingToggleRow className="cursor-pointer">
          <div className="flex items-center space-x-2">
            <BellRingIcon />
            <div className="mx-auto">
              <h4 className="text-sm font-semibold">First reminder</h4>
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
