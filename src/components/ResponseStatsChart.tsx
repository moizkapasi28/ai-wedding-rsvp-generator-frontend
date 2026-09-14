import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { WeddingDashboard } from "@/models/wedding.model";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Responses",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = { data: WeddingDashboard["dailyResponses"] };

export default function ResponseStatsChart({ data }: Props) {
  // Dates are local YYYY-MM-DD; appending a time stops them parsing as UTC
  const chartData = data.map(({ date, count }) => ({
    day: new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      weekday: "short",
    }),
    count,
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full"
      style={{ height: 215, aspectRatio: "auto" }}
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
