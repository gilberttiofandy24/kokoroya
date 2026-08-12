"use server";

import { postLogin } from "@/api/auth";
import type { LoginPayload } from "@/schema/auth/auth.schema";
import { setToken } from "@/lib/auth";

export async function loginAction(payload: LoginPayload) {
  const data = await postLogin(payload);
  await setToken(data.access_token);
}
