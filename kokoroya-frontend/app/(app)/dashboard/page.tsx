import { redirect } from "next/navigation";
import { getCurrentUser, canAccess } from "@/lib/user";
import { DashboardView } from "./_components/dashboard-view";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "dashboard")) redirect("/");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Sales, purchase and labour at a glance.</p>
      </div>
      <DashboardView />
    </div>
  );
}
