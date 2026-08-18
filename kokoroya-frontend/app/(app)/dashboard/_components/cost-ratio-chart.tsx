"use client";

import { LineChart, Line, XAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  purchase: { label: "Purchase %", color: "#eb6834" },
  labour: { label: "Labour %", color: "#eda100" },
} satisfies ChartConfig;

export function CostRatioChart({
  data,
}: {
  data: { week: string; purchase: number; labour: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Ratios</CardTitle>
        <CardDescription>Purchase & labour cost as % of net sales</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-72 w-full">
          <LineChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}%`,
                    chartConfig[name as keyof typeof chartConfig]?.label ?? name,
                  ]}
                />
              }
            />
            <Line
              dataKey="purchase"
              type="monotone"
              stroke="var(--color-purchase)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              dataKey="labour"
              type="monotone"
              stroke="var(--color-labour)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
