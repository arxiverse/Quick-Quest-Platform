import GlobalEndpoint, { ApiRequestError, requestJson } from "../../../global.service";

export type ProfileDetailPayload = {
  fullname: string;
  email: string;
  phone: string;
  full_address: string;
};

export type ProfileDetailResponse = {
  success: boolean;
  message: string;
  data?: ProfileDetailPayload;
};

export async function getProfileDetailFromApi(): Promise<ProfileDetailPayload> {
  const endpoints = GlobalEndpoint();
  const response = await requestJson<ProfileDetailResponse>(endpoints.profile.detail, {
    method: "GET",
    credentials: "include",
  });

  if (!response.success || !response.data) {
    throw new ApiRequestError(response.message || "Data profile dari backend tidak valid.", 502);
  }

  return response.data;
}

export function getProfileServiceErrorStatus(error: unknown): number | null {
  return error instanceof ApiRequestError ? error.statusCode : null;
}

export function getProfileServiceErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiRequestError || error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
