import { cache } from "react";
import { getMe } from "@/api/user";
import type { MeResponseData } from "@/schema/user/user.schema";

export const getCurrentUser = cache(getMe);

export function canAccess(user: MeResponseData, page: string): boolean {
  return user.role === "owner" || user.permissions.includes(page);
}
