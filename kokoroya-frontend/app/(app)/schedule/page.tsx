import { redirect } from "next/navigation";
import { getCurrentUser, canAccess } from "@/lib/user";
import { ScheduleView } from "./_components/schedule-view";

export default async function SchedulePage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "schedule")) redirect("/");

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="text-muted-foreground mt-1">Weekly roster by section.</p>
      </div>
      <ScheduleView />
    </div>
  );
}
