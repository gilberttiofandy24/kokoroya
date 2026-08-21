"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { isoDate, addDays, mondayOf } from "@/lib/date";

export function useDateRange() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const defaultMonday = mondayOf(new Date());

  const from = fromParam ? new Date(`${fromParam}T00:00:00`) : defaultMonday;
  const to = toParam ? new Date(`${toParam}T00:00:00`) : addDays(defaultMonday, 6);
  const startDate = isoDate(from);
  const endDate = isoDate(to);

  const dates: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) dates.push(isoDate(d));

  function setRange(newFrom: Date, newTo: Date) {
    router.push(`${pathname}?from=${isoDate(newFrom)}&to=${isoDate(newTo)}`);
  }

  return { from, to, startDate, endDate, dates, setRange };
}
