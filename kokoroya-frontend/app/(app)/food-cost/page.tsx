import { redirect } from "next/navigation";
import { getCurrentUser, canAccess } from "@/lib/user";
import { FoodCostView } from "./_components/food-cost-view";

export default async function FoodCostPage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "food-cost")) redirect("/");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Food Cost</h1>
        <p className="text-muted-foreground mt-1">
          Weekly purchases per supplier, gross/net sales, and purchase ratio.
        </p>
      </div>
      <FoodCostView />
    </div>
  );
}
