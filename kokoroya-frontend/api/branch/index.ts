import { api } from "@/lib/api";
import type {
  BranchesResponse,
  BranchResponse,
  CreateBranchPayload,
  EmployeesResponse,
} from "@/schema/branch/branch.schema";

export async function getMyBranches() {
  const res = await api.get<BranchesResponse>("/me/branches");
  return res.data ?? [];
}

export async function getBranches() {
  const res = await api.get<BranchesResponse>("/branches");
  return res.data ?? [];
}

export async function createBranch(payload: CreateBranchPayload) {
  const res = await api.post<BranchResponse>("/branches", payload);
  return res.data!;
}

export async function updateBranch(
  id: number,
  payload: { name?: string; is_active?: boolean },
) {
  const res = await api.patch<BranchResponse>(`/branches/${id}`, payload);
  return res.data!;
}

export async function deleteBranch(id: number) {
  await api.delete(`/branches/${id}`);
}

export async function getBranchEmployees(id: number) {
  const res = await api.get<EmployeesResponse>(`/branches/${id}/employees`);
  return res.data ?? [];
}
