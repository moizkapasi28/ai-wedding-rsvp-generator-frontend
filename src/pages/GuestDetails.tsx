import GuestInviteCard from "@/components/GuestInviteCard";
import { GroupLabel, SideBadge } from "@/components/guests/GuestFields";
import Notice from "@/components/Notice";
import Page, { PageHeader } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGuest, useGetWhatsAppInvites } from "@/hooks/use-guest";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

// Sized against the content width, not the viewport: collapsing the sidebar
// changes how much room this page gets without the viewport moving at all.
const SHELL = "@container/guest space-y-5";
const INVITE_GRID =
  "grid gap-5 @min-[46rem]/guest:grid-cols-2 @min-[72rem]/guest:grid-cols-3";

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase() || "?";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function GuestDetails() {
  const { id } = useParams();
  const { data: whatsAppInvites } = useGetWhatsAppInvites("guestId", id);
  const { data: guest, isLoading, isPending, isError } = useGetGuest(id);

  // Hooks above must run on every render, so this check comes after them
  if (!id) {
    return (
      <Page>
        <PageHeader title="Guest" />
        <Notice
          title="No guest to show."
          body="This page needs a guest to open. Pick one from the guest list."
          action={
            <Button asChild>
              <Link to="/guests">All guests</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  if (isLoading || isPending) {
    return (
      <Page>
        <PageHeader title="Guest" />
        <div className={SHELL}>
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <div className={INVITE_GRID}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <PageHeader title="Guest" />
        <Notice
          title="We couldn't load this guest."
          body="Something went wrong on the way to the server. Refresh the page to try again."
          action={
            <Button asChild variant="outline">
              <Link to="/guests">Back to guests</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const {
    name,
    email,
    mobile_number,
    side,
    group,
    created_at,
    accomodation_required,
    accomodation_address,
    note,
    guestEventInvite: invites,
  } = guest.data;

  // Guest-facing links (RSVP + WhatsApp) are built by the backend
  const shareLinks = new Map(
    whatsAppInvites?.data.map((w) => [w.id, w] as const) ?? [],
  );
  const replied = invites.filter((invite) => invite.responded_at).length;

  return (
    <Page>
      <PageHeader title="Guest" />

      <div className={SHELL}>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-2 text-muted-foreground"
        >
          <Link to="/guests">
            <ArrowLeft />
            All guests
          </Link>
        </Button>

        {/* One panel for who this is: the name reads first, the facts sit
            beside it. The old header said "Guest Overview" across a slab of
            gradient — the app bar already says which page this is. */}
        <Card className="p-5">
          <div className="grid gap-6 @min-[52rem]/guest:grid-cols-[auto_1fr] @min-[52rem]/guest:gap-8">
            <div className="flex items-center gap-4 @min-[52rem]/guest:border-r @min-[52rem]/guest:border-border @min-[52rem]/guest:pr-8">
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted font-display text-base font-medium tracking-[-0.02em]"
              >
                {initialsOf(name)}
              </span>
              <div className="min-w-0">
                <h2
                  className="truncate font-display text-2xl leading-none font-medium tracking-[-0.03em]"
                  title={name}
                >
                  {name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SideBadge side={side} />
                  <GroupLabel group={group} />
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 @min-[34rem]/guest:grid-cols-4">
              <Fact label="Email">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="block truncate hover:underline"
                    title={email}
                  >
                    {email}
                  </a>
                ) : (
                  <Empty />
                )}
              </Fact>
              <Fact label="Mobile">
                {mobile_number ? (
                  <a
                    href={`tel:${mobile_number}`}
                    className="block truncate hover:underline"
                  >
                    {mobile_number}
                  </a>
                ) : (
                  <Empty />
                )}
              </Fact>
              <Fact label="Added">{formatDate(created_at)}</Fact>
              <Fact label="Accommodation">
                {accomodation_required ? "Requested" : "Not required"}
              </Fact>
            </dl>
          </div>

          {/* The two free-text fields, given room to wrap instead of a cell */}
          {(note || (accomodation_required && accomodation_address)) && (
            <div className="mt-5 grid gap-5 border-t border-border pt-5 @min-[46rem]/guest:grid-cols-2">
              {accomodation_required && accomodation_address && (
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Where they're staying
                  </p>
                  <p className="mt-0.5 text-sm break-words">
                    {accomodation_address}
                  </p>
                </div>
              )}
              {note && (
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="mt-0.5 text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {note}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        <section className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h2 className="text-base font-semibold tracking-[-0.02em]">
              Invitations
            </h2>
            {invites.length > 0 && (
              <p className="text-sm text-muted-foreground tabular-nums">
                {replied} of {invites.length} replied
              </p>
            )}
          </div>

          {invites.length === 0 ? (
            <Notice
              title="Not invited to anything yet."
              body="Add this guest to an event and they'll get their own RSVP link for it."
              action={
                <Button asChild>
                  <Link to="/events">Go to events</Link>
                </Button>
              }
            />
          ) : (
            <div className={INVITE_GRID}>
              {invites.map((invite) => (
                <GuestInviteCard
                  key={invite.id}
                  invite={invite}
                  links={shareLinks.get(invite.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Page>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}

const Empty = () => <span className="text-muted-foreground">—</span>;
