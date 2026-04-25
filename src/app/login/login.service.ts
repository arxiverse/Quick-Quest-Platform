import GlobalEndpoint, { ApiRequestError, postJson } from "../global.service";
import GoogleLogo from "../../assets/svg/google-logo.svg";
import WhatsappLogo from "../../assets/svg/whatsapp-logo.svg";
import LinkedinLogo from "../../assets/svg/linkedin-logo.svg";
import type { AuthSocialItem, LoginField } from "./login";
import type { RoleInitPayload } from "../home/role.service";

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
    phone?: string;
    fullname?: string;
    full_address?: string;
    user_role?: string;
  };
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    session: LoginSessionPayload;
    authorization: string;
    user_role?: string;
    role_switch_enabled?: boolean;
  };
};

export type LoginViewCopy = {
  title: string;
  rememberLabel: string;
  forgotPasswordLabel: string;
  submitLabel: string;
  submittingLabel: string;
  continueWithLabel: string;
  registerPrefixLabel: string;
  registerLinkLabel: string;
};

function requireLoginSession(response: LoginResponse): LoginResponse["data"] {
  if (!response.success || !response.data?.session) {
    throw new ApiRequestError(response.message || "Session login tidak valid dari backend.", 500);
  }

  return response.data;
}

export const loginFieldsSeed: LoginField[] = [
  {
    label: "Username / Email / No. HP",
    type: "text",
    name: "identity",
  },
  {
    label: "Password",
    type: "password",
    name: "password",
  },
];

export const loginSocialItemsSeed: AuthSocialItem[] = [
  {
    icon: GoogleLogo,
    label: "Google",
  },
  {
    icon: WhatsappLogo,
    label: "HP",
    className: "hover:bg-green-500/10",
  },
  {
    icon: LinkedinLogo,
    label: "Linked In",
    className: "hover:bg-blue-500/10",
  },
];

export const loginViewCopySeed: LoginViewCopy = {
  title: "Login",
  rememberLabel: "Simpan Informasi",
  forgotPasswordLabel: "Lupa Password?",
  submitLabel: "Login",
  submittingLabel: "Masuk...",
  continueWithLabel: "Lanjutkan Menggunakan",
  registerPrefixLabel: "Belum punya akun?",
  registerLinkLabel: "Registrasi",
};

export function normalizeLoginPayload(identity: string, password: string): LoginRequestPayload {
  return {
    identity: identity.trim(),
    password,
  };
}

export function mapLoginResponseToRoleInitPayload(response: LoginResponse): RoleInitPayload {
  const sessionUser = response.data?.session?.user;
  const userRole = sessionUser?.user_role ?? response.data?.user_role ?? "user_runner";
  const authorization = response.data?.authorization?.trim() || "user";

  return {
    id: sessionUser?.id ?? "",
    user_role: userRole as RoleInitPayload["user_role"],
    authorization,
    fullname: sessionUser?.fullname ?? "",
    email: sessionUser?.email ?? "",
    phone: sessionUser?.phone ?? "",
    full_address: sessionUser?.full_address ?? "",
  };
}

export async function loginWithCredentials(identity: string, password: string): Promise<LoginResponse> {
  const payload = normalizeLoginPayload(identity, password);

  if (!payload.identity || !payload.password.trim()) {
    throw new ApiRequestError("Identity dan password wajib diisi.", 400);
  }

  const endpoints = GlobalEndpoint();

  try {
    const response = await postJson<LoginRequestPayload, LoginResponse>(endpoints.auth.login, payload);
    requireLoginSession(response);
    return response;
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
