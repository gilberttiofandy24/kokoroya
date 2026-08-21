"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLabourReportAction } from "@/lib/actions/labour";
import { mondayOf, isoDate, addDays } from "@/lib/date";
import { WeekNav } from "@/app/(app)/_components/week-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_EMPLOYEES = "all";

type FlatEntry = {
  userId: number;
  name: string;
  date: string;
  clockInAt: string;
  clockOutAt: string | null;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(clockInAt: string, clockOutAt: string | null) {
  if (!clockOutAt) return "—";
  const hours =
    (new Date(clockOutAt).getTime() - new Date(clockInAt).getTime()) /
    3_600_000;
  return `${hours.toFixed(2)}h`;
}

export function ClockEntriesView() {
  const [employeeFilter, setEmployeeFilter] = useState(ALL_EMPLOYEES);
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week");
  const monday = weekParam
    ? mondayOf(new Date(`${weekParam}T00:00:00`))
    : mondayOf(new Date());
  const weekStartDate = isoDate(monday);
  const weekEndDate = isoDate(addDays(monday, 6));
  const prevWeekParam = isoDate(addDays(monday, -7));
  const nextWeekParam = isoDate(addDays(monday, 7));

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["labour-report", weekStartDate],
    queryFn: () => getLabourReportAction(weekStartDate, weekEndDate),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) {
    return (
      <p className="text-destructive">
        Failed to load clock entries: {error.message}
      </p>
    );
  }
  if (!report) return null;

  const entries: FlatEntry[] = report.employees
    .filter((employee) => employeeFilter === ALL_EMPLOYEES || String(employee.user_id) === employeeFilter)
    .flatMap((employee) =>
      Object.entries(employee.daily_shifts).flatMap(([date, shifts]) =>
        (shifts ?? []).map((shift) => ({
          userId: employee.user_id,
          name: employee.name,
          date,
          clockInAt: shift.clock_in_at,
          clockOutAt: shift.clock_out_at,
        })),
      ),
    )
    .sort((a, b) => a.clockInAt.localeCompare(b.clockInAt));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <WeekNav
          monday={monday}
          weekStartDate={weekStartDate}
          prevWeekParam={prevWeekParam}
          nextWeekParam={nextWeekParam}
        />
        <Select value={employeeFilter} onValueChange={(v) => setEmployeeFilter(v ?? ALL_EMPLOYEES)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_EMPLOYEES}>All employees</SelectItem>
            {report.employees.map((employee) => (
              <SelectItem key={employee.user_id} value={String(employee.user_id)}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left">
              <th className="p-3 font-medium">Employee</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Clock In</th>
              <th className="p-3 font-medium">Clock Out</th>
              <th className="p-3 text-right font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted-foreground p-4 text-center">
                  No clock-in entries this week.
                </td>
              </tr>
            )}
            {entries.map((entry, i) => (
              <tr key={i} className="border-b border-border/60">
                <td className="p-3 font-medium">{entry.name}</td>
                <td className="p-3">{entry.date}</td>
                <td className="p-3">{formatTime(entry.clockInAt)}</td>
                <td className="p-3">
                  {entry.clockOutAt ? formatTime(entry.clockOutAt) : "open"}
                </td>
                <td className="p-3 text-right">
                  {formatDuration(entry.clockInAt, entry.clockOutAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
