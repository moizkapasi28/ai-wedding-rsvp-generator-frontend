import Page, { PageHeader } from "@/components/Page";
import RsvpPageSettingToggleRow from "@/components/RsvpPageSettingToggleRow";
import RsvpPhonePreview from "@/components/RsvpPreviewCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  BellRingIcon,
  CheckIcon,
  ChevronRight,
  MessageSquare,
  Music,
  UsersIcon,
  Utensils,
} from "lucide-react";

export default function PageSettings() {
  return (
    <Page>
      <PageHeader title="RSVP Page Settings" />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 w-full">
          <Button variant="outline" className="rounded-full">
            Mehndi
          </Button>
          <Button variant="outline" className="rounded-full">
            Sangeet
          </Button>
          <Button variant="outline" className="rounded-full">
            Wedding Ceremony
          </Button>
          <Button variant="outline" className="rounded-full">
            Reception
          </Button>
          <Button variant="outline" className="rounded-full">
            Bidai
          </Button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="default">
            <CheckIcon />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>
      <div className="mt-auto grid gap-5 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div>
            <h3 className="text-xl font-semibold">Guest questions</h3>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, hic
            </p>
            <div className="mt-5 space-y-4">
              <RsvpPageSettingToggleRow>
                <div className="flex items-center space-x-2">
                  <Utensils />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
              <RsvpPageSettingToggleRow>
                <div className="flex items-center space-x-2">
                  <UsersIcon />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
              <RsvpPageSettingToggleRow>
                <div className="flex items-center space-x-2">
                  <Music />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
              <RsvpPageSettingToggleRow>
                <div className="flex items-center space-x-2">
                  <MessageSquare />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-xl font-semibold">Guest list for this event</h3>
            <p className="text-sm text-muted-foreground">
              Everyone invited to the event will be listed here.
            </p>
            <div className="mt-5 space-y-4">
              <RsvpPageSettingToggleRow className="cursor-pointer">
                <div className="flex items-center space-x-2">
                  <UsersIcon />
                  <div className="mx-auto">
                    <h4 className="text-sm font-semibold">Question 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia, hic
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ChevronRight />
                </div>
              </RsvpPageSettingToggleRow>
            </div>
          </div>
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
                  <Switch id="airplane-mode" />
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
                  <Switch id="airplane-mode" />
                </div>
              </RsvpPageSettingToggleRow>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start mt-8 lg:mt-0">
          <RsvpPhonePreview />
        </div>
      </div>
    </Page>
  );
}
