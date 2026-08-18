"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSectionAction, deleteSectionAction } from "@/lib/actions/schedule";
import type { SectionData } from "@/schema/schedule/schedule.schema";

export function SectionManager({
  sections,
  refetch,
}: {
  sections: SectionData[];
  refetch: () => void;
}) {
  const [name, setName] = useState("");

  const { mutate: addSection, isPending: isAdding } = useMutation({
    mutationFn: createSectionAction,
    onSuccess: () => {
      setName("");
      refetch();
    },
    onError: () => toast.error("Failed to add section"),
  });

  const { mutate: removeSection } = useMutation({
    mutationFn: deleteSectionAction,
    onSuccess: () => refetch(),
    onError: () => toast.error("Failed to delete section"),
  });

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card p-4">
      <span className="text-muted-foreground mr-2 text-sm font-medium">Sections:</span>
      {sections.map((s) => (
        <span
          key={s.id}
          className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
        >
          {s.name}
          <button
            type="button"
            aria-label={`Delete ${s.name}`}
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeSection(s.id)}
          >
            ×
          </button>
        </span>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <Input
          placeholder="New section name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8 max-w-40"
        />
        <Button
          type="button"
          size="sm"
          disabled={!name.trim() || isAdding}
          onClick={() => addSection(name.trim())}
        >
          Add Section
        </Button>
      </div>
    </div>
  );
}
