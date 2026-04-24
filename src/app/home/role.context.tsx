import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { initRoleFromSystem } from "./role";
import {
  normalizeBackendUserRole,
  type BackendUserRole,
  type RoleMode,
} from "./role.util";

interface RoleContextType {
  role: RoleMode;
  backendUserRole: BackendUserRole;
  isRoleReady: boolean;
  switchRole: (newRole: RoleMode) => void;
  isGiverVerified: boolean;
  verifyGiverIdentity: () => void; // Mock unlock sampai endpoint activate-giver tersedia
  syncUserRoleFromBackend: (userRole: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleMode>("runner");
  const [backendUserRole, setBackendUserRole] =
    useState<BackendUserRole>("user_runner");
  const [isGiverVerified, setIsGiverVerified] = useState<boolean>(false);
  const [isRoleReady, setIsRoleReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function initializeRole() {
      const result = await initRoleFromSystem();
      if (!isMounted) return;

      if (result.shouldForceLogout) {
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
          return;
        }
        setIsRoleReady(true);
        return;
      }

      setRole(result.role);
      setBackendUserRole(result.backendUserRole);
      setIsGiverVerified(result.isGiverVerified);
      setIsRoleReady(true);
    }

    initializeRole();
    return () => {
      isMounted = false;
    };
  }, []);

  const switchRole = useCallback((newRole: RoleMode) => {
    if (newRole === "giver" && !isGiverVerified) {
      return;
    }
    setRole(newRole);
    window.dispatchEvent(new Event("qqm-role-update"));
  }, [isGiverVerified]);

  const verifyGiverIdentity = useCallback(() => {
    setIsGiverVerified(true);
    setBackendUserRole("user_unlocked");
    window.dispatchEvent(new Event("qqm-role-update"));
  }, []);

  const syncUserRoleFromBackend = useCallback((userRole: string) => {
    const normalizedRole = normalizeBackendUserRole(userRole);
    const unlocked = normalizedRole === "user_unlocked";

    setBackendUserRole(normalizedRole);
    setIsGiverVerified(unlocked);
    if (!unlocked || role !== "giver") {
      setRole("runner");
    }
    window.dispatchEvent(new Event("qqm-role-update"));
  }, [role]);

  const contextValue = useMemo<RoleContextType>(
    () => ({
      role,
      backendUserRole,
      isRoleReady,
      switchRole,
      isGiverVerified,
      verifyGiverIdentity,
      syncUserRoleFromBackend,
    }),
    [
      role,
      backendUserRole,
      isRoleReady,
      switchRole,
      isGiverVerified,
      verifyGiverIdentity,
      syncUserRoleFromBackend,
    ],
  );

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context)
    throw new Error("useRole harus digunakan didalam RoleProvider.");
  return context;
}
