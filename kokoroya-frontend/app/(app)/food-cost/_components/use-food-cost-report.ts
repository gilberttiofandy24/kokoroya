"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyReportAction } from "@/lib/actions/foodcost";
import { mondayOf, isoDate, addDays } from "@/lib/date";

export function useFoodCostReport() {
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week");
  const monday = weekParam
    ? mondayOf(new Date(`${weekParam}T00:00:00`))
    : mondayOf(new Date());
  const weekStartDate = isoDate(monday);
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    isoDate(addDays(monday, i)),
  );
  const prevWeekParam = isoDate(addDays(monday, -7));
  const nextWeekParam = isoDate(addDays(monday, 7));

  const queryKey = ["food-cost-report", weekStartDate];
  const { data, refetch, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => getWeeklyReportAction(weekStartDate),
  });

  return {
    monday,
    weekStartDate,
    weekDates,
    prevWeekParam,
    nextWeekParam,
    report: data,
    queryKey,
    refetch,
    isLoading,
    error,
  };
}
