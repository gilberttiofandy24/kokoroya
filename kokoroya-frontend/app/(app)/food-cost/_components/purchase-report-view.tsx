"use client";

import { useFoodCostReport } from "./use-food-cost-report";
import { WeekNav } from "@/app/(app)/_components/week-nav";
import { PurchaseGrid } from "./purchase-grid";
import { PurchaseRatioChart } from "./purchase-ratio-chart";

export function PurchaseReportView() {
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

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) {
    return (
      <p className="text-destructive">
        Failed to load purchase report: {error.message}
      </p>
    );
  }
  if (!report) return null;

  return (
    <div className="flex flex-col gap-6">
      <WeekNav
        monday={monday}
        weekStartDate={weekStartDate}
        prevWeekParam={prevWeekParam}
        nextWeekParam={nextWeekParam}
      />
      <PurchaseGrid
        weekDates={weekDates}
        report={report}
        queryKey={queryKey}
        refetch={refetch}
      />
      <PurchaseRatioChart suppliers={report.suppliers} />
    </div>
  );
}
