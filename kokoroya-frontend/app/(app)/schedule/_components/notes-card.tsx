"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertNotesAction } from "@/lib/actions/schedule";

export function NotesCard({
  weekStartDate,
  notes,
  refetch,
}: {
  weekStartDate: string;
  notes: string;
  refetch: () => void;
}) {
  const [value, setValue] = useState(notes);

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => upsertNotesAction({ week_start_date: weekStartDate, notes: value }),
    onSuccess: () => refetch(),
    onError: () => toast.error("Failed to save notes"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <textarea
          className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none"
          placeholder="e.g. Chandra: 15 - 17 Sept 2026 (unavailable)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          type="button"
          size="sm"
          className="self-end"
          disabled={isPending || value === notes}
          onClick={() => save()}
        >
          {isPending ? "Saving..." : "Save Notes"}
        </Button>
      </CardContent>
    </Card>
  );
}
