import { redirect } from "next/navigation";
import { getCurrentUser, canAccess } from "@/lib/user";
import { getUsersAction, getPermissionsAction } from "@/lib/actions/user";
import { getBranches } from "@/api/branch";
import { Button } from "@/components/ui/button";
import { EmployeeFormDialog } from "./_components/employee-form-dialog";
import { EmployeeRow } from "./_components/employee-row";

export default async function EmployeePage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "employee")) redirect("/");

  const [employees, permissions, branches] = await Promise.all([
    getUsersAction(),
    getPermissionsAction(),
    getBranches(),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee access, permissions, and branches.
          </p>
        </div>
        <EmployeeFormDialog
          pages={permissions.pages}
          branches={branches}
          trigger={<Button variant="brutal">Add Employee</Button>}
        />
      </div>
      <div className="flex flex-col gap-3">
        {employees.length === 0 && (
          <p className="text-muted-foreground">No employees yet.</p>
        )}
        {employees.map((e) => (
          <EmployeeRow
            key={e.id}
            employee={e}
            pages={permissions.pages}
            branches={branches}
          />
        ))}
      </div>
    </div>
  );
}
