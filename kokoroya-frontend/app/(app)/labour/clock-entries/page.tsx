import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, canAccess } from "@/lib/user";
import { ClockEntriesView } from "../_components/clock-entries-view";

export default async function ClockEntriesPage() {
  const user = await getCurrentUser();
  if (!canAccess(user, "labour")) redirect("/");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Link href="/labour" className="text-muted-foreground text-sm hover:underline">
          ← Back to Labour Cost
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Clock In / Clock Out Entries</h1>
        <p className="text-muted-foreground mt-1">
          Actual clock-in and clock-out times per employee for the week.
        </p>
      </div>
      <ClockEntriesView />
    </div>
  );
}
