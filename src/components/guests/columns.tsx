import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGuest } from "@/components/GuestProvider";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export type Guest = {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  side: "BRIDE" | "GROOM";
  events: string[]; // event titles the guest is invited to
  status: "Attending" | "Declined" | "Pending";
};

// Status badge colour map
const statusVariant: Record<
  Guest["status"],
  "default" | "destructive" | "secondary" | "outline"
> = {
  Attending: "default",
  Declined: "destructive",
  Pending: "secondary",
};

// Inline cell component so it can call useGuest() inside the provider
function GuestActionsCell() {
  const { setOpen } = useGuest();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Guest options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen("edit")}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => setOpen("delete")}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "mobile_number",
    header: "Mobile",
  },
  {
    accessorKey: "side",
    header: "Side",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.side.charAt(0) + row.original.side.slice(1).toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "events",
    header: "Events",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.events.map((event) => (
          <Badge key={event} variant="secondary" className="text-xs font-normal">
            {event}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => <GuestActionsCell />,
  },
];
