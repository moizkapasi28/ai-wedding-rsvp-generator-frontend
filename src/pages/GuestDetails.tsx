import Page, { PageHeader } from "@/components/Page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ToolBar from "@/components/ToolBar";
import type { Guest } from "@/models/guest.model";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, User, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Mock Data until the API is connected
const MOCK_GUEST: Guest = {
  id: "e48c9cea-68f8-4db0-bdfe-f7cba6b38038",
  name: "Nafisa Kapasi",
  email: "nafisakapasi@example.com",
  mobile_number: "6355894753",
  side: "BRIDE",
  group: "FAMILY",
  accomodation_required: true,
  accomodation_address: "Taj Mahal Palace Hotel, Mumbai, India",
  note: "VIP guest, requires airport pickup and early check-in.",
  created_at: "2026-07-16T20:54:38.411Z",
  updated_at: "2026-07-16T20:54:38.411Z",
  guestEventInvite: [
    {
      id: "4bc4c636-49f4-484e-aaaa-4adb2ee5e542",
      guest_id: "e48c9cea-68f8-4db0-bdfe-f7cba6b38038",
      event_id: "b210a045-18dd-4a5b-bdf0-bc3c239c099e",
      invite_format_id: "bff0d1e4-2e4b-4979-a2f0-540eb49fd9f6",
      invite_token: "f5ffeeab-d85a-428e-969d-ce39a519fdc9",
      status: "MAYBE",
      plus_ones: 2,
      dietary: "Vegan only, no gluten",
      song_request: "Perfect by Ed Sheeran",
      message: "Can't wait to celebrate with you both!",
      invite_deadline: "2026-07-25T00:00:00.000Z",
      responded_at: "2026-07-16T21:00:00.000Z",
      created_at: "2026-07-16T20:54:38.419Z",
      updated_at: "2026-07-16T20:54:38.419Z",
      event: {
        id: "b210a045-18dd-4a5b-bdf0-bc3c239c099e",
        wedding_id: "b57e9713-326f-466a-9d81-4a251b4dde4c",
        title: "Nikah Ceremony",
        description: "Lorem Ipsum is simply dummy text...",
        date: "2026-07-31T00:00:00.000Z",
        time: "21:50",
        venue: "TCS Office",
        address: "Mega It Park, DA IICT Rd, Infocity, Gandhinagar, Gujarat 382007, India",
        latitude: null,
        longitude: null,
        city: "Gandhinagar",
        event_side: "BOTH",
        created_at: "2026-07-16T13:18:55.347Z",
        updated_at: "2026-07-16T13:18:55.347Z",
      },
    },
    {
      id: "4bc4c636-49f4-484e-aaaa-4adb2ee5e542",
      guest_id: "e48c9cea-68f8-4db0-bdfe-f7cba6b38038",
      event_id: "b210a045-18dd-4a5b-bdf0-bc3c239c099e",
      invite_format_id: "bff0d1e4-2e4b-4979-a2f0-540eb49fd9f6",
      invite_token: "f5ffeeab-d85a-428e-969d-ce39a519fdc9",
      status: "MAYBE",
      plus_ones: 2,
      dietary: "Vegan only, no gluten",
      song_request: "Perfect by Ed Sheeran",
      message: "Can't wait to celebrate with you both!",
      invite_deadline: "2026-07-25T00:00:00.000Z",
      responded_at: "2026-07-16T21:00:00.000Z",
      created_at: "2026-07-16T20:54:38.419Z",
      updated_at: "2026-07-16T20:54:38.419Z",
      event: {
        id: "b210a045-18dd-4a5b-bdf0-bc3c239c099e",
        wedding_id: "b57e9713-326f-466a-9d81-4a251b4dde4c",
        title: "Nikah Ceremony",
        description: "Can't wait to celebrate with you both! Can't wait to celebrate with you both! Can't wait to celebrate with you both! Can't wait to celebrate with you both! ",
        date: "2026-07-31T00:00:00.000Z",
        time: "21:50",
        venue: "TCS Office",
        address: "Mega It Park, DA IICT Rd, Infocity, Gandhinagar, Gujarat 382007, India",
        latitude: null,
        longitude: null,
        city: "Gandhinagar",
        event_side: "BOTH",
        created_at: "2026-07-16T13:18:55.347Z",
        updated_at: "2026-07-16T13:18:55.347Z",
      },
    },
    {
      id: "4bc4c636-49f4-484e-aaaa-4adb2ee5e542",
      guest_id: "e48c9cea-68f8-4db0-bdfe-f7cba6b38038",
      event_id: "b210a045-18dd-4a5b-bdf0-bc3c239c099e",
      invite_format_id: "bff0d1e4-2e4b-4979-a2f0-540eb49fd9f6",
      invite_token: "f5ffeeab-d85a-428e-969d-ce39a519fdc9",
      status: "MAYBE",
      plus_ones: 2,
      dietary: "Vegan only, no gluten",
      song_request: "Perfect by Ed Sheeran",
      message: "Can't wait to celebrate with you both! Can't wait to celebrate with you both! Can't wait to celebrate with you both! Can't wait to celebrate with you both!",
      invite_deadline: "2026-07-25T00:00:00.000Z",
      responded_at: "2026-07-16T21:00:00.000Z",
      created_at: "2026-07-16T20:54:38.419Z",
      updated_at: "2026-07-16T20:54:38.419Z",
      event: {
        id: "b210a045-18dd-4a5b-bdf0-bc3c239c099e",
        wedding_id: "b57e9713-326f-466a-9d81-4a251b4dde4c",
        title: "Nikah Ceremony",
        description: "Lorem Ipsum is simply dummy text",
        date: "2026-07-31T00:00:00.000Z",
        time: "21:50",
        venue: "TCS Office",
        address: "Mega It Park, DA IICT Rd, Infocity, Gandhinagar, Gujarat 382007, India",
        latitude: null,
        longitude: null,
        city: "Gandhinagar",
        event_side: "BOTH",
        created_at: "2026-07-16T13:18:55.347Z",
        updated_at: "2026-07-16T13:18:55.347Z",
      },
    },
  ],
};

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "attending":
      return "default";
    case "pending":
      return "secondary";
    case "declined":
      return "destructive";
    default:
      return "outline";
  }
};

export default function GuestDetails() {
  // const { id } = useParams();

  // Here we would typically fetch the guest by id:
  // const { data: guest, isLoading } = useGetGuestById(id);
  const guest = MOCK_GUEST; // Fallback to mock

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
      <Card className="shadow-sm mb-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Guest Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section 1: Basic Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:flex xl:justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Guest Name</p>
              <p className="font-medium text-base truncate">{guest.name}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Email Address</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-sm truncate">{guest.email}</p>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Mobile Number</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-sm truncate">{guest.mobile_number}</p>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Wedding Side</p>
              <Badge variant="outline" className="capitalize">{guest.side.toLowerCase()}</Badge>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Guest Group</p>
              <Badge variant="outline" className="capitalize">{guest.group.toLowerCase()}</Badge>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Added On</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-sm truncate">{new Date(guest.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Accommodation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:gap-24 gap-6">
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Accommodation</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                <p className="text-sm font-medium">{guest.accomodation_required ? "Requested" : "Not Required"}</p>
              </div>
            </div>
            {guest.accomodation_required && guest.accomodation_address && (
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Accommodation Address</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{guest.accomodation_address}</p>
              </div>
            )}
          </div>

          {/* Section 3: Notes (If any) */}
          {guest.note && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-zinc-400" />
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Notes & Details</p>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-50/50 dark:bg-zinc-900/20 p-3 rounded-md border border-zinc-100 dark:border-zinc-800">
                  {guest.note}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Events Section (Full Width Below) */}
      <div className="mt-5">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Event Invitations & RSVPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guest.guestEventInvite.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No events assigned to this guest.</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {guest.guestEventInvite.map((invite) => (
                  <div key={invite.id} className="p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-4 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-lg">{invite.event.title}</p>
                        <p className="text-xs text-zinc-500 capitalize mt-1">
                          {invite.event.date ? new Date(invite.event.date).toLocaleDateString() : ""} {invite.event.time ? `• ${invite.event.time}` : ""}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize mt-1">
                          Venue: {invite.event.venue}
                          {invite.event.city && `, ${invite.event.city}`}
                        </p>
                        {invite.event.address && (
                          <p className="text-xs text-zinc-400 mt-1">{invite.event.address}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusBadgeVariant(invite.status)}>
                          {invite.status}
                        </Badge>
                        {invite.responded_at ? (
                          <p className="text-[10px] text-zinc-400">Responded: {new Date(invite.responded_at).toLocaleDateString()}</p>
                        ) : invite.invite_deadline ? (
                          <p className="text-[10px] text-orange-400">Deadline: {new Date(invite.invite_deadline).toLocaleDateString()}</p>
                        ) : null}
                      </div>
                    </div>

                    {invite.event.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 italic mt-2 border-l-2 border-zinc-200 dark:border-zinc-700 pl-2">
                        {invite.event.description}
                      </p>
                    )}

                    {(invite.plus_ones || invite.dietary || invite.song_request || invite.message) && (
                      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-3 text-sm mt-auto">
                        {invite.plus_ones && (
                          <div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">Plus Ones</p>
                            <p>{invite.plus_ones}</p>
                          </div>
                        )}
                        {invite.dietary && (
                          <div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">Dietary</p>
                            <p>{invite.dietary}</p>
                          </div>
                        )}
                        {invite.song_request && (
                          <div className="col-span-2">
                            <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">Song Request</p>
                            <p>{invite.song_request}</p>
                          </div>
                        )}
                        {invite.message && (
                          <div className="col-span-2">
                            <p className="text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1">Message</p>
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
