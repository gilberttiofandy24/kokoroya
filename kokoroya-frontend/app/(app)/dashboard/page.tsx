import { redirect } from "next/navigation";
import { getCurrentUser, canAccess } from "@/lib/user";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "dashboard")) redirect("/");

  return <div className="mx-auto max-w-5xl p-6">Dashboard — placeholder</div>;
}
