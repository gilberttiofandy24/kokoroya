"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SHIFT_CODES, type ShiftCell, type ShiftCode } from "@/schema/schedule/schedule.schema";

const NO_CODE = "none";

export function ShiftCellDialog({
  employeeName,
  date,
  cell,
  onSave,
}: {
  employeeName: string;
  date: string;
  cell: ShiftCell;
  onSave: (startTime: string | null, code: ShiftCode | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(cell.start_time ?? "");
  const [code, setCode] = useState<string>(cell.code ?? NO_CODE);

  function handleOpenChange(next: boolean) {
    if (next) {
      setStartTime(cell.start_time ?? "");
      setCode(cell.code ?? NO_CODE);
    }
    setOpen(next);
  }

  function save() {
    onSave(startTime.trim() || null, code === NO_CODE ? null : (code as ShiftCode));
    setOpen(false);
  }

  function clear() {
    onSave(null, null);
    setOpen(false);
  }

  const label = cell.start_time || cell.code
    ? `${cell.start_time ?? ""}${cell.start_time && cell.code ? " - " : ""}${cell.code ?? ""}`
    : "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="hover:bg-muted min-h-8 w-full rounded px-2 py-1 text-center text-sm"
          >
            {label || "—"}
          </button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {employeeName} · {date}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Start Time</label>
            <Input
              placeholder="e.g. 10, 17.30"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Code</label>
            <Select value={code} onValueChange={(v) => setCode(v ?? NO_CODE)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CODE}>—</SelectItem>
                {SHIFT_CODES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={clear}>
            Clear
          </Button>
          <Button type="button" onClick={save}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
