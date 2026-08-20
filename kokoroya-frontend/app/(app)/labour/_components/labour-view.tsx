"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLabourWeeklyReportAction } from "@/lib/actions/labour";
import { getWeeklyReportAction } from "@/lib/actions/foodcost";
import { mondayOf, isoDate, addDays } from "@/lib/date";
import { WeekNav } from "@/app/(app)/_components/week-nav";
import { LabourGrid } from "./labour-grid";
import { LabourRateCard } from "./labour-rate-card";

export function LabourView() {
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week");
  const monday = weekParam
    ? mondayOf(new Date(`${weekParam}T00:00:00`))
    : mondayOf(new Date());
  const weekStartDate = isoDate(monday);
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    isoDate(addDays(monday, i)),
  );
  const prevWeekParam = isoDate(addDays(monday, -7));
  const nextWeekParam = isoDate(addDays(monday, 7));

  const queryKey = ["labour-report", weekStartDate];
  const {
    data: report,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getLabourWeeklyReportAction(weekStartDate),
  });

  const { data: foodCostReport } = useQuery({
    queryKey: ["food-cost-report", weekStartDate],
    queryFn: () => getWeeklyReportAction(weekStartDate),
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

  return (
    <div className="flex flex-col gap-6">
      <WeekNav
        monday={monday}
        weekStartDate={weekStartDate}
        prevWeekParam={prevWeekParam}
        nextWeekParam={nextWeekParam}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Hours" value={report.employees.reduce((a, e) => a + e.total_hours, 0)} suffix="h" />
        <StatCard label="Labour Cost" value={report.labour_total} money />
        <StatCard label="Labour Cost %" value={labourCostPct} percent />
      </div>

      <LabourRateCard
        weekStartDate={weekStartDate}
        weekdayRate={report.weekday_rate}
        weekendRate={report.weekend_rate}
        refetch={refetch}
      />

      <LabourGrid
        weekDates={weekDates}
        report={report}
        queryKey={queryKey}
        refetch={refetch}
      />
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
