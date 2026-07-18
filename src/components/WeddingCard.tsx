import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useWedding } from "./WeddingProvider";
import type { Wedding } from "@/models/wedding.model";

export default function WeddingCard({ wedding }: { wedding: Wedding }) {
  const { setOpen, setCurrentRow } = useWedding();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuActive = menuOpen;

  return (
    <Card className="group overflow-hidden gap-0 py-0 hover:shadow-lg transition-all hover:-translate-y-1">
      <CardHeader className="bg-linear-to-r from-orange-500 to-pink-600 text-white space-y-1 relative px-5 pb-5 pt-3">
        <Badge
          className={`absolute right-5 top-3 bg-white/20 text-white hover:bg-white/20 pointer-events-none transition-opacity duration-200 ${
            menuActive ? "opacity-0" : "group-hover:opacity-0"
          }`}
        >
          {wedding.tag}
        </Badge>

        {/* Options button — visible on hover OR while menu is open */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              id="wedding-card-options-btn"
              variant="ghost"
              size="icon"
              className={`absolute right-4 top-2 h-7 w-7 text-white hover:bg-white/20 hover:text-white focus-visible:ring-0 transition-opacity duration-200 ${
                menuActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-label="Wedding options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              id="wedding-card-edit-btn"
              className="cursor-pointer"
              onClick={() => {
                setCurrentRow(wedding);
                setOpen("edit");
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id="wedding-card-delete-btn"
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                setCurrentRow(wedding);
                setOpen("delete");
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-[calc(100%-6rem)]">
          <h3 className="text-lg font-semibold truncate">{wedding.title}</h3>
          <p className="text-sm text-white/80 truncate mt-1">
            {new Date(wedding.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            · {wedding.city}
          </p>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-5 space-y-5">
        {/* Venue & Address */}
        <div className="flex items-start gap-2.5 flex-1 min-w-0 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-foreground/70" />
          <div className="flex flex-col min-w-0 w-full">
            <span className="font-semibold text-foreground truncate">
              {wedding.venue}
            </span>
            {wedding.address && (
              <span className="text-xs truncate" title={wedding.address}>
                {wedding.address}
              </span>
            )}
          </div>
        </div>

        {/* Stats (grid is unavoidable in CSS) */}
        <div className="grid grid-cols-3 text-left">
          <Stat value={String(wedding.totalGuests) || "0"} label="Guests" />
          <Stat value={String(wedding.totalEvents) || "0"} label="Events" />
          <Stat
            value={`${String(wedding.confirmationRate) || "0"}%`}
            label="Confirmed"
          />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0 pb-5 px-4 border-t-0 bg-transparent">
        <ProgressBar value={wedding.confirmationRate ?? 0} />
      </CardFooter>
    </Card>
  );
}

/* Small reusable pieces (this is where real cleanliness comes from) */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-base font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-linear-to-r from-orange-500 to-pink-600"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
