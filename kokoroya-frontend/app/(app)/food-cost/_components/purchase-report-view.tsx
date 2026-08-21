"use client";

import { useQuery } from "@tanstack/react-query";
import { getReportAction } from "@/lib/actions/foodcost";
import { useDateRange } from "@/app/(app)/_components/use-date-range";
import { DateRangePicker } from "@/app/(app)/_components/date-range-picker";
import { ExportButton } from "@/app/(app)/_components/export-button";
import { downloadExcel } from "@/lib/excel";
import { PurchaseGrid } from "./purchase-grid";
import { PurchaseRatioChart } from "./purchase-ratio-chart";

export function PurchaseReportView() {
  const { from, to, startDate, endDate, dates, setRange } = useDateRange();

  const queryKey = ["food-cost-report", startDate, endDate];
  const { data: report, refetch, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => getReportAction(startDate, endDate),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) {
    return (
      <p className="text-destructive">
        Failed to load purchase report: {error.message}
      </p>
    );
  }
  if (!report) return null;

  function handleExport() {
    if (!report) return;
    downloadExcel(`purchase-report-${startDate}-to-${endDate}.xlsx`, [
      {
        name: "Purchases",
        rows: report!.suppliers.map((s) => ({
          Supplier: s.supplier_name,
          ...Object.fromEntries(dates.map((d) => [d, s.daily_amounts[d] || 0])),
          Total: s.total,
          "% of All": s.percentage_of_all,
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
      <PurchaseGrid dates={dates} report={report} queryKey={queryKey} refetch={refetch} />
      <PurchaseRatioChart suppliers={report.suppliers} />
    </div>
  );
}
