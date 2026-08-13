import { redirect } from "next/navigation";
import { getCurrentUser, canAccess } from "@/lib/user";

export default async function SchedulePage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "schedule")) redirect("/");

  return <div className="mx-auto max-w-5xl p-6">Schedule — placeholder</div>;
}
