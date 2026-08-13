import { api } from "@/lib/api";
import type { LabourWeeklyReportResponse } from "@/schema/labour/labour.schema";

export async function getWeeklyReport(weekStartDate: string) {
  const res = await api.get<LabourWeeklyReportResponse>(
    `/labour/report?week_start_date=${weekStartDate}`,
  );
  return res.data!;
}

export async function upsertHourEntry(data: {
  user_id: number;
  entry_date: string;
  total_hours: number;
}) {
  await api.put("/labour/hour-entry", data);
}

export async function upsertWeeklyRate(data: {
  week_start_date: string;
  weekday_rate: number;
  weekend_rate: number;
}) {
  await api.put("/labour/rate", data);
}
