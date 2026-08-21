import { redirect } from "next/navigation";
import { getCurrentUser, canAccess } from "@/lib/user";
import { SalaryView } from "./_components/salary-view";

export default async function SalaryPage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "salary")) redirect("/");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Salary</h1>
        <p className="text-muted-foreground mt-1">
          Per-employee pay breakdown after PAYG tax, read-only.
        </p>
      </div>
      <SalaryView />
    </div>
  );
}
