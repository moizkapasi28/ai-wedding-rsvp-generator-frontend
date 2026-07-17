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
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import type { Guest } from "@/models/guest.model";
import { cn } from "@/lib/utils";
import { formatSide, getSideBadgeStyles } from "../EventCard";

function GuestActionsCell({ guest }: { guest: Guest }) {
  const { setOpen, setCurrentRow } = useGuest();
  const navigate = useNavigate();
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
          onClick={() => navigate(`/guests/${guest.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setCurrentRow(guest);
            setOpen("edit");
          }}
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
    cell: ({ row }) => {

      return (
        <Badge
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5",
            getSideBadgeStyles(row.original.side),
          )}
        >
          {formatSide(row.original.side)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "group",
    header: "Group",
    cell: ({ row }) => {
      const groupColors: Record<string, string> = {
        FAMILY: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950/30 dark:text-fuchsia-300 dark:border-fuchsia-900/50",
        FRIEND: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/50",
        RELATIVE: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-900/50",
        EMPLOYEE: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/50",
        COLLEAGUE: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-900/50",
        VIP: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50",
        OTHER: "bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-950/30 dark:text-stone-300 dark:border-stone-900/50",
      };
      
      const groupStr = row.original.group || "OTHER";
      
      return (
        <Badge
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5",
            groupColors[groupStr] || groupColors.OTHER
          )}
        >
          {groupStr}
        </Badge>
      );
    },
  },
  {
    accessorKey: "events",
    header: "Events",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.guestEventInvite.map((invite) => {
          const status = invite.status?.toLowerCase() || 'pending';
          const statusColors: Record<string, string> = {
            attending: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50",
            declined: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50",
            maybe: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50",
            pending: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900/50"
          };

          return (
            <Badge
              key={invite.id}
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 mt-0.5",
                statusColors[status] || statusColors.pending
              )}
            >
              {invite.event.title}
            </Badge>
          );
        })}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <GuestActionsCell guest={row.original} />,
  },
];
