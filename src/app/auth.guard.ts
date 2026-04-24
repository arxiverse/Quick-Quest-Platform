export const AUTH_SESSION_STORAGE_KEY = "nvrs-qqm-auth-session";

export type AuthSession = {
  accessToken?: string;
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

function normalizeSession(value: unknown): AuthSession | null {
  if (!isObject(value)) {
    return null;
  }

  if (typeof value.issuedAt !== "number" || typeof value.expiresAt !== "number") {
    return null;
  }

  return {
    accessToken: typeof value.accessToken === "string" ? value.accessToken : undefined,
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

function sanitizeSessionForStorage(session: AuthSession): AuthSession {
  return {
    issuedAt: session.issuedAt,
    expiresAt: session.expiresAt,
    refreshToken: session.refreshToken,
    user: session.user,
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
    const normalized = normalizeSession(parsed);
    if (!normalized) {
      return null;
    }

    // Migrate old storage format that still contains raw accessToken.
    if (normalized.accessToken) {
      const sanitized = sanitizeSessionForStorage(normalized);
      window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(sanitized));
      return sanitized;
    }

    return normalized;
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

  const sanitizedSession = sanitizeSessionForStorage(session);
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(sanitizedSession));
}

export function isAuthSessionExpired(session: AuthSession): boolean {
  if (!Number.isFinite(session.expiresAt)) {
    return true;
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
