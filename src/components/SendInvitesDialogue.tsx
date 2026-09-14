import ScrollFade from "@/components/custom/ScrollFade";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetDueReminders,
  useGetWhatsAppInvites,
  useMarkInviteSent,
  useMarkReminderSent,
} from "@/hooks/use-guest";
import { Loader2, Send } from "lucide-react";
import { useState, type ReactNode } from "react";

type SendInvitesDialogueProps = {
  eventId: string;
  eventTitle: string;
  // Whether either reminder is switched on in RSVP Page Settings
  remindersEnabled: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

// Border sits outside the scroll area so the fade only covers the rows
function GuestList({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border">
      <ScrollFade className="max-h-80 px-3">
        <ul className="divide-y">{children}</ul>
      </ScrollFade>
    </div>
  );
}

function GuestRow({
  name,
  detail,
  url,
  actionLabel,
  primary,
  onSend,
}: {
  name: string;
  detail: string;
  url: string | null;
  actionLabel: string;
  primary: boolean;
  onSend: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      {url ? (
        <Button
          size="sm"
          variant={primary ? "default" : "outline"}
          className="shrink-0 gap-1.5"
          asChild
        >
          <a href={url} target="_blank" rel="noreferrer" onClick={onSend}>
            <Send className="h-3.5 w-3.5" />
            {actionLabel}
          </a>
        </Button>
      ) : (
        <Button size="sm" variant="outline" className="shrink-0" disabled>
          {actionLabel}
        </Button>
      )}
    </li>
  );
}

function Message({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "error" }) {
  return (
    <p
      className={
        tone === "error"
          ? "py-6 text-center text-sm text-destructive"
          : "py-6 text-center text-sm text-muted-foreground"
      }
    >
      {children}
    </p>
  );
}

const loadingOrError = (isLoading: boolean, isError: boolean) =>
  isLoading ? (
    <div className="flex justify-center py-8">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  ) : isError ? (
    <Message tone="error">Couldn't load guests for this event. Please try again.</Message>
  ) : null;

export function SendInvitesDialogue({
  eventId,
  eventTitle,
  remindersEnabled,
  open,
  onOpenChange,
}: SendInvitesDialogueProps) {
  const invitesQuery = useGetWhatsAppInvites("eventId", eventId, open);
  const remindersQuery = useGetDueReminders(eventId, open);
  const markSent = useMarkInviteSent();
  const markReminded = useMarkReminderSent();
  const [showSent, setShowSent] = useState(false);

  const invites = invitesQuery.data?.data ?? [];
  const reminders = remindersQuery.data?.data ?? [];
  const sentCount = invites.filter((invite) => invite.invite_sent_at).length;
  const visible = showSent
    ? invites
    : invites.filter((invite) => !invite.invite_sent_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>{eventTitle} on WhatsApp</DialogTitle>
          </div>
          <DialogDescription>
            Each Send opens WhatsApp with that guest's message already written.
            Press send in WhatsApp, then come back here for the next guest.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="invites" className="gap-3">
          <TabsList className="w-full">
            <TabsTrigger value="invites">Invites</TabsTrigger>
            <TabsTrigger value="reminders">
              Reminders{reminders.length > 0 && ` (${reminders.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invites">
            {loadingOrError(invitesQuery.isLoading, invitesQuery.isError) ??
              (invites.length === 0 ? (
                <Message>No guests are invited to this event yet.</Message>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">
                      {sentCount} of {invites.length} sent
                    </p>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(sentCount / invites.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="show-sent-invites" className="text-sm font-normal">
                      Show guests already sent
                    </Label>
                    <Switch
                      id="show-sent-invites"
                      checked={showSent}
                      onCheckedChange={setShowSent}
                    />
                  </div>

                  {visible.length === 0 ? (
                    <Message>Everyone has been sent this invite.</Message>
                  ) : (
                    <GuestList>
                      {visible.map((invite) => (
                        <GuestRow
                          key={invite.id}
                          name={invite.guest_name}
                          detail={
                            invite.invite_sent_at
                              ? `Sent ${formatDate(invite.invite_sent_at)}`
                              : invite.whatsapp_url
                                ? "Not sent yet"
                                : "No valid mobile number"
                          }
                          url={invite.whatsapp_url}
                          actionLabel={invite.invite_sent_at ? "Resend" : "Send"}
                          primary={!invite.invite_sent_at}
                          onSend={() => markSent.mutate(invite.id)}
                        />
                      ))}
                    </GuestList>
                  )}
                </div>
              ))}
          </TabsContent>

          <TabsContent value="reminders">
            {loadingOrError(remindersQuery.isLoading, remindersQuery.isError) ??
              (reminders.length === 0 ? (
                <Message>
                  {remindersEnabled
                    ? "No reminders are due. First reminders show up 7 days after an invite is sent, final reminders 3 days before the RSVP deadline."
                    : "Reminders are off for this event. Turn them on in RSVP Page Settings."}
                </Message>
              ) : (
                <GuestList>
                  {reminders.map((reminder) => (
                    <GuestRow
                      key={reminder.id}
                      name={reminder.guest_name}
                      detail={
                        !reminder.whatsapp_url
                          ? "No valid mobile number"
                          : reminder.reminder === "FINAL" && reminder.invite_deadline
                            ? `Final reminder, RSVPs close ${formatDate(reminder.invite_deadline)}`
                            : "First reminder, no reply after a week"
                      }
                      url={reminder.whatsapp_url}
                      actionLabel="Send reminder"
                      primary
                      onSend={() =>
                        markReminded.mutate({
                          inviteId: reminder.id,
                          reminder: reminder.reminder,
                        })
                      }
                    />
                  ))}
                </GuestList>
              ))}
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t-0 bg-transparent sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
