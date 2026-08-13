import { api } from "@/lib/api";
import type {
  SuppliersResponse,
  SupplierResponse,
  WeeklyReportResponse,
} from "@/schema/foodcost/foodcost.schema";

export async function getWeeklyReport(weekStartDate: string) {
  const res = await api.get<WeeklyReportResponse>(
    `/food-cost/report?week_start_date=${weekStartDate}`,
  );
  return res.data!;
}

export async function upsertPurchaseEntry(data: {
  supplier_id: number;
  purchase_date: string;
  amount: number;
}) {
  await api.put("/food-cost/purchase-entry", data);
}

export async function upsertGrossSales(data: {
  sales_date: string;
  amount: number;
}) {
  await api.put("/food-cost/gross-sales", data);
}

export async function upsertNetSalesRate(data: {
  week_start_date: string;
  rate: number;
}) {
  await api.put("/food-cost/net-sales-rate", data);
}

export async function getSuppliers() {
  const res = await api.get<SuppliersResponse>("/food-cost/suppliers");
  return res.data ?? [];
}

export async function createSupplier(name: string) {
  const res = await api.post<SupplierResponse>("/food-cost/suppliers", {
    name,
  });
  return res.data!;
}

export async function deleteSupplier(id: number) {
  await api.delete(`/food-cost/suppliers/${id}`);
}
