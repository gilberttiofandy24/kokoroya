import { api } from "@/lib/api";
import type { PunchResponse } from "@/schema/clock/clock.schema";

export async function punch(pin: string) {
  const res = await api.post<PunchResponse>("/clock/punch", { pin });
  return res.data!;
}
