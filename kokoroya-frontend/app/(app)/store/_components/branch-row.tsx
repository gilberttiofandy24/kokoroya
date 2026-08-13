"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleBranchActiveAction } from "@/lib/actions/branch";
import type { BranchData } from "@/schema/branch/branch.schema";
import { BranchDetailDialog } from "./branch-detail-dialog";
import { EditBranchDialog } from "./edit-branch-dialog";
import { DeleteBranchDialog } from "./delete-branch-dialog";

export function BranchRow({ branch }: { branch: BranchData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      try {
        await toggleBranchActiveAction(branch.id, !branch.is_active);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update branch");
      }
    });
  }

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-sm ${
        branch.is_active ? "" : "opacity-60"
      }`}
    >
      <span className="font-medium">
        {branch.name}
        {!branch.is_active && (
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            (deleted)
          </span>
        )}
      </span>
      <div className="flex items-center gap-2">
        <BranchDetailDialog branch={branch} />
        <EditBranchDialog branch={branch} />
        {branch.is_active ? (
          <DeleteBranchDialog branch={branch} />
        ) : (
          <Button variant="outline" size="sm" disabled={isPending} onClick={toggle}>
            Restore
          </Button>
        )}
      </div>
    </div>
  );
}
