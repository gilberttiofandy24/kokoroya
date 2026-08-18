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
  gross: { label: "Gross Sales", color: "#2a78d6" },
  net: { label: "Net Sales", color: "#1baf7a" },
} satisfies ChartConfig;

export function SalesTrendChart({
  data,
}: {
  data: { week: string; gross: number; net: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
        <CardDescription>Gross vs net sales, last {data.length} weeks</CardDescription>
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
                    `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    chartConfig[name as keyof typeof chartConfig]?.label ?? name,
                  ]}
                />
              }
            />
            <Line
              dataKey="gross"
              type="monotone"
              stroke="var(--color-gross)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              dataKey="net"
              type="monotone"
              stroke="var(--color-net)"
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
