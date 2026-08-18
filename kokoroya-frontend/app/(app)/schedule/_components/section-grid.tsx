"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertShiftAction } from "@/lib/actions/schedule";
import type { SectionWeekRow, WeeklyReportData } from "@/schema/schedule/schedule.schema";
import { ShiftCellDialog } from "./shift-cell-dialog";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function SectionGrid({
  section,
  weekDates,
  queryKey,
  refetch,
}: {
  section: SectionWeekRow;
  weekDates: string[];
  queryKey: QueryKey;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate: saveShift } = useMutation({
    mutationFn: upsertShiftAction,
    onMutate: (variables) => {
      queryClient.setQueryData<WeeklyReportData | undefined>(queryKey, (old) => {
        if (!old) return old;
        const sections = old.sections.map((s) => {
          if (s.section_id !== variables.section_id) return s;
          const employees = s.employees.map((e) => {
            if (e.user_id !== variables.user_id) return e;
            return {
              ...e,
              shifts: {
                ...e.shifts,
                [variables.shift_date]: {
                  start_time: variables.start_time,
                  code: variables.code,
                },
              },
            };
          });
          return { ...s, employees };
        });
        return { ...old, sections };
      });
    },
    onError: () => {
      toast.error("Failed to save shift");
      refetch();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.section_name}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left">
              <th className="p-2 font-medium">Employee</th>
              {DAY_LABELS.map((label) => (
                <th key={label} className="p-2 text-center font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.employees.map((employee) => (
              <tr key={employee.user_id} className="border-b border-border/60">
                <td className="p-2 font-medium whitespace-nowrap">{employee.name}</td>
                {weekDates.map((date) => (
                  <td key={date} className="p-1 text-center">
                    <ShiftCellDialog
                      employeeName={employee.name}
                      date={date}
                      cell={employee.shifts[date] ?? { start_time: null, code: null }}
                      onSave={(startTime, code) =>
                        saveShift({
                          section_id: section.section_id,
                          user_id: employee.user_id,
                          shift_date: date,
                          start_time: startTime,
                          code,
                        })
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
