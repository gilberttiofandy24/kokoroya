"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyReportAction, getSectionsAction } from "@/lib/actions/schedule";
import { mondayOf, isoDate, addDays } from "@/lib/date";
import { WeekNav } from "@/app/(app)/_components/week-nav";
import { SectionGrid } from "./section-grid";
import { SectionManager } from "./section-manager";
import { NotesCard } from "./notes-card";
import { Legend } from "./legend";

export function ScheduleView() {
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week");
  const monday = weekParam
    ? mondayOf(new Date(`${weekParam}T00:00:00`))
    : mondayOf(new Date());
  const weekStartDate = isoDate(monday);
  const weekDates = Array.from({ length: 7 }, (_, i) => isoDate(addDays(monday, i)));
  const prevWeekParam = isoDate(addDays(monday, -7));
  const nextWeekParam = isoDate(addDays(monday, 7));

  const queryKey = ["schedule-report", weekStartDate];
  const { data: report, refetch, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => getWeeklyReportAction(weekStartDate),
  });

  const { data: sections, refetch: refetchSections } = useQuery({
    queryKey: ["schedule-sections"],
    queryFn: getSectionsAction,
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) {
    return (
      <p className="text-destructive">Failed to load schedule: {error.message}</p>
    );
  }
  if (!report) return null;

  function refetchAll() {
    refetch();
    refetchSections();
  }

  return (
    <div className="flex flex-col gap-6">
      <WeekNav
        monday={monday}
        weekStartDate={weekStartDate}
        prevWeekParam={prevWeekParam}
        nextWeekParam={nextWeekParam}
      />

      <SectionManager sections={sections ?? []} refetch={refetchAll} />

      {report.sections.length === 0 && (
        <p className="text-muted-foreground">No sections yet — add one above.</p>
      )}
      {report.sections.map((section) => (
        <SectionGrid
          key={section.section_id}
          section={section}
          weekDates={weekDates}
          queryKey={queryKey}
          refetch={refetch}
        />
      ))}

      <NotesCard weekStartDate={weekStartDate} notes={report.notes} refetch={refetch} />

      <Legend />
    </div>
  );
}
