import Link from "next/link";
import { isoDate, addDays } from "@/lib/date";

export function WeekNav({
  monday,
  weekStartDate,
  prevWeekParam,
  nextWeekParam,
}: {
  monday: Date;
  weekStartDate: string;
  prevWeekParam: string;
  nextWeekParam: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={`?week=${prevWeekParam}`}
        className="hover:bg-muted rounded-full border px-3 py-1 text-sm"
      >
        ◀
      </Link>
      <span className="font-medium">
        Week of {weekStartDate} – {isoDate(addDays(monday, 6))}
      </span>
      <Link
        href={`?week=${nextWeekParam}`}
        className="hover:bg-muted rounded-full border px-3 py-1 text-sm"
      >
        ▶
      </Link>
    </div>
  );
}
