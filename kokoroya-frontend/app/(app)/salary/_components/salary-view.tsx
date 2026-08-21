"use client";

import { useQuery } from "@tanstack/react-query";
import { getSalaryReportAction } from "@/lib/actions/labour";
import { useDateRange } from "@/app/(app)/_components/use-date-range";
import { DateRangePicker } from "@/app/(app)/_components/date-range-picker";
import { PAYG_RATE, SUPER_RATE } from "@/lib/payroll";

function money(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SalaryView() {
  const { from, to, startDate, endDate, setRange } = useDateRange();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["salary-report", startDate, endDate],
    queryFn: () => getSalaryReportAction(startDate, endDate),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) {
    return (
      <p className="text-destructive">Failed to load salary report: {error.message}</p>
    );
  }
  if (!report) return null;

  const rows = report.employees.map((e) => {
    const payg = e.gross_pay * PAYG_RATE;
    return {
      ...e,
      payg,
      netPay: e.gross_pay - payg,
      superAmount: e.gross_pay * SUPER_RATE,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <DateRangePicker from={from} to={to} onChange={setRange} />

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left">
              <th className="p-3 font-medium">Employee</th>
              <th className="p-3 text-right font-medium">Hours</th>
              <th className="p-3 text-right font-medium">Gross Pay</th>
              <th className="p-3 text-right font-medium">PAYG ({(PAYG_RATE * 100).toFixed(2)}%)</th>
              <th className="p-3 text-right font-medium">Net Pay</th>
              <th className="p-3 text-right font-medium">Super ({(SUPER_RATE * 100).toFixed(0)}%)</th>
              <th className="p-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="text-muted-foreground p-4 text-center">
                  No employees in this branch.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.user_id} className="border-b border-border/60">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-right">{r.total_hours.toFixed(2)}h</td>
                <td className="p-3 text-right">{money(r.gross_pay)}</td>
                <td className="p-3 text-right text-destructive">-{money(r.payg)}</td>
                <td className="p-3 text-right font-semibold">{money(r.netPay)}</td>
                <td className="p-3 text-right text-muted-foreground">{money(r.superAmount)}</td>
                <td className="p-3 text-right font-semibold">
                  {money(r.netPay + r.superAmount)}
                </td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="bg-muted/30 font-semibold">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">
                  {rows.reduce((a, r) => a + r.total_hours, 0).toFixed(2)}h
                </td>
                <td className="p-3 text-right">
                  {money(rows.reduce((a, r) => a + r.gross_pay, 0))}
                </td>
                <td className="p-3 text-right">{money(rows.reduce((a, r) => a + r.payg, 0))}</td>
                <td className="p-3 text-right">{money(rows.reduce((a, r) => a + r.netPay, 0))}</td>
                <td className="p-3 text-right">
                  {money(rows.reduce((a, r) => a + r.superAmount, 0))}
                </td>
                <td className="p-3 text-right">
                  {money(rows.reduce((a, r) => a + r.netPay + r.superAmount, 0))}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <p className="text-muted-foreground text-xs">
        Super is the employer&apos;s superannuation cost, not deducted from Net Pay.
      </p>
    </div>
  );
}
