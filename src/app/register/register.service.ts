import GlobalEndpoint, { ApiRequestError, postJson } from "../global.service";

export type RegisterRequestPayload = {
  username: string;
  email: string;
  phone: string;
  fullname: string;
  birthdate: string;
  province: string;
  city: string;
  district: string;
  sub_district: string;
  full_address: string;
  tags_skills: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      username: string;
      email: string;
      phone: string;
    };
    auth?: {
      id: string;
      auth_token?: string;
    };
    sync?: unknown;
    sync_enabled?: boolean;
  };
};

export async function registerUser(payload: RegisterRequestPayload): Promise<RegisterResponse> {
  const endpoints = GlobalEndpoint();

  try {
    return await postJson<RegisterRequestPayload, RegisterResponse>(endpoints.auth.register, payload);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    throw new ApiRequestError("Register gagal dikirim ke backend.");
  }
}

export function getRegisterServiceErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiRequestError || error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
