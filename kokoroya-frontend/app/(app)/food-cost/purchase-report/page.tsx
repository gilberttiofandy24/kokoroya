import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, canAccess } from "@/lib/user";
import { PurchaseReportView } from "../_components/purchase-report-view";

export default async function PurchaseReportPage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "food-cost")) redirect("/");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Link href="/food-cost" className="text-muted-foreground text-sm hover:underline">
          ← Back to Food Cost
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Purchase Report</h1>
        <p className="text-muted-foreground mt-1">
          Weekly purchase tracking per supplier.
        </p>
      </div>
      <PurchaseReportView />
    </div>
  );
}
