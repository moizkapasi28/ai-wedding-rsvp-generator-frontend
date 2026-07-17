import { formatSide, getSideBadgeStyles } from "@/components/EventCard";
import Page, { PageHeader } from "@/components/Page";
import ToolBar from "@/components/ToolBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetGuest } from "@/hooks/use-guest";
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


const getStatusBadgeStyles = (status: string) => {
  const statusColors: Record<string, string> = {
    attending: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50",
    declined: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50",
    maybe: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50",
    pending: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900/50"
  };
  return statusColors[status.toLowerCase()] || statusColors.pending;
};

const getEventCardVariantStyles = (status: string) => {
  const styles: Record<string, string> = {
    attending: "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20",
    declined: "border-rose-200 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-950/20",
    maybe: "border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20",
    pending: "border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/20"
  };
  return styles[status.toLowerCase()] || styles.pending;
};

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

  if (!id)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Guest Id is required to view guest details...
      </div>
    );

  const { data: guest, isLoading, isPending, isError } = useGetGuest(id);

  if (isLoading || isPending) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading guest details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load guest details. Please try again.
      </div>
    );
  }

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
                  getSideBadgeStyles(guest.data.side as any)
                )}
              >
                {formatSide(guest.data.side as any)}
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
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {guest.data.guestEventInvite.map((invite: any) => (
                  <div
                    key={invite.id}
                    className={cn(
                      "p-4 rounded-lg border space-y-4 flex flex-col transition-colors",
                      getEventCardVariantStyles(invite.status)
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-lg">
                          {invite.event.title}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize mt-1">
                          {invite.event.date
                            ? new Date(invite.event.date).toLocaleDateString()
                            : ""}{" "}
                          {invite.event.time ? `• ${invite.event.time}` : ""}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize mt-1">
                          Venue: {invite.event.venue}
                          {invite.event.city && `, ${invite.event.city}`}
                        </p>
                        {invite.event.address && (
                          <p className="text-xs text-zinc-400 mt-1">
                            {invite.event.address}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5",
                            getStatusBadgeStyles(invite.status)
                          )}
                        >
                          {invite.status}
                        </Badge>
                        {invite.responded_at ? (
                          <p className="text-[10px] text-zinc-400">
                            Responded:{" "}
                            {new Date(invite.responded_at).toLocaleDateString()}
                          </p>
                        ) : invite.invite_deadline ? (
                          <p className="text-[10px] text-orange-400">
                            Deadline:{" "}
                            {new Date(
                              invite.invite_deadline,
                            ).toLocaleDateString()}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {invite.event.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mt-2 border-l-2 border-zinc-200 dark:border-zinc-700 pl-2">
                        {invite.event.description}
                      </p>
                    )}

                    {(invite.plus_ones ||
                      invite.dietary ||
                      invite.song_request ||
                      invite.message) && (
                        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-3 text-sm mt-auto">
                          {invite.plus_ones && (
                            <div>
                              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">
                                Plus Ones
                              </p>
                              <p>{invite.plus_ones}</p>
                            </div>
                          )}
                          {invite.dietary && (
                            <div>
                              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">
                                Dietary
                              </p>
                              <p>{invite.dietary}</p>
                            </div>
                          )}
                          {invite.song_request && (
                            <div className="col-span-2">
                              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">
                                Song Request
                              </p>
                              <p>{invite.song_request}</p>
                            </div>
                          )}
                          {invite.message && (
                            <div className="col-span-2">
                              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">
                                Message
                              </p>
                              <p>{invite.message}</p>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
