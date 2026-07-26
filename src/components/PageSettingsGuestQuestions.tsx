import RsvpPageSettingToggleRow from "@/components/RsvpPageSettingToggleRow";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Music, UsersIcon, Utensils } from "lucide-react";

export default function PageSettingsGuestQuestions({
  activeFormat,
  handleFormatToggle,
}: {
  activeFormat: any;
  handleFormatToggle: (key: string, checked: boolean) => void;
}) {
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
            <Switch
              id="dietary-preference"
              checked={activeFormat?.dietary_preference || false}
              onCheckedChange={(c) =>
                handleFormatToggle("dietary_preference", c)
              }
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
            <Switch
              id="plus-ones"
              checked={activeFormat?.plus_ones || false}
              onCheckedChange={(c) =>
                handleFormatToggle("plus_ones", c)
              }
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
            <Switch
              id="song-request"
              checked={activeFormat?.song_request || false}
              onCheckedChange={(c) =>
                handleFormatToggle("song_request", c)
              }
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
            <Switch
              id="message-to-couple"
              checked={activeFormat?.message || false}
              onCheckedChange={(c) => handleFormatToggle("message", c)}
            />
          </div>
        </RsvpPageSettingToggleRow>
      </div>
    </div>
  );
}
