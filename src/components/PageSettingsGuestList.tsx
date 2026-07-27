import RsvpPageSettingToggleRow from "@/components/RsvpPageSettingToggleRow";
import type { Stats } from "@/models/pageSetting.model";
import { ChevronRight, UsersIcon } from "lucide-react";

export default function PageSettingsGuestList({
  total,
  PENDING,
  ATTENDING,
  DECLINED,
  MAYBE,
}: Stats) {
  return (
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
              <h4 className="text-sm font-semibold">{total} guests invited</h4>
              <p className="text-xs text-muted-foreground">
                {ATTENDING} confirmed · {DECLINED} declined · {MAYBE} maybe ·{" "}
                {PENDING} pending
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ChevronRight />
          </div>
        </RsvpPageSettingToggleRow>
      </div>
    </div>
  );
}
