import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getInitials, getWeddingColor } from "@/lib/weddingColor";
import { formatWeddingDate } from "@/lib/weddingDate";
import type { Wedding } from "@/models/wedding.model";
import { activeWeddingAtom, activeWeddingIdAtom } from "@/store/store";
import { useAtomValue, useSetAtom } from "jotai";
import { MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useWedding } from "./WeddingProvider";

export default function WeddingCard({ wedding }: { wedding: Wedding }) {
  const { setOpen, setCurrentRow } = useWedding();
  const [menuOpen, setMenuOpen] = useState(false);
  const setActiveWeddingId = useSetAtom(activeWeddingIdAtom);
  const setActiveWeddingStore = useSetAtom(activeWeddingAtom);
  const activeWeddingId = useAtomValue(activeWeddingIdAtom);
  const navigate = useNavigate();

  const isActive = activeWeddingId === wedding.id;
  const confirmed = wedding.confirmationRate ?? 0;

  const open = () => {
    setActiveWeddingId(wedding.id);
    setActiveWeddingStore(wedding);
    navigate("/wedding-dashboard");
  };

  return (
    // Hairline card, no colour slab. The wedding's identity colour rides on
    // the initials chip — the same chip it wears in the sidebar switcher — and
    // on the confirmation bar, which is where colour carries meaning.
    <article
      className={cn(
        "flex min-w-0 flex-col rounded-xl border bg-card p-5 transition-colors",
        isActive ? "border-primary" : "border-border hover:border-ring",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md bg-linear-to-br text-xs font-bold text-white",
            getWeddingColor(wedding.id),
          )}
        >
          {getInitials(wedding.bride_name, wedding.groom_name)}
        </span>

        <div className="min-w-0 flex-1">
          {/* Wraps to a second line rather than cutting off — a long couple's
              name is the one thing on this card that must stay readable. */}
          <h3
            className="line-clamp-2 text-base font-semibold tracking-[-0.02em]"
            title={wedding.title}
          >
            {wedding.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">
              {formatWeddingDate(wedding.date)}
              {wedding.city ? `, ${wedding.city}` : ""}
            </span>
            {wedding.tag && (
              <span className="shrink-0 rounded-md border border-border px-1.5 py-0.5 text-xs">
                {wedding.tag}
              </span>
            )}
          </p>
        </div>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mt-1 -mr-2 shrink-0 text-muted-foreground"
              aria-label={`Options for ${wedding.title}`}
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setCurrentRow(wedding);
                setOpen("edit");
              }}
            >
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                setCurrentRow(wedding);
                setOpen("delete");
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex min-w-0 items-start gap-2 border-t border-border pt-4 text-sm">
        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="truncate">{wedding.venue || "Venue not set"}</p>
          {wedding.address && (
            <p
              className="truncate text-xs text-muted-foreground"
              title={wedding.address}
            >
              {wedding.address}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        <Stat value={wedding.totalGuests ?? 0} label="Guests" />
        <Stat value={wedding.totalEvents ?? 0} label="Events" />
        <Stat value={`${confirmed}%`} label="Confirmed" />
      </dl>

      <div
        className="mt-3 mb-5 h-1 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={confirmed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${confirmed}% of guests confirmed`}
      >
        <div
          className={cn("h-full bg-linear-to-r", getWeddingColor(wedding.id))}
          style={{ width: `${confirmed}%` }}
        />
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
        <Button
          variant={isActive ? "default" : "outline"}
          className="flex-1"
          onClick={open}
        >
          {isActive ? "Open dashboard" : "Switch to this wedding"}
        </Button>
        {isActive && (
          <span className="shrink-0 rounded-md border border-primary bg-primary/15 px-2 py-1 text-xs font-medium">
            Active
          </span>
        )}
      </div>
    </article>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <dd className="font-display text-xl font-medium tracking-[-0.02em] tabular-nums">
        {value}
      </dd>
      <dt className="mt-0.5 text-xs text-muted-foreground">{label}</dt>
    </div>
  );
}
