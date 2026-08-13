"use server";

import { punch } from "@/api/clock";

export async function punchAction(pin: string) {
  try {
    const data = await punch(pin);
    return { success: true as const, data };
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Invalid PIN",
    };
  }
}
