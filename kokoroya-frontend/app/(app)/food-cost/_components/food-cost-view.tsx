"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getLabourWeeklyReportAction } from "@/lib/actions/labour";
import { useFoodCostReport } from "./use-food-cost-report";
import { WeekNav } from "@/app/(app)/_components/week-nav";
import { GrossSalesRow } from "./gross-sales-row";
import { NetSalesRateCard } from "./net-sales-rate-card";
import { WeeklyOverviewTable } from "./weekly-overview-table";

export function FoodCostView() {
  const {
    monday,
    weekStartDate,
    weekDates,
    prevWeekParam,
    nextWeekParam,
    report,
    queryKey,
    refetch,
    isLoading,
    error,
  } = useFoodCostReport();

  const { data: labourReport } = useQuery({
    queryKey: ["labour-report", weekStartDate],
    queryFn: () => getLabourWeeklyReportAction(weekStartDate),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) {
    return (
      <p className="text-destructive">
        Failed to load food cost report: {error.message}
      </p>
    );
  }
  if (!report) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <WeekNav
          monday={monday}
          weekStartDate={weekStartDate}
          prevWeekParam={prevWeekParam}
          nextWeekParam={nextWeekParam}
        />
        <Button variant="brutal" render={<Link href="/food-cost/purchase-report" />}>
          Purchase Report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Gross Sales" value={report.gross_sales_total} money />
        <StatCard label="Net Sales" value={report.net_sales} money />
        <StatCard label="Total Purchase" value={report.grand_total_purchase} money />
        <StatCard label="Purchase Ratio" value={report.purchase_ratio_pct} percent />
      </div>

      <GrossSalesRow
        weekDates={weekDates}
        report={report}
        queryKey={queryKey}
        refetch={refetch}
      />
      <NetSalesRateCard
        weekStartDate={weekStartDate}
        report={report}
        queryKey={queryKey}
        refetch={refetch}
      />

      {labourReport && (
        <WeeklyOverviewTable
          weekDates={weekDates}
          report={report}
          labourReport={labourReport}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  money,
  percent,
}: {
  label: string;
  value: number;
  money?: boolean;
  percent?: boolean;
}) {
  const display = money
    ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : `${value.toFixed(1)}%`;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="text-xl font-bold">{display}</div>
    </div>
  );
}
