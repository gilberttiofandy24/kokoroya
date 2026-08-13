import { redirect } from "next/navigation";
import { getCurrentUser, canAccess } from "@/lib/user";
import { LabourView } from "./_components/labour-view";

export default async function LabourPage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "labour")) redirect("/");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Labour Cost</h1>
        <p className="text-muted-foreground mt-1">
          Weekly hours per employee and labour cost.
        </p>
      </div>
      <LabourView />
    </div>
  );
}
