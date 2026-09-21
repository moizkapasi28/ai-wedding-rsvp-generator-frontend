import type { ColumnDef } from "@tanstack/react-table";
import type { Guest } from "@/models/guest.model";
import GuestActionsCell from "./GuestActionsCell";
import { EventInviteBadges, GroupLabel, SideBadge } from "./GuestFields";

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "mobile_number",
    header: "Mobile",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.mobile_number}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    // Cells don't wrap, so long addresses would push the actions column off screen
    cell: ({ row }) => (
      <span
        className="block max-w-40 truncate text-muted-foreground"
        title={row.original.email}
      >
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "side",
    header: "Side",
    cell: ({ row }) => <SideBadge side={row.original.side} />,
  },
  {
    accessorKey: "group",
    header: "Group",
    // Plain text, not a badge: a group is a category, not a state, and seven
    // arbitrary hues next to the RSVP colours made neither readable.
    cell: ({ row }) => <GroupLabel group={row.original.group} />,
  },
  {
    accessorKey: "events",
    header: "Events",
    cell: ({ row }) => (
      <EventInviteBadges invites={row.original.guestEventInvite} />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <GuestActionsCell guest={row.original} />,
  },
];

