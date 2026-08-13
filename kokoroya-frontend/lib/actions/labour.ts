"use server";

import { getWeeklyReport, upsertHourEntry, upsertWeeklyRate } from "@/api/labour";

export async function getLabourWeeklyReportAction(weekStartDate: string) {
  return getWeeklyReport(weekStartDate);
}

export async function upsertHourEntryAction(data: {
  user_id: number;
  entry_date: string;
  total_hours: number;
}) {
  return upsertHourEntry(data);
}

export async function upsertWeeklyRateAction(data: {
  week_start_date: string;
  weekday_rate: number;
  weekend_rate: number;
}) {
  return upsertWeeklyRate(data);
}
