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

export default function WeddingCard() {
  const { setOpen } = useWedding();
  const [menuOpen, setMenuOpen] = useState(false);

  // Button/badge are visible when: card is hovered OR menu is open
  // We drive hover via CSS group, but lock the state open via menuOpen
  const menuActive = menuOpen;

  return (
    <Card className="group overflow-hidden gap-0 py-0 hover:shadow-lg transition-all hover:-translate-y-1">
      {/* Header (Hero section) */}
      <CardHeader className="bg-linear-to-r from-orange-500 to-pink-600 text-white space-y-1 relative p-5">
        {/* Badge — hidden on hover OR while menu is open */}
        <Badge
          className={`absolute right-3 top-3 bg-white/20 text-white hover:bg-white/20 pointer-events-none transition-opacity duration-200 ${
            menuActive ? "opacity-0" : "group-hover:opacity-0"
          }`}
        >
          This Week
        </Badge>

        {/* Options button — visible on hover OR while menu is open */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              id="wedding-card-options-btn"
              variant="ghost"
              size="icon"
              className={`absolute right-2 top-2 h-7 w-7 text-white hover:bg-white/20 hover:text-white focus-visible:ring-0 transition-opacity duration-200 ${
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
              onClick={() => setOpen("edit")}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id="wedding-card-delete-btn"
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => setOpen("delete")}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h3 className="text-lg font-semibold">Tanvi & Aditya</h3>
        <p className="text-sm text-white/80">16 Jun 2026 · Mumbai</p>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-5 space-y-5">
        {/* Venue */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Taj Lands End</span>
        </div>

        {/* Stats (grid is unavoidable in CSS) */}
        <div className="grid grid-cols-3 text-left">
          <Stat value="186" label="Guests" />
          <Stat value="3" label="Events" />
          <Stat value="94%" label="Confirmed" />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0 pb-5 px-4 border-t-0 bg-transparent">
        <ProgressBar value={94} />
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
