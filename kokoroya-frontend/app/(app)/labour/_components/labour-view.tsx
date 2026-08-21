"use client";

import { useQuery } from "@tanstack/react-query";
import { getLabourReportAction } from "@/lib/actions/labour";
import { getReportAction as getFoodCostReportAction } from "@/lib/actions/foodcost";
import { useDateRange } from "@/app/(app)/_components/use-date-range";
import { DateRangePicker } from "@/app/(app)/_components/date-range-picker";
import { ExportButton } from "@/app/(app)/_components/export-button";
import { downloadExcel } from "@/lib/excel";
import { LabourGrid } from "./labour-grid";
import { LabourRateCard } from "./labour-rate-card";

export function LabourView() {
  const { from, to, startDate, endDate, dates, setRange } = useDateRange();

  const queryKey = ["labour-report", startDate, endDate];
  const {
    data: report,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getLabourReportAction(startDate, endDate),
  });

  const { data: foodCostReport } = useQuery({
    queryKey: ["food-cost-report", startDate, endDate],
    queryFn: () => getFoodCostReportAction(startDate, endDate),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) {
    return (
      <p className="text-destructive">
        Failed to load labour report: {error.message}
      </p>
    );
  }
  if (!report) return null;

  const netSales = foodCostReport?.net_sales ?? 0;
  const labourCostPct = netSales > 0 ? (report.labour_total / netSales) * 100 : 0;

  function handleExport() {
    if (!report) return;
    downloadExcel(`labour-${startDate}-to-${endDate}.xlsx`, [
      {
        name: "Hours",
        rows: report!.employees.map((e) => ({
          Employee: e.name,
          ...Object.fromEntries(dates.map((d) => [d, e.daily_hours[d] || 0])),
          "Total Hours": e.total_hours,
          "% of All": e.percentage_of_all,
          "Gross Pay": e.gross_pay,
        })),
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateRangePicker from={from} to={to} onChange={setRange} />
        <ExportButton onClick={handleExport} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Hours" value={report.employees.reduce((a, e) => a + e.total_hours, 0)} suffix="h" />
        <StatCard label="Labour Cost" value={report.labour_total} money />
        <StatCard label="Labour Cost %" value={labourCostPct} percent />
      </div>

      <LabourRateCard
        rangeStart={from}
        weekdayRate={report.weekday_rate}
        weekendRate={report.weekend_rate}
        refetch={refetch}
      />

      <LabourGrid dates={dates} report={report} queryKey={queryKey} refetch={refetch} />
    </div>
  );
}

function StatCard({
  label,
  value,
  money,
  percent,
  suffix,
}: {
  label: string;
  value: number;
  money?: boolean;
  percent?: boolean;
  suffix?: string;
}) {
  let display: string;
  if (money) {
    display = value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (percent) {
    display = `${value.toFixed(2)}%`;
  } else {
    display = `${value.toFixed(2)}${suffix ?? ""}`;
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="text-xl font-bold">{display}</div>
    </div>
  );
}
