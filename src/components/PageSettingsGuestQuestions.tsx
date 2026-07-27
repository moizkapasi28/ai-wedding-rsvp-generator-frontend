import RsvpPageSettingToggleRow from "@/components/RsvpPageSettingToggleRow";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Music, UsersIcon, Utensils } from "lucide-react";

import { useFormContext } from "react-hook-form";
import type { RsvpSettingsFormValues } from "@/validations/pageSetting.validation";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

export default function PageSettingsGuestQuestions() {
  const form = useFormContext<RsvpSettingsFormValues>();
  return (
    <div>
      <h3 className="text-xl font-semibold">Guest questions</h3>
      <p className="text-sm text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
        hic
      </p>
      <div className="mt-5 space-y-4">
        <RsvpPageSettingToggleRow>
          <div className="flex items-center space-x-2">
            <Utensils />
            <div className="mx-auto">
              <h4 className="text-sm font-semibold">
                Dietary preference
              </h4>
              <p className="text-xs text-muted-foreground">
                Home catering — not needed for this function
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="dietary_preference"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="dietary-preference"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </RsvpPageSettingToggleRow>
        <RsvpPageSettingToggleRow>
          <div className="flex items-center space-x-2">
            <UsersIcon />
            <div className="mx-auto">
              <h4 className="text-sm font-semibold">Plus ones</h4>
              <p className="text-xs text-muted-foreground">
                Let guests bring extra people
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="plus_ones"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="plus-ones"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </RsvpPageSettingToggleRow>
        <RsvpPageSettingToggleRow>
          <div className="flex items-center space-x-2">
            <Music />
            <div className="mx-auto">
              <h4 className="text-sm font-semibold">Song request</h4>
              <p className="text-xs text-muted-foreground">
                Let guests add their favorite song
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="song_request"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="song-request"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </RsvpPageSettingToggleRow>
        <RsvpPageSettingToggleRow>
          <div className="flex items-center space-x-2">
            <MessageSquare />
            <div className="mx-auto">
              <h4 className="text-sm font-semibold">
                Message to the couple
              </h4>
              <p className="text-xs text-muted-foreground">
                Optional free-text note
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="message-to-couple"
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
