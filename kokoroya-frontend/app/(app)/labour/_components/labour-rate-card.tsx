"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertWeeklyRateAction } from "@/lib/actions/labour";
import { NumericInput } from "@/app/(app)/_components/numeric-input";

export function LabourRateCard({
  weekStartDate,
  weekdayRate,
  weekendRate,
  refetch,
}: {
  weekStartDate: string;
  weekdayRate: number;
  weekendRate: number;
  refetch: () => void;
}) {
  const { mutate: saveRate } = useMutation({
    mutationFn: upsertWeeklyRateAction,
    onSuccess: () => refetch(),
    onError: () => toast.error("Failed to save labour rate"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Gross Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">Weekday $/hr</span>
          <NumericInput
            value={weekdayRate}
            onSave={(weekday_rate) =>
              saveRate({ week_start_date: weekStartDate, weekday_rate, weekend_rate: weekendRate })
            }
            className="w-24 text-right"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">Weekend $/hr</span>
          <NumericInput
            value={weekendRate}
            onSave={(weekend_rate) =>
              saveRate({ week_start_date: weekStartDate, weekday_rate: weekdayRate, weekend_rate })
            }
            className="w-24 text-right"
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Default rate for employees without their own weekday/weekend rate. Gross rate, already includes superannuation.
        </p>
      </CardContent>
    </Card>
  );
}
