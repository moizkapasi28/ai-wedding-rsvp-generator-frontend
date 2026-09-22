import RsvpInviteHero from "./RsvpInviteHero";
import {
  inviteFieldClass,
  inviteSelectClass,
  inviteLabelClass,
  inviteStepperButtonClass,
  inviteStepperClass,
} from "@/lib/rsvpFieldStyles";
import RsvpReplyButtons from "./RsvpReplyButtons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DIETARY_OPTIONS } from "@/constants";
import { getEventDisplay, type DisplayEvent } from "@/lib/event-display";
import type {
  RsvpFormat,
  RsvpInvite,
  RsvpReply,
  RsvpStatus,
} from "@/models/rsvp.model";
import { Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

const REPLY_LABELS: Record<RsvpStatus, string> = {
  ATTENDING: "yes, you'll be there",
  MAYBE: "maybe",
  DECLINED: "you can't make it",
};

type RsvpFormValues = {
  plus_ones: number;
  dietary: string;
  song_request: string;
  message: string;
};

type Props = {
  event: DisplayEvent & { title: string; description?: string };
  wedding?: { bride_name: string; groom_name: string };
  format?: RsvpFormat;
  invite?: RsvpInvite;
  closed?: boolean;
  isSubmitting?: boolean;
  onSubmit: (reply: RsvpReply) => void;
};

// Parents key this by event (and saved reply) so the inputs reset from `invite`
export default function RsvpForm({
  event,
  wedding,
  format,
  invite,
  closed = false,
  isSubmitting = false,
  onSubmit,
}: Props) {
  // No schema: every question here is optional and free-form, so there is
  // nothing to validate beyond the maxLength the inputs already enforce.
  const form = useForm<RsvpFormValues>({
    defaultValues: {
      plus_ones: invite?.plus_ones ?? 0,
      dietary: invite?.dietary ?? "",
      song_request: invite?.song_request ?? "",
      message: invite?.message ?? "",
    },
  });
  const { names, dateStr, place } = getEventDisplay(event, wedding);
  const disabled = closed || isSubmitting;

  const submit = (status: RsvpStatus) =>
    form.handleSubmit((values) =>
      onSubmit({
        status,
        ...(format?.plus_ones ? { plus_ones: values.plus_ones } : {}),
        ...(format?.dietary_preference && values.dietary
          ? { dietary: values.dietary }
          : {}),
        ...(format?.song_request && values.song_request.trim()
          ? { song_request: values.song_request.trim() }
          : {}),
        ...(format?.message && values.message.trim()
          ? { message: values.message.trim() }
          : {}),
      }),
    )();

  return (
    <Form {...form}>
      {/* Square and hairline, the same shell RsvpPreviewCard uses — the two
          render the same invitation, so they can't be set differently. The
          rounded, shadowed slab this was reads as UI chrome around what is
          meant to be a printed card. */}
      <div className="flex flex-col overflow-hidden border border-border bg-background">
        <RsvpInviteHero
          names={names}
          eventTitle={event.title}
          date={dateStr}
          place={place}
          time={event.time}
          // The same illustration Page Settings' Live preview shows
          image={format?.illustration_url}
          className="py-6"
        />

        <div className="@container/rsvpcard flex flex-1 flex-col gap-4 px-5 py-5 sm:px-6">
          {event.description && (
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          )}

          {/* Side by side only once the card is wide enough for both: at phone
              width two columns squeezed the dropdown until its value truncated.
              Measured against the card, not the window, since the same card is
              a third of the width inside Guest Preview. */}
          <div className="grid grid-cols-1 gap-4 empty:hidden @min-[22rem]/rsvpcard:grid-cols-2">
            {format?.dietary_preference && (
              <FormField
                control={form.control}
                name="dietary"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <FormLabel className={inviteLabelClass}>
                      Dietary preference
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={disabled}
                    >
                      <FormControl>
                        <SelectTrigger className={inviteSelectClass}>
                          <SelectValue placeholder="Select a preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIETARY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            {format?.plus_ones && (
              <FormField
                control={form.control}
                name="plus_ones"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    {/* a span, not FormLabel: the stepper has no focusable input to label */}
                    <span id="guest-plus-ones" className={inviteLabelClass}>
                      Plus-ones
                    </span>
                    <div
                      role="group"
                      aria-labelledby="guest-plus-ones"
                      className={inviteStepperClass}
                    >
                      <button
                        type="button"
                        aria-label="Decrease plus-ones"
                        disabled={disabled || field.value === 0}
                        onClick={() =>
                          field.onChange(Math.max(0, field.value - 1))
                        }
                        className={`${inviteStepperButtonClass} disabled:opacity-40`}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span
                        aria-live="polite"
                        className="min-w-5 text-center text-sm font-semibold tabular-nums"
                      >
                        {field.value}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase plus-ones"
                        disabled={disabled || field.value === 9}
                        onClick={() =>
                          field.onChange(Math.min(9, field.value + 1))
                        }
                        className={`${inviteStepperButtonClass} disabled:opacity-40`}
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>

          {format?.song_request && (
            <FormField
              control={form.control}
              name="song_request"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className={inviteLabelClass}>
                    Song request (optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Any song you'd love to dance to?"
                      className={`min-h-10 resize-none text-sm ${inviteFieldClass}`}
                      maxLength={500}
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {format?.message && (
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className={inviteLabelClass}>
                    Message to the couple
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Leave a note for the couple"
                      className={`min-h-10 resize-none text-sm ${inviteFieldClass}`}
                      maxLength={500}
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="mt-auto flex flex-col gap-3 border-t pt-4">
            {invite && invite.status !== "PENDING" && (
              <p className="text-center text-sm text-muted-foreground">
                You replied{" "}
                <span className="font-medium text-foreground">
                  {REPLY_LABELS[invite.status]}
                </span>
                {closed ? "." : ". You can change your reply below."}
              </p>
            )}
            {closed && (
              <p className="text-center text-sm font-medium text-muted-foreground">
                RSVPs for this event are closed
              </p>
            )}
            <RsvpReplyButtons disabled={disabled} onReply={submit} />
          </div>
        </div>
      </div>
    </Form>
  );
}
