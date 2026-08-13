import { cookies } from "next/headers";

const TOKEN_KEY = "auth_token";
const BRANCH_KEY = "selected_branch";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value ?? null;
}

export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
}

export async function getSelectedBranch(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(BRANCH_KEY)?.value ?? null;
}

export async function setSelectedBranch(branchId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(BRANCH_KEY, branchId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSelectedBranch(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(BRANCH_KEY);
}
