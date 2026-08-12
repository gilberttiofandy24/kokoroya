import z from "zod";
import { BaseResponse } from "@/lib/api";

export const loginPayloadSchema = z.object({
  email: z
    .string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email Not Valid"),
  password: z.string().min(1, "Password is required"),
});
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

export interface LoginResponseData {
  access_token: string;
  expires_at: string;
  role: string;
}

export type LoginResponse = BaseResponse<LoginResponseData>;
