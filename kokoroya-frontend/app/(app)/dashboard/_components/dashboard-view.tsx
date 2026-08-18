"use client";

import { useQueries } from "@tanstack/react-query";
import { getWeeklyReportAction } from "@/lib/actions/foodcost";
import { getLabourWeeklyReportAction } from "@/lib/actions/labour";
import { mondayOf, isoDate, addDays } from "@/lib/date";
import { PurchaseRatioChart } from "@/app/(app)/food-cost/_components/purchase-ratio-chart";
import { SalesTrendChart } from "./sales-trend-chart";
import { CostRatioChart } from "./cost-ratio-chart";

const WEEKS_BACK = 8;

function formatWeekLabel(weekStartDate: string) {
  const d = new Date(`${weekStartDate}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function money(amount: number) {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function DashboardView() {
  const thisMonday = mondayOf(new Date());
  const weekStartDates = Array.from({ length: WEEKS_BACK }, (_, i) =>
    isoDate(addDays(thisMonday, -(WEEKS_BACK - 1 - i) * 7)),
  );

  const foodCostQueries = useQueries({
    queries: weekStartDates.map((week) => ({
      queryKey: ["food-cost-report", week],
      queryFn: () => getWeeklyReportAction(week),
    })),
  });
  const labourQueries = useQueries({
    queries: weekStartDates.map((week) => ({
      queryKey: ["labour-report", week],
      queryFn: () => getLabourWeeklyReportAction(week),
    })),
  });

  const isLoading =
    foodCostQueries.some((q) => q.isLoading) || labourQueries.some((q) => q.isLoading);
  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  const salesData = weekStartDates.map((week, i) => ({
    week: formatWeekLabel(week),
    gross: foodCostQueries[i].data?.gross_sales_total ?? 0,
    net: foodCostQueries[i].data?.net_sales ?? 0,
  }));

  const ratioData = weekStartDates.map((week, i) => ({
    week: formatWeekLabel(week),
    purchase: foodCostQueries[i].data?.purchase_ratio_pct ?? 0,
    labour: (() => {
      const netSales = foodCostQueries[i].data?.net_sales ?? 0;
      const labourTotal = labourQueries[i].data?.labour_total ?? 0;
      return netSales > 0 ? (labourTotal / netSales) * 100 : 0;
    })(),
  }));

  const thisWeek = foodCostQueries[WEEKS_BACK - 1].data;
  const thisWeekLabour = labourQueries[WEEKS_BACK - 1].data;
  const thisWeekLabourPct =
    thisWeek && thisWeek.net_sales > 0 && thisWeekLabour
      ? (thisWeekLabour.labour_total / thisWeek.net_sales) * 100
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="This Week's Gross Sales" value={`$${money(thisWeek?.gross_sales_total ?? 0)}`} />
        <StatCard label="This Week's Net Sales" value={`$${money(thisWeek?.net_sales ?? 0)}`} />
        <StatCard label="Purchase Ratio" value={`${(thisWeek?.purchase_ratio_pct ?? 0).toFixed(1)}%`} />
        <StatCard label="Labour Cost %" value={`${thisWeekLabourPct.toFixed(1)}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SalesTrendChart data={salesData} />
        <CostRatioChart data={ratioData} />
      </div>

      {thisWeek && (
        <div className="max-w-md">
          <PurchaseRatioChart suppliers={thisWeek.suppliers} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
