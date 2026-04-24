// role.ts — Layer Logika Bisnis (Angular-like)
// Tugas: Inisialisasi role berbasis backend (cookie session + /api/profile).

import { ApiRequestError } from "../global.service";
import { clearAuthSession, getValidAuthSession } from "../auth.guard";
import { fetchRoleInitData } from "./role.service";
import { normalizeBackendUserRole, type BackendUserRole, type RoleMode } from "./role.util";

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

export async function initRoleFromSystem(): Promise<RoleInitResult> {
  const session = getValidAuthSession();
  if (!session) {
    clearAuthSession();
    return {
      role: "runner",
      isGiverVerified: false,
      backendUserRole: "user_runner",
      shouldForceLogout: false,
    };
  }

  try {
    const payload = await fetchRoleInitData();
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
  } catch (error) {
    if (error instanceof ApiRequestError && error.statusCode === 401) {
      clearAuthSession();
      return {
        role: "runner",
        isGiverVerified: false,
        backendUserRole: "user_runner",
        shouldForceLogout: true,
      };
    }

    return {
      role: "runner",
      isGiverVerified: false,
      backendUserRole: "user_runner",
      shouldForceLogout: false,
    };
  }
}
