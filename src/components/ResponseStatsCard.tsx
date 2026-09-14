import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WeddingDashboard } from "@/models/wedding.model";
import ResponseStatsChart from "./ResponseStatsChart";

type Props = { data: WeddingDashboard["dailyResponses"] };

export default function ResponseStatsCard({ data }: Props) {
  return (
    <Card className="py-5">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Responses this week</CardTitle>

          <CardDescription>
            Daily RSVP submissions across all events
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="">
        <ResponseStatsChart data={data} />
      </CardContent>
    </Card>
  );
}
