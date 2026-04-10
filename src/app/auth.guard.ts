export const AUTH_SESSION_STORAGE_KEY = "nvrs-qqm-auth-session";

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  issuedAt: number;
  expiresAt: number;
  user?: {
    id?: string;
    username?: string;
    email?: string;
  };
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const segments = token.split(".");
  if (segments.length !== 3) {
    return null;
  }

  try {
    const normalized = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = window.atob(padded);
    const payload = JSON.parse(decoded) as unknown;
    return isObject(payload) ? payload : null;
  } catch {
    return null;
  }
}

function normalizeSession(value: unknown): AuthSession | null {
  if (!isObject(value)) {
    return null;
  }

  if (typeof value.accessToken !== "string" || typeof value.issuedAt !== "number" || typeof value.expiresAt !== "number") {
    return null;
  }

  return {
    accessToken: value.accessToken,
    refreshToken: typeof value.refreshToken === "string" ? value.refreshToken : undefined,
    issuedAt: value.issuedAt,
    expiresAt: value.expiresAt,
    user: isObject(value.user)
      ? {
          id: typeof value.user.id === "string" ? value.user.id : undefined,
          username: typeof value.user.username === "string" ? value.user.username : undefined,
          email: typeof value.user.email === "string" ? value.user.email : undefined,
        }
      : undefined,
  };
}

export function getStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as unknown;
    return normalizeSession(parsed);
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function storeAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function isAuthSessionExpired(session: AuthSession): boolean {
  if (!session.accessToken || !Number.isFinite(session.expiresAt)) {
    return true;
  }

  const jwtPayload = decodeJwtPayload(session.accessToken);
  if (jwtPayload && typeof jwtPayload.exp === "number") {
    return jwtPayload.exp * 1000 <= Date.now();
  }

  return session.expiresAt <= Date.now();
}

export function getValidAuthSession(): AuthSession | null {
  const session = getStoredAuthSession();
  if (!session) {
    return null;
  }

  if (isAuthSessionExpired(session)) {
    clearAuthSession();
    return null;
  }

  return session;
}

export function hasValidAuthSession(): boolean {
  return getValidAuthSession() !== null;
}
