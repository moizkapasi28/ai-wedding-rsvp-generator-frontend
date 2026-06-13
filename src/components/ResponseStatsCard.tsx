import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResponseStatsChart from "./ResponseStatsChart";

export default function ResponseStatsCard() {
  return (
    <Card className="py-5">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Response this week</CardTitle>

          <CardDescription>
            Daily RSVP submissions across all events
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="">
        <ResponseStatsChart />
      </CardContent>

      <CardFooter className="bg-transparent border-none"></CardFooter>
    </Card>
  );
}
