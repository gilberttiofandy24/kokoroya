import z from "zod";
import { BaseResponse } from "@/lib/api";

export interface BranchData {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeData {
  id: number;
  name: string;
  email: string | null;
  role: string;
}

export type BranchesResponse = BaseResponse<BranchData[]>;
export type BranchResponse = BaseResponse<BranchData>;
export type EmployeesResponse = BaseResponse<EmployeeData[]>;

export const createBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
});
export type CreateBranchPayload = z.infer<typeof createBranchSchema>;

export const editBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
});
export type EditBranchPayload = z.infer<typeof editBranchSchema>;
