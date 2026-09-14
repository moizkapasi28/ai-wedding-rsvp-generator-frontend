import { Pie, PieChart, Legend } from "recharts";

import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type BreakdownItem = { name: string; label: string; value: number };

export function DietaryBreakDownChart({ data }: { data: BreakdownItem[] }) {
  // ponytail: 5 theme chart colors, repeats past 5 slices — add --chart-6+ if that gets confusing
  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((item, i) => [
      item.name,
      { label: item.label, color: `var(--chart-${(i % 5) + 1})` },
    ]),
  );
  const chartData = data.map((item) => ({
    ...item,
    fill: `var(--color-${item.name})`,
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto w-full"
      style={{ height: 215, aspectRatio: "auto" }}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={80}
          cx="50%"
          cy="45%"
        />
        <Legend
          content={<ChartLegendContent nameKey="name" />}
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ChartContainer>
  );
}
