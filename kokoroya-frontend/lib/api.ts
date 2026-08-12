import { getToken } from "@/lib/auth";
import { env } from "@/env";

const BASE_URL = env.NEXT_PUBLIC_API_URL;

export interface BaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function buildUrl(path: string): string {
  return new URL(
    path.replace(/^\//, ""),
    BASE_URL.replace(/\/?$/, "/"),
  ).toString();
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const token = await getToken();
  const res = await fetch(buildUrl(path), {
    ...init,
    method,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init?.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const json: BaseResponse<unknown> = await res.json().catch(() => ({
    success: false,
    error: res.statusText,
  }));

  if (!json.success) {
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>("GET", path, undefined, init),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("POST", path, body, init),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("PUT", path, body, init),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("PATCH", path, body, init),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>("DELETE", path, undefined, init),
};
