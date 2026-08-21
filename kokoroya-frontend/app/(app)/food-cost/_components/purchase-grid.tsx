"use client";

import { useState } from "react";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  upsertPurchaseEntryAction,
  createSupplierAction,
  deleteSupplierAction,
} from "@/lib/actions/foodcost";
import { shortDayLabel } from "@/lib/date";
import type { WeeklyReportData } from "@/schema/foodcost/foodcost.schema";
import { AmountInput } from "./amount-input";

function formatCurrency(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PurchaseGrid({
  dates,
  report,
  queryKey,
  refetch,
}: {
  dates: string[];
  report: WeeklyReportData;
  queryKey: QueryKey;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();
  const [newSupplierName, setNewSupplierName] = useState("");

  const { mutate: saveEntry } = useMutation({
    mutationFn: upsertPurchaseEntryAction,
    onMutate: (variables) => {
      queryClient.setQueryData<WeeklyReportData | undefined>(
        queryKey,
        (old) => {
          if (!old) return old;
          const suppliers = old.suppliers.map((s) => {
            if (s.supplier_id !== variables.supplier_id) return s;
            const daily = {
              ...s.daily_amounts,
              [variables.purchase_date]: variables.amount,
            };
            const total = Object.values(daily).reduce((a, b) => a + b, 0);
            return { ...s, daily_amounts: daily, total };
          });
          const grandTotal = suppliers.reduce((a, s) => a + s.total, 0);
          const withPct = suppliers.map((s) => ({
            ...s,
            percentage_of_all: grandTotal > 0 ? (s.total / grandTotal) * 100 : 0,
          }));
          return {
            ...old,
            suppliers: withPct,
            grand_total_purchase: grandTotal,
            purchase_ratio_pct:
              old.net_sales > 0 ? (grandTotal / old.net_sales) * 100 : 0,
          };
        },
      );
    },
    onError: () => {
      toast.error("Failed to save purchase entry");
      refetch();
    },
  });

  const { mutate: addSupplier, isPending: isAdding } = useMutation({
    mutationFn: createSupplierAction,
    onSuccess: () => {
      setNewSupplierName("");
      refetch();
    },
    onError: () => toast.error("Failed to add supplier"),
  });

  const { mutate: removeSupplier } = useMutation({
    mutationFn: deleteSupplierAction,
    onSuccess: () => refetch(),
    onError: () => toast.error("Failed to delete supplier"),
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left">
            <th className="p-3 font-medium">Supplier</th>
            {dates.map((date) => (
              <th key={date} className="p-3 text-right font-medium">
                {shortDayLabel(date)}
              </th>
            ))}
            <th className="p-3 text-right font-medium">Total</th>
            <th className="p-3 text-right font-medium">%</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {report.suppliers.length === 0 && (
            <tr>
              <td colSpan={dates.length + 4} className="text-muted-foreground p-4 text-center">
                No suppliers yet.
              </td>
            </tr>
          )}
          {report.suppliers.map((supplier) => (
            <tr key={supplier.supplier_id} className="border-b border-border/60">
              <td className="p-3 font-medium">{supplier.supplier_name}</td>
              {dates.map((date) => (
                <td key={date} className="p-3 text-right">
                  <AmountInput
                    value={supplier.daily_amounts[date] || 0}
                    onSave={(amount) =>
                      saveEntry({
                        supplier_id: supplier.supplier_id,
                        purchase_date: date,
                        amount,
                      })
                    }
                  />
                </td>
              ))}
              <td className="p-3 text-right font-medium">
                {formatCurrency(supplier.total)}
              </td>
              <td className="p-3 text-right">
                {supplier.percentage_of_all.toFixed(1)}%
              </td>
              <td className="p-3 text-right">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSupplier(supplier.supplier_id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={dates.length + 4} className="p-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New supplier name"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  className="max-w-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!newSupplierName.trim() || isAdding}
                  onClick={() => addSupplier(newSupplierName.trim())}
                >
                  Add Supplier
                </Button>
              </div>
            </td>
          </tr>
          <tr className="bg-muted/30 font-semibold">
            <td className="p-3">Grand Total</td>
            <td colSpan={dates.length} />
            <td className="p-3 text-right">
              {formatCurrency(report.grand_total_purchase)}
            </td>
            <td className="p-3 text-right">100%</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
