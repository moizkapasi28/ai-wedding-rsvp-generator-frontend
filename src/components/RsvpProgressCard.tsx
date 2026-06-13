import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { MultiProgressBar } from "./custom/MultiProgressBar";
export default function RsvpProgressCard() {
  return (
    <Card className="py-5">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>RSVP Progress by Event</CardTitle>

          <CardDescription>How each function is filling up</CardDescription>
        </div>

        <Button variant="ghost" size="sm">
          View all events
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <EventProgressRow />
        <EventProgressRow />
        <EventProgressRow />
        <EventProgressRow />
      </CardContent>

      <CardFooter className="bg-transparent border-none"></CardFooter>
    </Card>
  );
}

export function EventProgressRow() {
  return (
    <div>
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-row gap-2">
          <p className="font-medium">Mehndi</p>

          <p className="text-sm text-muted-foreground">
            12 Dec · Agarwal Residence
          </p>
        </div>

        <div className="text-sm">
          <span className="font-medium">50</span>
          <span className="text-muted-foreground"> / 100 invited</span>
        </div>
      </div>

      <MultiProgressBar confirmed={50} maybe={10} declined={5} />
    </div>
  );
}
