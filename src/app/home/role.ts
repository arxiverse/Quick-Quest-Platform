// role.ts — Layer Logika Bisnis (Angular-like)
// Tugas: Inisialisasi role berbasis backend (cookie session + /api/profile).

import { normalizeBackendUserRole, type BackendUserRole, type RoleMode } from "./role.util";
import type { RoleInitPayload } from "./role.service";

export type RoleInitResult = {
  role: RoleMode;
  isGiverVerified: boolean;
  backendUserRole: BackendUserRole;
  shouldForceLogout: boolean;
  profileData?: {
    fullname: string;
    email: string;
    phone: string;
    full_address: string;
  };
};

export function initRoleFromProfile(payload: RoleInitPayload | null): RoleInitResult {
  if (!payload) {
    return {
      role: "runner",
      isGiverVerified: false,
      backendUserRole: "user_runner",
      shouldForceLogout: true,
    };
  }

  const backendUserRole = normalizeBackendUserRole(payload.user_role);
  const isUnlocked = backendUserRole === "user_unlocked";

  return {
    role: "runner",
    isGiverVerified: isUnlocked,
    backendUserRole,
    shouldForceLogout: false,
    profileData: {
      fullname: payload.fullname,
      email: payload.email,
      phone: payload.phone,
      full_address: payload.full_address,
    },
  };
}
