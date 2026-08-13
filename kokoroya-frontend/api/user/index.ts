import { api } from "@/lib/api";
import type {
  MeResponse,
  PermissionsResponse,
  UsersResponse,
  UserResponse,
  CreateUserPayload,
  EditUserPayload,
} from "@/schema/user/user.schema";

type CreateUserRequest = Omit<CreateUserPayload, "rate_weekday" | "rate_weekend"> & {
  rate_weekday?: number;
  rate_weekend?: number;
};
type UpdateUserRequest = Partial<
  Omit<EditUserPayload, "rate_weekday" | "rate_weekend"> & {
    is_active: boolean;
    rate_weekday: number;
    rate_weekend: number;
  }
>;

export async function getMe() {
  const res = await api.get<MeResponse>("/me");
  return res.data!;
}

export async function getPermissions() {
  const res = await api.get<PermissionsResponse>("/permissions");
  return res.data ?? { pages: [] };
}

export async function getUsers() {
  const res = await api.get<UsersResponse>("/users");
  return res.data ?? [];
}

export async function createUser(payload: CreateUserRequest) {
  const res = await api.post<UserResponse>("/users", payload);
  return res.data!;
}

export async function updateUser(id: number, payload: UpdateUserRequest) {
  const res = await api.patch<UserResponse>(`/users/${id}`, payload);
  return res.data!;
}

export async function deleteUser(id: number) {
  await api.delete(`/users/${id}`);
}

export async function setUserPermissions(id: number, permissions: string[]) {
  await api.patch(`/users/${id}/permissions`, { permissions });
}

export async function setUserBranches(id: number, branchIds: number[]) {
  await api.patch(`/users/${id}/branches`, { branch_ids: branchIds });
}
