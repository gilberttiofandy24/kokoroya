"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertNetSalesRateAction } from "@/lib/actions/foodcost";
import { mondayOf, isoDate } from "@/lib/date";
import type { WeeklyReportData } from "@/schema/foodcost/foodcost.schema";
import { AmountInput } from "./amount-input";

export function NetSalesRateCard({
  rangeStart,
  report,
  refetch,
}: {
  rangeStart: Date;
  report: WeeklyReportData;
  refetch: () => void;
}) {
  const weekStartDate = isoDate(mondayOf(rangeStart));

  const { mutate: saveRate } = useMutation({
    mutationFn: upsertNetSalesRateAction,
    onSuccess: () => refetch(),
    onError: () => toast.error("Failed to save net sales rate"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Sales Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm">
          Net Sales = Gross Sales × (rate for week of {weekStartDate})
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
