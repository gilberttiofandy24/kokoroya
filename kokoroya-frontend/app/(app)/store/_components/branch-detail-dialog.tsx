"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getBranchEmployeesAction } from "@/lib/actions/branch";
import type { BranchData } from "@/schema/branch/branch.schema";

export function BranchDetailDialog({ branch }: { branch: BranchData }) {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["branch-employees", branch.id],
    queryFn: () => getBranchEmployeesAction(branch.id),
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="brutal" size="sm" />}>
        Detail
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{branch.name}</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Loading employees..."
              : `${employees?.length ?? 0} employee(s)`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {!isLoading && employees?.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No employees assigned to this branch yet.
            </p>
          )}
          {employees?.map((e) => (
            <div key={e.id} className="rounded border p-2 text-sm">
              <div className="font-medium">{e.name}</div>
              <div className="text-muted-foreground">
                {e.email} · {e.role}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
