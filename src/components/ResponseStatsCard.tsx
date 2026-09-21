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
    <Card>
      <CardHeader>
        <CardTitle>Responses this week</CardTitle>
        <CardDescription>
          Daily RSVP submissions across all events
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResponseStatsChart data={data} />
      </CardContent>
    </Card>
  );
}
