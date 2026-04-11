export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiErrorPayload = {
  success?: boolean;
  message?: string;
  error?: string;
  details?: unknown;
};

export class ApiRequestError extends Error {
  statusCode: number;
  payload?: ApiErrorPayload;

  constructor(message: string, statusCode = 500, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

const API_BASE_URLS = {
  express: import.meta.env.VITE_EXPRESS_API_URL ?? "http://localhost:4450",
  go: import.meta.env.VITE_GO_API_URL ?? "http://localhost:4460",
};

const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URLS.express}/api/login`,
    register: `${API_BASE_URLS.express}/api/register`,
  },
  profile: {
    detail: `${API_BASE_URLS.express}/api/profile`,
  },
  gateway: {
    register: `${API_BASE_URLS.go}/auth/register`,
  },
};

export type RequestJsonOptions = {
  method?: ApiMethod;
  body?: unknown;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
};

function parseResponsePayload(rawText: string): unknown {
  if (!rawText) {
    return undefined;
  }

  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    return rawText;
  }
}

function toApiErrorPayload(payload: unknown): ApiErrorPayload {
  if (payload && typeof payload === "object") {
    return payload as ApiErrorPayload;
  }

  if (typeof payload === "string" && payload.trim()) {
    return { message: payload.trim() };
  }

  return {};
}

export async function requestJson<TResponse>(url: string, options: RequestJsonOptions = {}): Promise<TResponse> {
  const { method = "GET", body, headers, credentials = "include" } = options;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials,
    });
  } catch (error) {
    throw new ApiRequestError(
      error instanceof Error ? error.message : "Gagal terhubung ke backend.",
      0,
    );
  }

  const rawText = await response.text();
  const payload = parseResponsePayload(rawText);

  if (!response.ok) {
    const errorPayload = toApiErrorPayload(payload);
    throw new ApiRequestError(
      errorPayload.message || errorPayload.error || `Request ke ${url} gagal.`,
      response.status,
      errorPayload,
    );
  }

  return payload as TResponse;
}

export function postJson<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
  return requestJson<TResponse>(url, {
    method: "POST",
    body,
  });
}

function GlobalEndpoint() {
  return ENDPOINTS;
}

export default GlobalEndpoint;