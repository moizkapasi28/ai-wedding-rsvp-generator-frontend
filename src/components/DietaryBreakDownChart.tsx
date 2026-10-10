import { Pie, PieChart, Legend } from "recharts";

import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type BreakdownItem = { name: string; label: string; value: number };

// --chart-1 … --chart-7 in index.css
const CHART_SLOTS = 7;

export function DietaryBreakDownChart({ data }: { data: BreakdownItem[] }) {
  // One theme chart colour per slice, in slot order. Seven slots cover the longest list
  // this chart gets (the seven dietary options); an eighth slice would reuse slot 1.
  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((item, i) => [
      item.name,
      { label: item.label, color: `var(--chart-${(i % CHART_SLOTS) + 1})` },
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
          // A thin gap in the card's own colour between slices, so two neighbours are
          // told apart by the break as well as by hue
          stroke="var(--card)"
          strokeWidth={2}
        />
        <Legend
          // Seven entries don't fit on one line in a narrow card; wrap rather than clip
          content={
            <ChartLegendContent
              nameKey="name"
              className="flex-wrap gap-x-4 gap-y-1"
            />
          }
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ChartContainer>
  );
}
