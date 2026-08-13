"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import type { SupplierWeekRow } from "@/schema/foodcost/foodcost.schema";

const COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];

function formatCurrency(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PurchaseRatioChart({ suppliers }: { suppliers: SupplierWeekRow[] }) {
  const sorted = [...suppliers]
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total);

  const top = sorted.slice(0, 7);
  const rest = sorted.slice(7);
  const otherTotal = rest.reduce((a, s) => a + s.total, 0);

  const data = [
    ...top.map((s) => ({ name: s.supplier_name, value: s.total })),
    ...(otherTotal > 0 ? [{ name: "Other", value: otherTotal }] : []),
  ];

  const chartConfig = data.reduce((config, item, index) => {
    config[item.name] = { label: item.name, color: COLORS[index % COLORS.length] };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Ratio</CardTitle>
        <CardDescription>Purchase share per supplier this week</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No purchase data for this week yet.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-80">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [formatCurrency(Number(value)), ""]}
                  />
                }
              />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={2}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
