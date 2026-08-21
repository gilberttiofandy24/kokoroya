"use server";

import {
  getReport,
  getSalaryReport,
  upsertHourEntry,
  upsertWeeklyRate,
} from "@/api/labour";

export async function getLabourReportAction(startDate: string, endDate: string) {
  return getReport(startDate, endDate);
}

export async function getSalaryReportAction(startDate: string, endDate: string) {
  return getSalaryReport(startDate, endDate);
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
