"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleUserActiveAction } from "@/lib/actions/user";
import type { UserData } from "@/schema/user/user.schema";
import type { BranchData } from "@/schema/branch/branch.schema";
import { EmployeeFormDialog } from "./employee-form-dialog";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";

export function EmployeeRow({
  employee,
  pages,
  branches,
}: {
  employee: UserData;
  pages: string[];
  branches: BranchData[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function restore() {
    startTransition(async () => {
      try {
        await toggleUserActiveAction(employee.id, true);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to restore employee",
        );
      }
    });
  }

  const employeeBranches = branches.filter((b) =>
    employee.branch_ids?.includes(b.id),
  );

  return (
    <div
      className={`border-border/60 bg-card flex items-center justify-between rounded-2xl border p-4 transition-shadow hover:shadow-sm ${
        employee.is_active ? "" : "opacity-60"
      }`}
    >
      <div>
        <div className="font-medium">
          {employee.name}
          {!employee.is_active && (
            <span className="text-muted-foreground ml-2 text-xs font-normal">
              (deleted)
            </span>
          )}
        </div>
        <div className="text-muted-foreground text-sm">
          {employee.email} · {employee.role}
          {employeeBranches.length > 0 &&
            ` · ${employeeBranches.map((b) => b.name).join(", ")}`}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <EmployeeFormDialog
          pages={pages}
          branches={branches}
          employee={employee}
          trigger={
            <Button variant="brutal" size="sm">
              Edit
            </Button>
          }
        />
        {employee.is_active ? (
          <DeleteEmployeeDialog employee={employee} />
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={restore}
          >
            Restore
          </Button>
        )}
      </div>
    </div>
  );
}
