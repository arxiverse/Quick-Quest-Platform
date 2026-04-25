import GlobalEndpoint, { ApiRequestError, postJson } from "../global.service";
import GoogleLogo from "../../assets/svg/google-logo.svg";
import LinkedinLogo from "../../assets/svg/linkedin-logo.svg";
import type {
  AuthSocialItem,
  RegisterFieldName,
  RegisterFormState,
  RegisterStep,
} from "./register";

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
      user_role?: string;
    };
    auth?: {
      id: string;
      auth_token?: string;
    };
    role_switch_enabled?: boolean;
    sync?: unknown;
    sync_enabled?: boolean;
  };
};

export type RegisterViewCopy = {
  otpPanelPrefixLabel: string;
  otpPanelHelpLabel: string;
  socialSectionLabel: string;
  loginPrefixLabel: string;
  loginLinkLabel: string;
};

function requireRegisterData(response: RegisterResponse): RegisterResponse["data"] {
  if (!response.success || !response.data?.user?.id) {
    throw new ApiRequestError(response.message || "Response register tidak valid dari backend.", 500);
  }

  return response.data;
}

export const REGISTER_DUMMY_OTP_CODE = "123456";

export const registerSocialItemsSeed: AuthSocialItem[] = [
  {
    icon: GoogleLogo,
    label: "Google",
  },
  {
    icon: LinkedinLogo,
    label: "Linked In",
    className: "hover:bg-blue-500/10",
  },
];

export const registerInitialFormStateSeed: RegisterFormState = {
  username: "",
  email: "",
  phone: "",
  otp_code: "",
  fullname: "",
  birthdate: "",
  province: "",
  city: "",
  district: "",
  sub_district: "",
  full_address: "",
  tags_skills: "",
  password: "",
};

export const registerTimelineStepsSeed: RegisterStep[] = [
  {
    key: "account",
    title: "Register",
    headline: "Bikin akun Quick Quest dulu.",
    description: "Langkah awal buat ngedaftarin username, email, sama nomor HP aktif.",
    orderLabel: "1 / 5",
    fields: [
      { label: "Username", type: "text", name: "username", placeholder: "neiraverse" },
      { label: "Email", type: "email", name: "email", placeholder: "nama@email.com" },
      { label: "Nomor HP", type: "tel", name: "phone", placeholder: "081234567890" },
    ],
    nextLabel: "Verifikasi OTP",
  },
  {
    key: "otp",
    title: "OTP Verification",
    headline: "Masukin OTP dummy dulu buat ngelewatin verifikasi.",
    description: "Engine OTP belum nyala, jadi sementara kita pakai kode dummy 6 digit di frontend dulu.",
    orderLabel: "2 / 5",
    fields: [
      {
        label: "Kode OTP",
        type: "text",
        name: "otp_code",
        placeholder: "Masukin 6 digit kode OTP",
      },
    ],
    nextLabel: "Lanjut Identitas",
  },
  {
    key: "identity",
    title: "Identitas",
    headline: "Lengkapi data diri biar matching quest lebih akurat.",
    description: "Data wilayah dan alamat dipakai buat nentuin radius kerja dan distribusi task.",
    orderLabel: "3 / 5",
    fields: [
      { label: "Nama Lengkap", type: "text", name: "fullname", placeholder: "Neira Verse" },
      { label: "Tanggal Lahir", type: "date", name: "birthdate" },
      { label: "Provinsi", type: "text", name: "province", placeholder: "Jawa Barat" },
      { label: "Kota / Kabupaten", type: "text", name: "city", placeholder: "Bandung" },
      { label: "Kecamatan", type: "text", name: "district", placeholder: "Coblong" },
      { label: "Kelurahan / Desa", type: "text", name: "sub_district", placeholder: "Dago" },
      {
        label: "Alamat Lengkap",
        type: "text",
        name: "full_address",
        as: "textarea",
        rows: 3,
        placeholder: "Jl. Contoh No. 10, RT/RW, patokan rumah",
      },
    ],
    nextLabel: "Lanjut Skill",
  },
  {
    key: "skills",
    title: "Skill User",
    headline: "Kasih tahu skill yang kamu kuasai.",
    description: "Pisahin pakai koma biar backend gampang mapping ke kategori quest dan rank lokal.",
    orderLabel: "4 / 5",
    fields: [
      {
        label: "Tags Skill",
        type: "text",
        name: "tags_skills",
        as: "textarea",
        rows: 4,
        placeholder: "Cleaning, Display, Survey, Coding",
      },
    ],
    nextLabel: "Lanjut Password",
  },
  {
    key: "password",
    title: "Password",
    headline: "Kunci akunmu sebelum masuk ke sistem.",
    description: "Password minimal 8 karakter dan nanti bakal di-hash di backend, jadi di sini kita rapihin dulu inputnya.",
    orderLabel: "5 / 5",
    fields: [
      { label: "Password", type: "password", name: "password", placeholder: "Minimal 8 karakter" },
    ],
    nextLabel: "Buat Akun",
  },
];

export const registerStepFlowSeed: RegisterStep["key"][] = [
  "account",
  "otp",
  "identity",
  "skills",
  "password",
];

export const registerStepFieldsSeed: Record<RegisterStep["key"], RegisterFieldName[]> = {
  account: ["username", "email", "phone"],
  otp: ["otp_code"],
  identity: ["fullname", "birthdate", "province", "city", "district", "sub_district", "full_address"],
  skills: ["tags_skills"],
  password: ["password"],
};

export const registerViewCopySeed: RegisterViewCopy = {
  otpPanelPrefixLabel: "OTP dummy sementara:",
  otpPanelHelpLabel: "Masukin kode ini dulu biar step verifikasi tetap kebaca kayak alur production.",
  socialSectionLabel: "Atau menggunakan",
  loginPrefixLabel: "Sudah punya akun?",
  loginLinkLabel: "Login",
};

export async function registerUser(payload: RegisterRequestPayload): Promise<RegisterResponse> {
  const endpoints = GlobalEndpoint();

  try {
    const response = await postJson<RegisterRequestPayload, RegisterResponse>(endpoints.auth.register, payload);
    requireRegisterData(response);
    return response;
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
