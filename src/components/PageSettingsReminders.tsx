import RsvpPageSettingToggleRow from "@/components/RsvpPageSettingToggleRow";
import { Switch } from "@/components/ui/switch";
import { BellRingIcon } from "lucide-react";

export default function PageSettingsReminders({
  activeFormat,
  handleFormatToggle,
}: {
  activeFormat: any;
  handleFormatToggle: (key: string, checked: boolean) => void;
}) {
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
            <Switch
              id="first-reminder"
              checked={activeFormat?.first_reminder || false}
              onCheckedChange={(c) =>
                handleFormatToggle("first_reminder", c)
              }
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
            <Switch
              id="final-reminder"
              checked={activeFormat?.final_reminder || false}
              onCheckedChange={(c) =>
                handleFormatToggle("final_reminder", c)
              }
            />
          </div>
        </RsvpPageSettingToggleRow>
      </div>
    </div>
  );
}
