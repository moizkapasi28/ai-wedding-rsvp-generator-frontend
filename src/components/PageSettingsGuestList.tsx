import { SettingRow } from "@/components/PageSettingsRow";
import type { Stats } from "@/models/pageSetting.model";
import { ChevronRight, UsersIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageSettingsGuestListProps extends Stats {
  eventId?: string | null;
}

export default function PageSettingsGuestList({
  total,
  PENDING,
  ATTENDING,
  DECLINED,
  MAYBE,
  eventId,
}: PageSettingsGuestListProps) {
  const navigate = useNavigate();

  return (
    <SettingRow
      Icon={UsersIcon}
      title={total === 1 ? "1 guest invited" : `${total} guests invited`}
      description={`${ATTENDING} attending · ${MAYBE} maybe · ${DECLINED} declined · ${PENDING} pending`}
      // A row that navigates is a button, not a div with an onClick: this way
      // it takes focus and fires on Enter.
      role="button"
      tabIndex={0}
      className="w-full cursor-pointer text-left transition-colors hover:border-ring"
      onClick={() => navigate(eventId ? `/guests?event=${eventId}` : "/guests")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(eventId ? `/guests?event=${eventId}` : "/guests");
        }
      }}
    >
      <ChevronRight className="size-4 text-muted-foreground" />
    </SettingRow>
  );
}
