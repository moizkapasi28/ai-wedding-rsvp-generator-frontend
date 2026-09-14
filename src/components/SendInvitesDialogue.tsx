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
import { useGetWhatsAppInvites, useMarkInviteSent } from "@/hooks/use-guest";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

type SendInvitesDialogueProps = {
  eventId: string;
  eventTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SendInvitesDialogue({
  eventId,
  eventTitle,
  open,
  onOpenChange,
}: SendInvitesDialogueProps) {
  const { data, isLoading, isError } = useGetWhatsAppInvites(
    "eventId",
    eventId,
    open,
  );
  const markSent = useMarkInviteSent();
  const [showSent, setShowSent] = useState(false);

  const invites = data?.data ?? [];
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
            <DialogTitle>Send {eventTitle} invites</DialogTitle>
          </div>
          <DialogDescription>
            Each Send opens WhatsApp with that guest's invite already written.
            Press send in WhatsApp, then come back here for the next guest.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <p className="py-6 text-center text-sm text-destructive">
            Couldn't load guests for this event. Please try again.
          </p>
        ) : invites.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No guests are invited to this event yet.
          </p>
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
              <p className="py-6 text-center text-sm text-muted-foreground">
                Everyone has been sent this invite.
              </p>
            ) : (
              // Border sits outside the scroll area so the fade only covers the rows
              <div className="rounded-md border">
              <ScrollFade className="max-h-80 px-3">
              <ul className="divide-y">
                {visible.map((invite) => (
                  <li
                    key={invite.id}
                    className="flex items-center justify-between gap-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {invite.guest_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invite.invite_sent_at
                          ? `Sent ${new Date(invite.invite_sent_at).toLocaleDateString()}`
                          : invite.whatsapp_url
                            ? "Not sent yet"
                            : "No valid mobile number"}
                      </p>
                    </div>
                    {invite.whatsapp_url ? (
                      <Button
                        size="sm"
                        variant={invite.invite_sent_at ? "outline" : "default"}
                        className="shrink-0 gap-1.5"
                        asChild
                      >
                        <a
                          href={invite.whatsapp_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => markSent.mutate(invite.id)}
                        >
                          <Send className="h-3.5 w-3.5" />
                          {invite.invite_sent_at ? "Resend" : "Send"}
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="shrink-0" disabled>
                        Send
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
              </ScrollFade>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="border-t-0 bg-transparent sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
