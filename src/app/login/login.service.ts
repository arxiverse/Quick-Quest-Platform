import GlobalEndpoint, { ApiRequestError, postJson } from "../global.service";

export type LoginRequestPayload = {
  identity: string;
  password: string;
};

export type LoginSessionPayload = {
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

export type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    session: LoginSessionPayload;
    authorization: string;
  };
};

export function normalizeLoginPayload(identity: string, password: string): LoginRequestPayload {
  return {
    identity: identity.trim(),
    password,
  };
}

export async function loginWithCredentials(identity: string, password: string): Promise<LoginResponse> {
  const payload = normalizeLoginPayload(identity, password);

  if (!payload.identity || !payload.password.trim()) {
    throw new ApiRequestError("Identity dan password wajib diisi.", 400);
  }

  const endpoints = GlobalEndpoint();

  try {
    return await postJson<LoginRequestPayload, LoginResponse>(endpoints.auth.login, payload);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    throw new ApiRequestError("Login gagal dikirim ke backend.");
  }
}

export function getLoginServiceErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiRequestError || error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
