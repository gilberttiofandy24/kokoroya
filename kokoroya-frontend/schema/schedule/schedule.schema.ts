import { BaseResponse } from "@/lib/api";

export interface SectionData {
  id: number;
  branch_id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
}
export type SectionsResponse = BaseResponse<SectionData[]>;
export type SectionResponse = BaseResponse<SectionData>;

export const SHIFT_CODES = ["C", "F", "S", "FS", "B", "TOILET"] as const;
export type ShiftCode = (typeof SHIFT_CODES)[number];

export interface ShiftCell {
  start_time: string | null;
  code: ShiftCode | null;
}

export interface EmployeeWeekRow {
  user_id: number;
  name: string;
  shifts: Record<string, ShiftCell>;
}

export interface SectionWeekRow {
  section_id: number;
  section_name: string;
  employees: EmployeeWeekRow[];
}

export interface WeeklyReportData {
  week_start_date: string;
  week_end_date: string;
  sections: SectionWeekRow[];
  notes: string;
}
export type WeeklyReportResponse = BaseResponse<WeeklyReportData>;
