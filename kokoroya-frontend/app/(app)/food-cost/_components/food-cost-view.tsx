"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getReportAction as getFoodCostReportAction } from "@/lib/actions/foodcost";
import { getLabourReportAction } from "@/lib/actions/labour";
import { useDateRange } from "@/app/(app)/_components/use-date-range";
import { DateRangePicker } from "@/app/(app)/_components/date-range-picker";
import { ExportButton } from "@/app/(app)/_components/export-button";
import { downloadExcel } from "@/lib/excel";
import { GrossSalesRow } from "./gross-sales-row";
import { NetSalesRateCard } from "./net-sales-rate-card";
import { WeeklyOverviewTable } from "./weekly-overview-table";

export function FoodCostView() {
  const { from, to, startDate, endDate, dates, setRange } = useDateRange();

  const queryKey = ["food-cost-report", startDate, endDate];
  const { data: report, refetch, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => getFoodCostReportAction(startDate, endDate),
  });

  const { data: labourReport } = useQuery({
    queryKey: ["labour-report", startDate, endDate],
    queryFn: () => getLabourReportAction(startDate, endDate),
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

  function handleExport() {
    if (!report) return;
    downloadExcel(`food-cost-${startDate}-to-${endDate}.xlsx`, [
      {
        name: "Gross Sales",
        rows: dates.map((date) => ({
          Date: date,
          "Gross Sales": report.gross_sales_daily[date] || 0,
        })),
      },
      {
        name: "Summary",
        rows: [
          { Metric: "Gross Sales Total", Value: report.gross_sales_total },
          { Metric: "Net Sales", Value: report.net_sales },
          { Metric: "Total Purchase", Value: report.grand_total_purchase },
          { Metric: "Purchase Ratio %", Value: report.purchase_ratio_pct },
        ],
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateRangePicker from={from} to={to} onChange={setRange} />
        <div className="flex items-center gap-2">
          <ExportButton onClick={handleExport} />
          <Button variant="brutal" render={<Link href="/food-cost/purchase-report" />}>
            Purchase Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Gross Sales" value={report.gross_sales_total} money />
        <StatCard label="Net Sales" value={report.net_sales} money />
        <StatCard label="Total Purchase" value={report.grand_total_purchase} money />
        <StatCard label="Purchase Ratio" value={report.purchase_ratio_pct} percent />
      </div>

      <GrossSalesRow dates={dates} report={report} queryKey={queryKey} refetch={refetch} />
      <NetSalesRateCard rangeStart={from} report={report} refetch={refetch} />

      {labourReport && (
        <WeeklyOverviewTable dates={dates} report={report} labourReport={labourReport} />
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
