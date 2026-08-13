import z from "zod";
import { BaseResponse } from "@/lib/api";

export interface MeResponseData {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}
export type MeResponse = BaseResponse<MeResponseData>;

export interface PermissionsResponseData {
  pages: string[];
}
export type PermissionsResponse = BaseResponse<PermissionsResponseData>;

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  tfn: string | null;
  pin: string | null;
  rate_weekday: number | null;
  rate_weekend: number | null;
  is_active: boolean;
  permissions: string[];
  branch_ids: number[] | null;
  created_at: string;
  updated_at: string;
}
export type UsersResponse = BaseResponse<UserData[]>;
export type UserResponse = BaseResponse<UserData>;

// Shared shape for the create/edit employee form. Password is optional here
// (edit mode leaves it blank) and enforced as required only when creating,
// checked in the submit handler — keeping one schema avoids react-hook-form
// generic mismatches from swapping resolver schemas per mode.
export const employeeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.union([z.string().min(8, "At least 8 characters"), z.literal("")]),
  role: z.enum(["owner", "employee"]),
  phone: z.string().optional(),
  tfn: z.string().optional(),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
  rate_weekday: z.string().optional(),
  rate_weekend: z.string().optional(),
  permissions: z.array(z.string()),
  branch_ids: z.array(z.number()),
});
export type EmployeeFormPayload = z.infer<typeof employeeFormSchema>;

export type CreateUserPayload = Omit<EmployeeFormPayload, "password"> & {
  password: string;
};
export type EditUserPayload = Omit<EmployeeFormPayload, "password">;
