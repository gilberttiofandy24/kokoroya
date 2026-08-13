"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertNetSalesRateAction } from "@/lib/actions/foodcost";
import type { WeeklyReportData } from "@/schema/foodcost/foodcost.schema";
import { AmountInput } from "./amount-input";

export function NetSalesRateCard({
  weekStartDate,
  report,
  queryKey,
  refetch,
}: {
  weekStartDate: string;
  report: WeeklyReportData;
  queryKey: QueryKey;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate: saveRate } = useMutation({
    mutationFn: upsertNetSalesRateAction,
    onMutate: (variables) => {
      queryClient.setQueryData<WeeklyReportData | undefined>(
        queryKey,
        (old) => {
          if (!old) return old;
          const netSales = old.gross_sales_total * variables.rate;
          const purchaseRatioPct =
            netSales > 0
              ? (old.grand_total_purchase / netSales) * 100
              : 0;
          return {
            ...old,
            net_sales: netSales,
            net_sales_rate: variables.rate,
            purchase_ratio_pct: purchaseRatioPct,
          };
        },
      );
    },
    onError: () => {
      toast.error("Failed to save net sales rate");
      refetch();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Sales Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm">
          Net Sales = Gross Sales ×
        </span>
        <AmountInput
          value={report.net_sales_rate}
          onSave={(rate) =>
            saveRate({ week_start_date: weekStartDate, rate })
          }
        />
      </CardContent>
    </Card>
  );
}
