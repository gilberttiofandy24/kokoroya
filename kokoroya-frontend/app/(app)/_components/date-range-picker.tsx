"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { isoDate } from "@/lib/date";

export function DateRangePicker({
  from,
  to,
  onChange,
}: {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<DateRange | undefined>({ from, to });

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setPending({ from, to });
      }}
    >
      <PopoverTrigger
        render={
          <Button variant="brutal" type="button">
            <CalendarIcon />
            {isoDate(from)} – {isoDate(to)}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={pending}
          defaultMonth={from}
          onSelect={setPending}
        />
        <div className="flex justify-end gap-2 border-t p-3">
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!pending?.from || !pending?.to}
            onClick={() => {
              if (!pending?.from || !pending?.to) return;
              onChange(pending.from, pending.to);
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
