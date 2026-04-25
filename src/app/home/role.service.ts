// role.service.ts — Layer Service (Angular-like)
// Tugas: HANYA menyediakan jalur ke backend via global.service.ts.
// Tidak ada logika bisnis di sini. Logika ada di role.ts.

import GlobalEndpoint, { ApiRequestError, requestJson } from "../global.service";
import type { BackendUserRole } from "./role.util";

export type RoleInitPayload = {
  id?: string;
  user_role: BackendUserRole;
  authorization: string;
  fullname: string;
  email: string;
  phone: string;
  full_address: string;
};

export type RoleInitResponse = {
  success: boolean;
  message: string;
  data?: RoleInitPayload;
};

export async function fetchRoleInitData(): Promise<RoleInitPayload> {
  const endpoints = GlobalEndpoint();
  const response = await requestJson<RoleInitResponse>(endpoints.profile.detail, {
    method: "GET",
    credentials: "include",
  });

  if (!response.success || !response.data) {
    throw new ApiRequestError(response.message || "Data role tidak valid dari backend.", 500);
  }

  return response.data;
}
