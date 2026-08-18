import { api } from "@/lib/api";
import type {
  SectionsResponse,
  SectionResponse,
  WeeklyReportResponse,
  ShiftCode,
} from "@/schema/schedule/schedule.schema";

export async function getWeeklyReport(weekStartDate: string) {
  const res = await api.get<WeeklyReportResponse>(
    `/schedule/report?week_start_date=${weekStartDate}`,
  );
  return res.data!;
}

export async function upsertShift(data: {
  section_id: number;
  user_id: number;
  shift_date: string;
  start_time: string | null;
  code: ShiftCode | null;
}) {
  await api.put("/schedule/shift", data);
}

export async function upsertNotes(data: { week_start_date: string; notes: string }) {
  await api.put("/schedule/notes", data);
}

export async function getSections() {
  const res = await api.get<SectionsResponse>("/schedule/sections");
  return res.data ?? [];
}

export async function createSection(name: string) {
  const res = await api.post<SectionResponse>("/schedule/sections", { name });
  return res.data!;
}

export async function deleteSection(id: number) {
  await api.delete(`/schedule/sections/${id}`);
}
