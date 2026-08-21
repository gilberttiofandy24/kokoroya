import { BaseResponse } from "@/lib/api";

export interface ShiftEntryInfo {
  clock_in_at: string;
  clock_out_at: string | null;
}

export interface EmployeeWeekRow {
  user_id: number;
  name: string;
  daily_hours: Record<string, number>;
  daily_shifts: Record<string, ShiftEntryInfo[]>;
  total_hours: number;
  percentage_of_all: number;
  gross_pay: number;
}

export interface LabourDayInfo {
  staff_count: number;
  total_hours: number;
  labour_cost: number;
  is_weekend: boolean;
}

export interface LabourWeeklyReportData {
  start_date: string;
  end_date: string;
  employees: EmployeeWeekRow[];
  labour_daily: Record<string, LabourDayInfo>;
  labour_total: number;
  weekday_rate: number;
  weekend_rate: number;
}
export type LabourWeeklyReportResponse = BaseResponse<LabourWeeklyReportData>;
