import { api } from "@/lib/api";
import type { LoginPayload, LoginResponse } from "@/schema/auth/auth.schema";

export async function postLogin(payload: LoginPayload) {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  return res.data!; // success:false already threw inside api.post
}

export async function postLogout() {
  await api.post("/auth/logout");
}
