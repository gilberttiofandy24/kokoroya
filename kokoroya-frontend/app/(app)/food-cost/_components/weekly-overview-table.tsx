import { Card, CardContent } from "@/components/ui/card";
import type { WeeklyReportData } from "@/schema/foodcost/foodcost.schema";
import type { LabourWeeklyReportData } from "@/schema/labour/labour.schema";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function money(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function purchaseTotalOn(report: WeeklyReportData, date: string) {
  return report.suppliers.reduce((sum, s) => sum + (s.daily_amounts[date] || 0), 0);
}

export function WeeklyOverviewTable({
  weekDates,
  report,
  labourReport,
}: {
  weekDates: string[];
  report: WeeklyReportData;
  labourReport: LabourWeeklyReportData;
}) {
  const weeklyLabourHours = weekDates.reduce(
    (sum, date) => sum + (labourReport.labour_daily[date]?.total_hours ?? 0),
    0,
  );
  const purchaseRatioPct =
    report.net_sales > 0 ? (report.grand_total_purchase / report.net_sales) * 100 : 0;
  const labourRatioPct =
    report.net_sales > 0 ? (labourReport.labour_total / report.net_sales) * 100 : 0;

  const rows: { label: string; values: number[]; total: number }[] = [
    {
      label: "Gross Sales",
      values: weekDates.map((d) => report.gross_sales_daily[d] || 0),
      total: report.gross_sales_total,
    },
    {
      label: "Net Sales",
      values: weekDates.map((d) => (report.gross_sales_daily[d] || 0) * report.net_sales_rate),
      total: report.net_sales,
    },
    {
      label: "Purchase",
      values: weekDates.map((d) => purchaseTotalOn(report, d)),
      total: report.grand_total_purchase,
    },
    {
      label: "Labour",
      values: weekDates.map((d) => labourReport.labour_daily[d]?.labour_cost ?? 0),
      total: labourReport.labour_total,
    },
  ];

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left font-medium">Report</th>
              {DAY_LABELS.map((label) => (
                <th key={label} className="p-2 text-right font-medium">
                  {label}
                </th>
              ))}
              <th className="p-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border/60">
                <td className="p-2 font-medium">{row.label}</td>
                {row.values.map((v, i) => (
                  <td key={weekDates[i]} className="p-2 text-right">
                    {money(v)}
                  </td>
                ))}
                <td className="p-2 text-right font-semibold">{money(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full max-w-md text-sm">
          <tbody>
            <SummaryRow label="Weekly Gross Sales" value={money(report.gross_sales_total)} />
            <SummaryRow label="Weekly Net Sales" value={money(report.net_sales)} />
            <SummaryRow label="Weekly Purchase" value={money(report.grand_total_purchase)} />
            <SummaryRow label="Weekly Labour (H)" value={weeklyLabourHours.toFixed(2)} />
            <SummaryRow label="Weekly Labour ($)" value={money(labourReport.labour_total)} />
            <tr className="border-t border-border/60">
              <td className="p-2 font-medium">Purchase / Net Sales</td>
              <td className="p-2 text-right font-semibold">{purchaseRatioPct.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className="p-2 font-medium">Labour / Net Sales</td>
              <td className="p-2 text-right font-semibold">{labourRatioPct.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-t border-border/60">
      <td className="p-2 font-medium">{label}</td>
      <td className="p-2 text-right">{value}</td>
    </tr>
  );
}
