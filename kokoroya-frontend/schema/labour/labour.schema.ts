import { BaseResponse } from "@/lib/api";

export interface EmployeeWeekRow {
  user_id: number;
  name: string;
  daily_hours: Record<string, number>;
  total_hours: number;
  percentage_of_all: number;
}

export interface LabourDayInfo {
  staff_count: number;
  total_hours: number;
  labour_cost: number;
  is_weekend: boolean;
}

export interface LabourWeeklyReportData {
  week_start_date: string;
  week_end_date: string;
  employees: EmployeeWeekRow[];
  labour_daily: Record<string, LabourDayInfo>;
  labour_total: number;
  weekday_rate: number;
  weekend_rate: number;
}
export type LabourWeeklyReportResponse = BaseResponse<LabourWeeklyReportData>;
