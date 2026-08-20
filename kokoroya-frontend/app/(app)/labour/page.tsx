import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, canAccess } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { LabourView } from "./_components/labour-view";

export default async function LabourPage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "labour")) redirect("/");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Labour Cost</h1>
          <p className="text-muted-foreground mt-1">
            Weekly hours per employee and labour cost.
          </p>
        </div>
        <Button variant="brutal" render={<Link href="/labour/clock-entries" />}>
          Clock In/Out Entries
        </Button>
      </div>
      <LabourView />
    </div>
  );
}
