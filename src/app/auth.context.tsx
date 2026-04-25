import { createContext, useContext, useState, type ReactNode } from "react";
import type { RoleInitPayload } from "./home/role.service";
import GlobalEndpoint, { clearAccessToken, requestJson } from "./global.service";

const AUTH_PROFILE_STORAGE_KEY = "qqm-auth-profile";

function readPersistedAuthProfile(): RoleInitPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(AUTH_PROFILE_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as RoleInitPayload;
  } catch {
    window.sessionStorage.removeItem(AUTH_PROFILE_STORAGE_KEY);
    return null;
  }
}

function persistAuthProfile(profile: RoleInitPayload | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!profile) {
    window.sessionStorage.removeItem(AUTH_PROFILE_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(AUTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthReady: boolean;
  userProfile: RoleInitPayload | null;
  setAuthenticatedProfile: (profile: RoleInitPayload) => void;
  refreshSession: () => Promise<void>;
  logoutClient: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<RoleInitPayload | null>(() => readPersistedAuthProfile());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(readPersistedAuthProfile()));
  const [isAuthReady, setIsAuthReady] = useState(true);

  const refreshSession = async () => {
    const persisted = readPersistedAuthProfile();
    setUserProfile(persisted);
    setIsAuthenticated(Boolean(persisted));
    setIsAuthReady(true);
  };

  const setAuthenticatedProfile = (profile: RoleInitPayload) => {
    persistAuthProfile(profile);
    setUserProfile(profile);
    setIsAuthenticated(true);
    setIsAuthReady(true);
  };

  const logoutClient = async () => {
    try {
      await requestJson(GlobalEndpoint().auth.logout, { method: "POST" });
    } catch {
      // Silent error. Even if backend fails, force clean local state.
    }
    persistAuthProfile(null);
    clearAccessToken();
    setUserProfile(null);
    setIsAuthenticated(false);
    setIsAuthReady(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthReady, userProfile, setAuthenticatedProfile, refreshSession, logoutClient }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan didalam AuthProvider.");
  return context;
}
