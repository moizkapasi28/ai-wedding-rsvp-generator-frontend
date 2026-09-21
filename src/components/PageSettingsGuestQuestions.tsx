import { MessageSquare, Music, UsersIcon, Utensils } from "lucide-react";
import { SettingSwitch } from "@/components/PageSettingsRow";
import type { RsvpSettingsFormValues } from "@/validations/pageSetting.validation";
import type { LucideIcon } from "lucide-react";

// Four rows that differed only in name, icon and copy were four hand-written
// blocks of the same eight elements. The descriptions say what the guest is
// asked, not what the toggle is called.
const QUESTIONS: {
  name: keyof RsvpSettingsFormValues;
  Icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    name: "dietary_preference",
    Icon: Utensils,
    title: "Dietary preference",
    description: "Asks whether they're vegetarian, vegan, Jain or none of these.",
  },
  {
    name: "plus_ones",
    Icon: UsersIcon,
    title: "Plus ones",
    description: "Lets a guest say how many people they're bringing.",
  },
  {
    name: "song_request",
    Icon: Music,
    title: "Song request",
    description: "Adds a box for the one song they want played.",
  },
  {
    name: "message",
    Icon: MessageSquare,
    title: "Message to the couple",
    description: "A free-text note that only you will see.",
  },
];

export default function PageSettingsGuestQuestions() {
  return (
    <div className="space-y-3">
      {QUESTIONS.map((question) => (
        <SettingSwitch key={question.name} {...question} />
      ))}
    </div>
  );
}
