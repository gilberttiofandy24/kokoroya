import { api } from "@/lib/api";
import type { LabourWeeklyReportResponse } from "@/schema/labour/labour.schema";

export async function getReport(startDate: string, endDate: string) {
  const res = await api.get<LabourWeeklyReportResponse>(
    `/labour/report?start_date=${startDate}&end_date=${endDate}`,
  );
  return res.data!;
}

export async function getSalaryReport(startDate: string, endDate: string) {
  const res = await api.get<LabourWeeklyReportResponse>(
    `/salary/report?start_date=${startDate}&end_date=${endDate}`,
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
