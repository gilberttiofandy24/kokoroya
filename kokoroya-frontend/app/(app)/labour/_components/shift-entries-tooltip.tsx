import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ShiftEntryInfo } from "@/schema/labour/labour.schema";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ShiftEntriesTooltip({
  shifts,
  children,
}: {
  shifts: ShiftEntryInfo[];
  children: React.ReactNode;
}) {
  if (shifts.length === 0) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="cursor-default underline decoration-dotted underline-offset-4" />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-0.5">
          {shifts.map((shift, i) => (
            <span key={i}>
              {formatTime(shift.clock_in_at)} -{" "}
              {shift.clock_out_at ? formatTime(shift.clock_out_at) : "open"}
            </span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
