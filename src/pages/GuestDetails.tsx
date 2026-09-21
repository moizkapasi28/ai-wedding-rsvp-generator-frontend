import { formatSide, getSideBadgeStyles } from "@/lib/eventSide";
import Page, { PageHeader } from "@/components/Page";
import ToolBar from "@/components/ToolBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import GuestInviteCard from "@/components/GuestInviteCard";
import { useGetGuest, useGetWhatsAppInvites } from "@/hooks/use-guest";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const getGroupBadgeStyles = (group: string) => {
  const groupColors: Record<string, string> = {
    FAMILY: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950/30 dark:text-fuchsia-300 dark:border-fuchsia-900/50",
    FRIEND: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/50",
    RELATIVE: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-900/50",
    EMPLOYEE: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/50",
    COLLEAGUE: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-900/50",
    VIP: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50",
    OTHER: "bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-950/30 dark:text-stone-300 dark:border-stone-900/50",
  };
  return groupColors[group.toUpperCase()] || groupColors.OTHER;
};

export default function GuestDetails() {
  const { id } = useParams();
  const { data: whatsAppInvites } = useGetWhatsAppInvites("guestId", id);
  const { data: guest, isLoading, isPending, isError } = useGetGuest(id);

  // Hooks above must run on every render, so this check comes after them
  if (!id)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Guest Id is required to view guest details...
      </div>
    );

  if (isLoading || isPending) {
    return (
      <Page>
        <PageHeader title="Guest Details" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
          <ToolBar>
            <Skeleton className="h-9 w-32 rounded-md" />
          </ToolBar>
        </div>
        
        {/* Guest Overview Skeleton */}
        <Card className="shadow-sm mb-5 overflow-hidden py-0 gap-0">
          <CardHeader className="p-5">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-6 p-6 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:flex xl:justify-between gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-0 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Responses Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="p-5">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load guest details. Please try again.
      </div>
    );
  }

  // Guest-facing links (RSVP + WhatsApp) are built by the backend
  const shareLinks = new Map(
    whatsAppInvites?.data.map((w) => [w.id, w] as const) ?? [],
  );

  return (
    <Page>
      <PageHeader title="Guest Details" />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
        <ToolBar>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link to="/guests">
              <ArrowLeft className="h-4 w-4" />
              Back to Guests
            </Link>
          </Button>
        </ToolBar>
      </div>

      {/* Guest Overview */}
      <Card className="shadow-sm mb-5 overflow-hidden py-0 gap-0">
        <CardHeader className="bg-linear-to-r from-orange-500 to-pink-600 p-5 text-white">
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 opacity-90" />
            Guest Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6 pt-6">
          {/* Section 1: Basic Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:flex xl:justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                Guest Name
              </p>
              <p className="font-medium text-base truncate">
                {guest.data.name}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                Email Address
              </p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-sm truncate">{guest.data.email}</p>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                Mobile Number
              </p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-sm truncate">{guest.data.mobile_number}</p>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                Wedding Side
              </p>
              <Badge
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5",
                  getSideBadgeStyles(guest.data.side)
                )}
              >
                {formatSide(guest.data.side)}
              </Badge>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                Guest Group
              </p>
              <Badge
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5",
                  getGroupBadgeStyles(guest.data.group)
                )}
              >
                {guest.data.group}
              </Badge>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                Added On
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-sm truncate">
                  {new Date(guest.data.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Accommodation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:gap-24 gap-6">
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                Accommodation
              </p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-sm font-medium">
                  {guest.data.accomodation_required
                    ? "Requested"
                    : "Not Required"}
                </p>
              </div>
            </div>
            {guest.data.accomodation_required &&
              guest.data.accomodation_address && (
                <div className="min-w-0">
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                    Accommodation Address
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {guest.data.accomodation_address}
                  </p>
                </div>
              )}
          </div>

          {/* Section 3: Notes (If any) */}
          {guest.data.note && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-zinc-400" />
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
                    Notes & Details
                  </p>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-50/50 dark:bg-zinc-900/20 p-3 rounded-md border border-zinc-100 dark:border-zinc-800">
                  {guest.data.note}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Events Section (Full Width Below) */}
      <div className="mt-5">
        <Card className="shadow-sm overflow-hidden py-0 gap-0">
          <CardHeader className="bg-linear-to-r from-indigo-500 to-purple-600 p-5 text-white">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 opacity-90" />
              Event Invitations & RSVPs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {guest.data.guestEventInvite.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">
                No events assigned to this guest.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {guest.data.guestEventInvite.map((invite) => (
                  <GuestInviteCard
                    key={invite.id}
                    invite={invite}
                    links={shareLinks.get(invite.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
