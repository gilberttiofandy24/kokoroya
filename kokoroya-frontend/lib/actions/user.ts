"use server";

import {
  getUsers,
  getPermissions,
  createUser,
  updateUser,
  deleteUser,
  setUserPermissions,
  setUserBranches,
} from "@/api/user";
import type { CreateUserPayload, EditUserPayload } from "@/schema/user/user.schema";

function toNumberOrUndefined(value?: string) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export async function getUsersAction() {
  return getUsers();
}

export async function getPermissionsAction() {
  return getPermissions();
}

export async function createUserAction(payload: CreateUserPayload) {
  return createUser({
    ...payload,
    rate_weekday: toNumberOrUndefined(payload.rate_weekday),
    rate_weekend: toNumberOrUndefined(payload.rate_weekend),
  });
}

export async function updateUserAction(id: number, payload: EditUserPayload) {
  const { permissions, branch_ids, rate_weekday, rate_weekend, ...rest } = payload;
  await updateUser(id, {
    ...rest,
    rate_weekday: toNumberOrUndefined(rate_weekday),
    rate_weekend: toNumberOrUndefined(rate_weekend),
  });
  await setUserPermissions(id, permissions);
  await setUserBranches(id, branch_ids);
}

export async function toggleUserActiveAction(id: number, isActive: boolean) {
  await updateUser(id, { is_active: isActive });
}

export async function deleteUserAction(id: number) {
  await deleteUser(id);
}
