"use client";

import { useEffect } from "react";
import { selectBranchAction } from "@/lib/actions/branch";

export function AutoSelectBranch({ branchId }: { branchId: number }) {
  useEffect(() => {
    selectBranchAction(branchId);
  }, [branchId]);

  return null;
}
