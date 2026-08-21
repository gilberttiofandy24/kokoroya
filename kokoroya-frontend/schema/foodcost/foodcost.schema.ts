import { BaseResponse } from "@/lib/api";

export interface SupplierData {
  id: number;
  branch_id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
}
export type SuppliersResponse = BaseResponse<SupplierData[]>;
export type SupplierResponse = BaseResponse<SupplierData>;

export interface SupplierWeekRow {
  supplier_id: number;
  supplier_name: string;
  daily_amounts: Record<string, number>;
  total: number;
  percentage_of_all: number;
}

export interface WeeklyReportData {
  start_date: string;
  end_date: string;
  suppliers: SupplierWeekRow[];
  grand_total_purchase: number;
  gross_sales_daily: Record<string, number>;
  gross_sales_total: number;
  net_sales: number;
  net_sales_rate: number;
  purchase_ratio_pct: number;
}
export type WeeklyReportResponse = BaseResponse<WeeklyReportData>;
