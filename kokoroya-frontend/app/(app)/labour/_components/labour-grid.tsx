"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertHourEntryAction } from "@/lib/actions/labour";
import type { LabourWeeklyReportData } from "@/schema/labour/labour.schema";
import { HourInput } from "./hour-input";
import { ShiftEntriesTooltip } from "./shift-entries-tooltip";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function LabourGrid({
  weekDates,
  report,
  queryKey,
  refetch,
}: {
  weekDates: string[];
  report: LabourWeeklyReportData;
  queryKey: QueryKey;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate: saveEntry } = useMutation({
    mutationFn: upsertHourEntryAction,
    onMutate: (variables) => {
      queryClient.setQueryData<LabourWeeklyReportData | undefined>(
        queryKey,
        (old) => {
          if (!old) return old;
          const employees = old.employees.map((e) => {
            if (e.user_id !== variables.user_id) return e;
            const daily = {
              ...e.daily_hours,
              [variables.entry_date]: variables.total_hours,
            };
            const total = Object.values(daily).reduce((a, b) => a + b, 0);
            return { ...e, daily_hours: daily, total_hours: total };
          });
          const weekTotal = employees.reduce((a, e) => a + e.total_hours, 0);
          const withPct = employees.map((e) => ({
            ...e,
            percentage_of_all: weekTotal > 0 ? (e.total_hours / weekTotal) * 100 : 0,
          }));
          return { ...old, employees: withPct };
        },
      );
    },
    onError: () => {
      toast.error("Failed to save hours");
      refetch();
    },
    // Labour cost depends on a per-employee/weekly rate resolution chain
    // that lives server-side — refetch instead of duplicating that logic
    // in an optimistic recompute, so labour_daily/labour_total stay correct.
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left">
            <th className="p-3 font-medium">Employee</th>
            {DAY_LABELS.map((label) => (
              <th key={label} className="p-3 text-right font-medium">
                {label}
              </th>
            ))}
            <th className="p-3 text-right font-medium">Total</th>
            <th className="p-3 text-right font-medium">%</th>
          </tr>
        </thead>
        <tbody>
          {report.employees.length === 0 && (
            <tr>
              <td colSpan={10} className="text-muted-foreground p-4 text-center">
                No employees in this branch.
              </td>
            </tr>
          )}
          {report.employees.map((employee) => (
            <tr key={employee.user_id} className="border-b border-border/60">
              <td className="p-3 font-medium">{employee.name}</td>
              {weekDates.map((date) => (
                <td key={date} className="p-3 text-right">
                  <ShiftEntriesTooltip shifts={employee.daily_shifts[date] || []}>
                    <HourInput
                      value={employee.daily_hours[date] || 0}
                      onSave={(hours) =>
                        saveEntry({
                          user_id: employee.user_id,
                          entry_date: date,
                          total_hours: hours,
                        })
                      }
                    />
                  </ShiftEntriesTooltip>
                </td>
              ))}
              <td className="p-3 text-right font-medium">
                {employee.total_hours.toFixed(2)}h
              </td>
              <td className="p-3 text-right">
                {employee.percentage_of_all.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
