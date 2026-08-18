"use server";

import {
  getWeeklyReport,
  upsertShift,
  upsertNotes,
  getSections,
  createSection,
  deleteSection,
} from "@/api/schedule";
import type { ShiftCode } from "@/schema/schedule/schedule.schema";

export async function getWeeklyReportAction(weekStartDate: string) {
  return getWeeklyReport(weekStartDate);
}

export async function upsertShiftAction(data: {
  section_id: number;
  user_id: number;
  shift_date: string;
  start_time: string | null;
  code: ShiftCode | null;
}) {
  return upsertShift(data);
}

export async function upsertNotesAction(data: { week_start_date: string; notes: string }) {
  return upsertNotes(data);
}

export async function getSectionsAction() {
  return getSections();
}

export async function createSectionAction(name: string) {
  return createSection(name);
}

export async function deleteSectionAction(id: number) {
  return deleteSection(id);
}
