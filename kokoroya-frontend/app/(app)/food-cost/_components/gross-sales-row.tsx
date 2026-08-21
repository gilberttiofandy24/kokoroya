"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertGrossSalesAction } from "@/lib/actions/foodcost";
import { shortDayLabel } from "@/lib/date";
import type { WeeklyReportData } from "@/schema/foodcost/foodcost.schema";
import { AmountInput } from "./amount-input";

function formatCurrency(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function GrossSalesRow({
  dates,
  report,
  queryKey,
  refetch,
}: {
  dates: string[];
  report: WeeklyReportData;
  queryKey: QueryKey;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate: saveGrossSales } = useMutation({
    mutationFn: upsertGrossSalesAction,
    onMutate: (variables) => {
      queryClient.setQueryData<WeeklyReportData | undefined>(
        queryKey,
        (old) => {
          if (!old) return old;
          const grossSalesDaily = {
            ...old.gross_sales_daily,
            [variables.sales_date]: variables.amount,
          };
          const grossSalesTotal = Object.values(grossSalesDaily).reduce(
            (a, b) => a + b,
            0,
          );
          const netSales = grossSalesTotal * old.net_sales_rate;
          const purchaseRatioPct =
            netSales > 0
              ? (old.grand_total_purchase / netSales) * 100
              : 0;
          return {
            ...old,
            gross_sales_daily: grossSalesDaily,
            gross_sales_total: grossSalesTotal,
            net_sales: netSales,
            purchase_ratio_pct: purchaseRatioPct,
          };
        },
      );
    },
    onError: () => {
      toast.error("Failed to save gross sales");
      refetch();
    },
    // net_sales across a multi-week range depends on the server's per-day
    // rate resolution — refetch to pick up the exact figure.
    onSuccess: () => refetch(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Gross Sales</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {dates.map((date) => (
                <th key={date} className="p-2 text-right font-medium">
                  {shortDayLabel(date)}
                </th>
              ))}
              <th className="p-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {dates.map((date) => (
                <td key={date} className="p-2 text-right">
                  <AmountInput
                    value={report.gross_sales_daily[date] || 0}
                    onSave={(amount) =>
                      saveGrossSales({ sales_date: date, amount })
                    }
                  />
                </td>
              ))}
              <td className="p-2 text-right font-semibold">
                {formatCurrency(report.gross_sales_total)}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
