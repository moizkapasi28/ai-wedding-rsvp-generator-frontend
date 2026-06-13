import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Response",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "Sunday", desktop: 186 },
  { month: "Monday", desktop: 305 },
  { month: "Tuesday", desktop: 237 },
  { month: "Wednesday", desktop: 73 },
  { month: "Thrusday", desktop: 209 },
  { month: "Friday", desktop: 214 },
  { month: "Saturday", desktop: 214 },
];

export default function ResponseStatsChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full"
      style={{ height: 215, aspectRatio: "auto" }}
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
