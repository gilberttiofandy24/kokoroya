"use server";

import { redirect } from "next/navigation";
import {
  createBranch,
  deleteBranch,
  getBranchEmployees,
  updateBranch,
} from "@/api/branch";
import { setSelectedBranch, clearSelectedBranch } from "@/lib/auth";
import type { CreateBranchPayload } from "@/schema/branch/branch.schema";

export async function selectBranchAction(branchId: number) {
  await setSelectedBranch(String(branchId));
  redirect("/");
}

export async function switchBranchAction() {
  await clearSelectedBranch();
  redirect("/select-branch");
}

export async function createBranchAction(payload: CreateBranchPayload) {
  await createBranch(payload);
}

export async function updateBranchNameAction(id: number, name: string) {
  await updateBranch(id, { name });
}

export async function toggleBranchActiveAction(id: number, isActive: boolean) {
  await updateBranch(id, { is_active: isActive });
}

export async function deleteBranchAction(id: number) {
  await deleteBranch(id);
}

export async function getBranchEmployeesAction(id: number) {
  return getBranchEmployees(id);
}
